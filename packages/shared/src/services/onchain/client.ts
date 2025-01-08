import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint
} from "@solana/spl-token";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction
} from "@solana/web3.js";
import { fold, left, right, tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { match } from "ts-pattern";

import {
  DepositToken,
  SubscriptionType,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";

import IDL, { type DepositProgram } from "@/services/onchain/idl";

import { DepositToVaultError, TokenAccountNotFoundError } from "./errors";

export class AnchorClient {
  private TOKEN_ADDRESSES: Record<DepositToken, string> = {
    [DepositToken.USDC]: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    [DepositToken.SOL]: ""
  };
  private TOKEN_PROGRAM = TOKEN_PROGRAM_ID;

  constructor(
    private user: PublicKey,
    private provider: AnchorProvider
  ) {
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
    const program = new Program(IDL as DepositProgram, this.provider);

    const payload = {
      user: this.user,
      token: this.TOKEN_ADDRESSES[token],
      tokenProgram: this.TOKEN_PROGRAM
    };

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
            .depositToSubscriptionVault(new BN(amount))
            .accounts({ ...payload })
            .rpc()
      )
      .with(
        SubscriptionType.PER_USAGE,
        async () =>
          await program.methods
            .depositToTimedVault(new BN(amount))
            .accounts({ ...payload })
            .rpc()
      )
      .exhaustive();

    return transactionSignature;
  }

  public depositToVaultFN({
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
      token: this.TOKEN_ADDRESSES[token],
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

  public async depositToTimedVault({
    token,
    amount
  }: {
    amount: BN;
    token: DepositToken;
  }): Promise<string> {
    const program = new Program(IDL as DepositProgram, this.provider);

    const transactionSignature = await program.methods
      .depositToTimedVault(new BN(amount))
      .accounts({
        user: this.user,
        token: this.TOKEN_ADDRESSES[token],
        tokenProgram: this.TOKEN_PROGRAM
      })
      .rpc();

    return transactionSignature;
  }

  private async getTokenMint(token: PublicKey) {
    const tokenMint = await getMint(this.provider.connection, token);

    return tokenMint;
  }

  private async getAirdropSOL() {
    try {
      const [latestBlockhash, signature] = await Promise.all([
        this.provider.connection.getLatestBlockhash(),
        this.provider.connection.requestAirdrop(this.user, 1 * LAMPORTS_PER_SOL)
      ]);
      const signatureResult = await this.provider.connection.confirmTransaction(
        { signature, ...latestBlockhash },
        "confirmed"
      );

      if (signatureResult) {
        console.log("Airdrop was confirmed!");
      }
    } catch (error: any) {
      console.error("You are Rate limited for Airdrop", error.message);
    }
  }

  public async checkUserTokenAccount({ token }: { token: DepositToken }) {
    let userATA: PublicKey;

    try {
      const tokenMint = await this.getTokenMint(
        new PublicKey(this.TOKEN_ADDRESSES[token])
      );

      // Try to calculate the user's associated token account
      userATA = await getAssociatedTokenAddress(
        tokenMint.address,
        this.user,
        false,
        this.TOKEN_PROGRAM
      );
    } catch (error: any) {
      throw new Error(
        `Failed to calculate associated token account: ${error.message}`
      );
    }

    try {
      // Fetch the account details to check if it exists
      await getAccount(
        this.provider.connection,
        userATA,
        undefined,
        this.TOKEN_PROGRAM
      );
    } catch (error: any) {
      if (error.message.includes("Token account not found")) {
        console.log(
          "Token account not found. Creating a new associated token account..."
        );
        const tokenMint = await this.getTokenMint(
          new PublicKey(this.TOKEN_ADDRESSES[token])
        );
        await this.createAssociatedTokenAccount(tokenMint.address, userATA);
      } else {
        throw new TokenAccountNotFoundError(error.message);
      }
    }
  }

  // todo: test it
  private async createAssociatedTokenAccount(
    tokenMintAddress: PublicKey,
    userATA: PublicKey
  ) {
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
  }

  public async getTokenBalance({ token }: { token: DepositToken }) {
    try {
      const tokenMint = await this.getTokenMint(
        new PublicKey(this.TOKEN_ADDRESSES[token])
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

  // for test usage
  public async checkTestSenderMintAccount({
    user,
    token
  }: {
    user: Keypair;
    token: DepositToken;
  }) {
    const tokenMint = await this.getTokenMint(
      new PublicKey(this.TOKEN_ADDRESSES[token])
    );

    const userATA = await getAssociatedTokenAddress(
      tokenMint.address,
      this.user,
      false,
      this.TOKEN_PROGRAM
    );

    try {
      await getAccount(
        this.provider.connection,
        userATA,
        undefined,
        this.TOKEN_PROGRAM
      );
    } catch {
      await createAssociatedTokenAccount(
        this.provider.connection,
        user,
        tokenMint.address,
        user.publicKey,
        undefined,
        this.TOKEN_PROGRAM
      );
    }
  }

  // aidrops for devnet
  public async airdropSOLIfRequired() {
    const balance = await this.getSOLBalance();

    if (balance === 0) {
      await this.getAirdropSOL();
    }
  }

  private async getSOLBalance() {
    return this.provider.connection.getBalance(this.user);
  }
}
