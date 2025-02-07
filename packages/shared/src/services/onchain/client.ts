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
import { P, match } from "ts-pattern";

import {
  SPLToken,
  SubscriptionType,
  TOKEN_ADDRESSES,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import {
  Observable,
  convertBNToNumberWithDecimals,
  convertNumberToBNWithDecimals
} from "@repo/shared/utils";

import {
  AirDropSOLError,
  AssociatedTokenAddressError,
  CreateTokenAccountError,
  DepositToVaultError
} from "./errors";
import IDL, { type DepositProgram } from "./idl";
import { EventCallbackMap } from "./types";

export class AnchorClient extends Observable<EventCallbackMap> {
  private TOKEN_PROGRAM = TOKEN_PROGRAM_ID;

  constructor(private provider: AnchorProvider) {
    super();

    this.provider = provider;
  }

  private get user() {
    return this.provider.wallet.publicKey;
  }

  private get connection() {
    return this.provider.connection;
  }

  public async depositToVault({
    token,
    amount,
    subscriptionType
  }: {
    amount: BN;
    token: SPLToken;
    subscriptionType: SubscriptionType;
  }): Promise<string> {
    try {
      const program = new Program(IDL as DepositProgram, this.provider);

      const payload = {
        user: this.user,
        token: TOKEN_ADDRESSES[token],
        tokenProgram: this.TOKEN_PROGRAM
      };

      const normalizedAmount = convertNumberToBNWithDecimals(
        amount,
        TOKEN_CURRENCIES[token].decimals
      );

      const transactionSignature = await match(subscriptionType)
        .returnType<Promise<string>>()
        // not used for now
        // .with(
        //   SubscriptionType.PER_MONTH,
        //   async () =>
        //     await program.methods
        //       .depositToSubscriptionVault(normalizedAmount)
        //       .accounts({ ...payload })
        //       .rpc()
        // )
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

  private async getTokenMint(token: PublicKey) {
    const tokenMint = await getMint(this.connection, token);

    return tokenMint;
  }

  private async airdropSOL() {
    const SOL_AMOUNT = 1;

    try {
      const [latestBlockhash, signature] = await Promise.all([
        this.connection.getLatestBlockhash(),
        this.connection.requestAirdrop(this.user, SOL_AMOUNT * LAMPORTS_PER_SOL)
      ]);
      const signatureResult = await this.connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      if (signatureResult) {
        this.emit("airdropSOL");
      }
    } catch (error: any) {
      throw new AirDropSOLError(error.message);
    }
  }

  public async checkUserTokenAccount({ token }: { token: SPLToken }) {
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
      await getAccount(this.connection, userATA, undefined, this.TOKEN_PROGRAM);
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

  public async getTokenBalance({ token }: { token: SPLToken }) {
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
        this.connection,
        userATA,
        undefined,
        this.TOKEN_PROGRAM
      );

      return convertBNToNumberWithDecimals(
        amount,
        TOKEN_CURRENCIES[token].decimals
      );
    } catch {
      return 0;
    }
  }

  public async airdropSOLIfRequired() {
    try {
      const balance = await this.getSOLBalance();

      if (!balance) {
        await this.airdropSOL();
      }
    } catch (error: any) {
      throw new AirDropSOLError(error.message);
    }
  }

  public async getSOLBalance() {
    return this.connection.getBalance(this.user);
  }
}
