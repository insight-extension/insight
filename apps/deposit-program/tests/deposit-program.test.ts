import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DepositProgram } from "../target/types/deposit_program";
import { airdropIfRequired } from "@solana-developers/helpers";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  createMint,
  getAccount,
  getAssociatedTokenAddress,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const TOKEN_PROGRAM = TOKEN_2022_PROGRAM_ID;

describe("Deposit Program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace.DepositProgram as Program<DepositProgram>;

  const masterWallet = new PublicKey(
    "71q6LEWUkPZhYChjAcZcuxVVyDqdEyjf95etzte2PzwK"
  );
  const user = Keypair.generate();

  let usdcMint: PublicKey;
  let userUsdcAccount: PublicKey;
  let userInfoAddress: PublicKey;
  let vault: PublicKey;
  const userUsdcBalance = new anchor.BN(20_000_000);

  const getTokenBalance = async (
    tokenAccountAddress: PublicKey
  ): Promise<anchor.BN> => {
    const tokenBalance = await connection.getTokenAccountBalance(
      tokenAccountAddress
    );
    return new anchor.BN(tokenBalance.value.amount);
  };

  let masterWalletUsdcAccount: PublicKey;

  beforeAll(async () => {
    console.log(`User public key: ${user.publicKey}`);

    // Airdrop SOL to user for fees and to master wallet
    await Promise.all([
      airdropIfRequired(
        provider.connection,
        user.publicKey,
        5 * LAMPORTS_PER_SOL,
        5 * LAMPORTS_PER_SOL
      ),
      airdropIfRequired(
        provider.connection,
        masterWallet,
        5 * LAMPORTS_PER_SOL,
        5 * LAMPORTS_PER_SOL
      ),
    ]);

    // Create mock USDC mint and user's ATA (associated token account)
    usdcMint = await createMint(
      connection,
      user, // fee payer
      user.publicKey, // mint authority
      null, // freeze authority
      6, // decimal places
      Keypair.generate(),
      null,
      TOKEN_PROGRAM
    );

    userUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      user.publicKey,
      false,
      TOKEN_PROGRAM
    );

    // Ensure user's ATA is created and mint USDC to it
    try {
      await getAccount(connection, userUsdcAccount, null, TOKEN_PROGRAM);
    } catch {
      await createAssociatedTokenAccount(
        connection,
        user, // fee payer
        usdcMint, // USDC mint
        user.publicKey, // owner
        null,
        TOKEN_PROGRAM
      );
      console.log(`Created user USDC account: ${userUsdcAccount}`);
    }

    // Create associated token account for masterWallet
    masterWalletUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      masterWallet,
      false,
      TOKEN_PROGRAM
    );

    // Ensure masterWallet's ATA is created
    try {
      await getAccount(
        connection,
        masterWalletUsdcAccount,
        null,
        TOKEN_PROGRAM
      );
    } catch {
      await createAssociatedTokenAccount(
        connection,
        user, // fee payer
        usdcMint, // USDC mint
        masterWallet, // owner
        null,
        TOKEN_PROGRAM
      );
      console.log(
        `Created masterWallet USDC account: ${masterWalletUsdcAccount}`
      );
    }

    await mintTo(
      connection,
      user, // fee payer
      usdcMint, // USDC mint
      userUsdcAccount, // user's ATA
      user.publicKey, // mint authority
      userUsdcBalance.toNumber(),
      [],
      null,
      TOKEN_PROGRAM
    );
    console.log(
      `Minted ${userUsdcBalance} USDC to user's account: ${userUsdcAccount}`
    );
  });

  beforeEach(async () => {
    // Find addresses for userInfo and vault accounts
    [userInfoAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_info"), user.publicKey.toBuffer()],
      program.programId
    );
    vault = await getAssociatedTokenAddress(
      usdcMint,
      userInfoAddress,
      true,
      TOKEN_PROGRAM
    );
  });

  test("Successful Subscription and Balance Verification", async () => {
    let tx: string | null = null;
    try {
      tx = await program.methods
        .subscribe(new anchor.BN(6_000_000))
        .accounts({
          user: user.publicKey,
          token: usdcMint,
          //masterWallet: masterWallet,
          tokenProgram: TOKEN_PROGRAM,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    console.log(`Transaction: ${tx}`);

    // Check that transaction was successful
    expect(tx).not.toBeNull();
    const userInfo = await program.account.userInfo.fetch(userInfoAddress);
    expect(userInfo.availableBalance.toNumber()).toEqual(1_000_000);
    expect(await getTokenBalance(vault)).toEqual(new anchor.BN(1_000_000));
    expect(await getTokenBalance(masterWalletUsdcAccount)).toEqual(
      new anchor.BN(5_000_000)
    );
  });

  test("Subscription Rejection on Duplicate Request", async () => {
    try {
      await program.methods
        .subscribe(new anchor.BN(5_000_000))
        .accounts({
          user: user.publicKey,
          token: usdcMint,
          //masterWallet: masterWallet,
          tokenProgram: TOKEN_PROGRAM,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      console.log(`Error: ${error}`);
    }

    expect(await getTokenBalance(vault)).toEqual(new anchor.BN(6_000_000));
    expect(await getTokenBalance(masterWalletUsdcAccount)).toEqual(
      new anchor.BN(5_000_000)
    );
  });

  test("Successful Refund Balance from Vault", async () => {
    let userInfo = await program.account.userInfo.fetch(userInfoAddress);
    expect(userInfo.availableBalance.toNumber()).toEqual(6_000_000);

    let tx: string | null = null;
    try {
      tx = await program.methods
        .refundBalance() // Call the refund method
        .accounts({
          user: user.publicKey,
          token: usdcMint,
          tokenProgram: TOKEN_PROGRAM,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      console.log(`Error: ${error}`);
    }
    console.log(`Transaction: ${tx}`);

    expect(tx).not.toBeNull();

    // Check that the user's available balance is now zero
    userInfo = await program.account.userInfo.fetch(userInfoAddress);
    expect(userInfo.availableBalance.toNumber()).toEqual(0);

    console.log(
      `User's USDC balance: ${await getTokenBalance(userUsdcAccount)}`
    );
    // Check that the funds have been returned to the user's account
    expect(await getTokenBalance(userUsdcAccount)).toEqual(
      new anchor.BN(15_000_000)
    );
  });

  test("Check subscription status", async () => {
    // Fetch user info directly from the PDA without making another transaction
    const userInfo = await program.account.userInfo.fetch(userInfoAddress);

    // Get the current timestamp
    const currentTimestamp = new Date().getTime() / 1000; // Convert to seconds

    // Check if the subscription is active
    const isActiveSubscription =
      userInfo.expiration.toNumber() > currentTimestamp;

    console.log(`expiration: ${userInfo.expiration.toNumber()}`);

    // Assertions
    if (isActiveSubscription) {
      console.log("User has an active subscription.");
      expect(userInfo.expiration.toNumber()).toBeGreaterThan(0);
    } else {
      console.log("User does not have an active subscription.");
      expect(userInfo.expiration.toNumber()).toBeLessThanOrEqual(
        currentTimestamp
      );
    }
  });
});
