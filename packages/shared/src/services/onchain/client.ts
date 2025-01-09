import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  TokenAccountNotFoundError,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint
} from "@solana/spl-token";
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import { fold, left, right, tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { P, match } from "ts-pattern";

import {
  DepositToken,
  SubscriptionType,
  TOKEN_ADDRESSES,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { numberToBN } from "@repo/shared/utils";

import { Observable } from "../observable";
import {
  AssociatedTokenAddressError,
  CreateTokenAccountError,
  DepositToVaultError,
  DropSOLError
} from "./errors";
import IDL, { type DepositProgram } from "./idl";
import { EventCallbackMap } from "./types";

export class AnchorClient extends Observable<EventCallbackMap> {
  private TOKEN_PROGRAM = TOKEN_PROGRAM_ID;

  constructor(
    private user: PublicKey,
    private provider: AnchorProvider
  ) {
    super();

    this.user = user;
    this.provider = provider;
  }

  public async depositToVault({
    token,
    amount,
    subscriptionType
  }: {
    amount: BN;
    token: DepositToken;
    subscriptionType: SubscriptionType;
  }): Promise<string> {
    try {
      const program = new Program(IDL as DepositProgram, this.provider);

      const payload = {
        user: this.user,
        token: TOKEN_ADDRESSES[token],
        tokenProgram: this.TOKEN_PROGRAM
      };

      const normalizedAmount = numberToBN(
        amount,
        TOKEN_CURRENCIES[token].decimals
      );

      const transactionSignature = await match(subscriptionType)
        .returnType<Promise<string>>()
        .with(
          SubscriptionType.FREE_TRIAL,
          // todo: complete
          () => Promise.resolve("signature")
        )
        .with(
          SubscriptionType.PER_MONTH,
          async () =>
            await program.methods
              .depositToSubscriptionVault(normalizedAmount)
              .accounts({ ...payload })
              .rpc()
        )
        .with(
          SubscriptionType.PER_USAGE,
          async () =>
            await program.methods
              .depositToTimedVault(normalizedAmount)
              .accounts({ ...payload })
              .rpc()
        )
        .exhaustive();

      return transactionSignature;
    } catch (error: any) {
      throw new DepositToVaultError(error.message);
    }
  }

  private _depositToVaultFN({
    token,
    amount,
    subscriptionType
  }: {
    amount: BN;
    token: DepositToken;
    subscriptionType: SubscriptionType;
  }) {
    const program = new Program(IDL as DepositProgram, this.provider);

    const payload = {
      user: this.user,
      token: TOKEN_ADDRESSES[token],
      tokenProgram: this.TOKEN_PROGRAM
    };

    return pipe(
      match(subscriptionType)
        .with(SubscriptionType.FREE_TRIAL, () =>
          tryCatch(
            () => Promise.resolve("signature"),
            (error: any) => left(new DepositToVaultError(error.message))
          )
        )
        .with(SubscriptionType.PER_MONTH, () =>
          tryCatch(
            () =>
              program.methods
                .depositToSubscriptionVault(new BN(amount))
                .accounts({ ...payload })
                .rpc(),
            (error: any) => left(new DepositToVaultError(error.message))
          )
        )
        .with(SubscriptionType.PER_USAGE, () =>
          tryCatch(
            () =>
              program.methods
                .depositToTimedVault(new BN(amount))
                .accounts({ ...payload })
                .rpc(),
            (error: any) => left(new DepositToVaultError(error.message))
          )
        )
        .exhaustive(),
      fold(
        (error) => {
          throw error;
        },
        (signature) => right(signature)
      )
    )();
  }

  private async getTokenMint(token: PublicKey) {
    const tokenMint = await getMint(this.provider.connection, token);

    return tokenMint;
  }

  private async getAirdropSOL() {
    const SOL_AMOUNT = 1;

    try {
      const [latestBlockhash, signature] = await Promise.all([
        this.provider.connection.getLatestBlockhash(),
        this.provider.connection.requestAirdrop(
          this.user,
          SOL_AMOUNT * LAMPORTS_PER_SOL
        )
      ]);
      const signatureResult = await this.provider.connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      if (signatureResult) {
        this.emit("airdropSOL");
      }
    } catch (error: any) {
      throw new DropSOLError(error.message);
    }
  }

  public async checkUserTokenAccount({ token }: { token: DepositToken }) {
    let userATA: PublicKey;

    try {
      const tokenMint = await this.getTokenMint(
        new PublicKey(TOKEN_ADDRESSES[token])
      );

      userATA = await getAssociatedTokenAddress(
        tokenMint.address,
        this.user,
        false,
        this.TOKEN_PROGRAM
      );
    } catch (error: any) {
      throw new AssociatedTokenAddressError(error.message);
    }

    try {
      await getAccount(
        this.provider.connection,
        userATA,
        undefined,
        this.TOKEN_PROGRAM
      );
    } catch (error: any) {
      match(error)
        .with(P.instanceOf(TokenAccountNotFoundError), async () => {
          const tokenMint = await this.getTokenMint(
            new PublicKey(TOKEN_ADDRESSES[token])
          );

          await this.createAssociatedTokenAccount({
            tokenMintAddress: tokenMint.address,
            userATA
          });
        })
        .otherwise(() => {
          throw error;
        });
    }
  }

  private async createAssociatedTokenAccount({
    tokenMintAddress,
    userATA
  }: {
    tokenMintAddress: PublicKey;
    userATA: PublicKey;
  }) {
    try {
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          this.user,
          userATA,
          this.user,
          tokenMintAddress,
          this.TOKEN_PROGRAM
        )
      );

      await this.provider.sendAndConfirm(transaction, []);
    } catch (error: any) {
      throw new CreateTokenAccountError(error.message);
    }
  }

  public async getTokenBalance({ token }: { token: DepositToken }) {
    try {
      const tokenMint = await this.getTokenMint(
        new PublicKey(TOKEN_ADDRESSES[token])
      );

      const userATA = await getAssociatedTokenAddress(
        tokenMint.address,
        this.user,
        false,
        this.TOKEN_PROGRAM
      );

      const { amount } = await getAccount(
        this.provider.connection,
        userATA,
        undefined,
        this.TOKEN_PROGRAM
      );

      return Number(amount) / 10 ** TOKEN_CURRENCIES[token].decimals;
    } catch {
      return 0;
    }
  }

  public async airdropSOLIfRequired() {
    try {
      const balance = await this.getSOLBalance();

      if (!balance) {
        await this.getAirdropSOL();
      }
    } catch (error: any) {
      throw new DropSOLError(error.message);
    }
  }

  public async poolSOLBalanceChange(retries = 10, delay = 700) {
    for (let i = 0; i < retries; i++) {
      const balance = await this.getSOLBalance();

      if (balance > 0) {
        this.emit("SOLbalanceChange", balance);

        return;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  private async getSOLBalance() {
    return this.provider.connection.getBalance(this.user);
  }
}
