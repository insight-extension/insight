import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DepositProgram } from "../target/types/deposit_program";
import { airdropIfRequired } from "@solana-developers/helpers";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import {
  createAssociatedTokenAccount,
  createMint,
  getAccount,
  getAssociatedTokenAddress,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const TOKEN_PROGRAM = TOKEN_2022_PROGRAM_ID;

describe("Deposit Program", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace.DepositProgram as Program<DepositProgram>;

  const withdrawWallet = new PublicKey(
    "71q6LEWUkPZhYChjAcZcuxVVyDqdEyjf95etzte2PzwK"
  );
  const user = Keypair.generate();

  let usdcMint: PublicKey;
  let userUsdcAccount: PublicKey;
  let userInfoAddress: PublicKey;
  let vault: PublicKey;
  const userUsdcBalance = new anchor.BN(100_000_000);
  const userUsdcDeposit = new anchor.BN(6_000_000);

  const getTokenBalance = async (
    tokenAccountAddress: PublicKey
  ): Promise<anchor.BN> => {
    const tokenBalance = await connection.getTokenAccountBalance(
      tokenAccountAddress
    );
    return new anchor.BN(tokenBalance.value.amount);
  };

  beforeAll(async () => {
    console.log(`User public key: ${user.publicKey}`);

    // Airdrop SOL to user for fees and to withdraw wallet
    await Promise.all([
      airdropIfRequired(
        provider.connection,
        user.publicKey,
        5 * LAMPORTS_PER_SOL,
        5 * LAMPORTS_PER_SOL
      ),
      airdropIfRequired(
        provider.connection,
        withdrawWallet,
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

  test("Subscribes by transferring USDC to vault and storing user info", async () => {
    let tx: string | null = null;
    try {
      tx = await program.methods
        .subscribe(userUsdcDeposit)
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

    // Check that transaction was successful
    expect(tx).not.toBeNull();
    const userInfo = await program.account.userInfo.fetch(userInfoAddress);
    expect(userInfo.availableBalance.toNumber()).toEqual(1_000_000);
    expect(await getTokenBalance(vault)).toEqual(new anchor.BN(6_000_000));
  });

  test("Fails on second subscription attempt with AlreadySubscribed error", async () => {
    // Attempt to subscribe again and expect an error
    let txError: Error | null = null;
    try {
      await program.methods
        .subscribe(new anchor.BN(11_000_000))
        .accounts({
          user: user.publicKey,
          token: usdcMint,
          tokenProgram: TOKEN_PROGRAM,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      txError = error;
    }

    expect(txError).not.toBeNull();
    console.log(`Error: ${txError}`);
    expect(txError.message).toContain("Already subscribed.");

    // Verify the vault balance is correct
    //   console.log
    //vault: 6000000
    // ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ? ?
    console.log(`vault: ${await getTokenBalance(vault)}`);
    expect(await getTokenBalance(vault)).toEqual(new anchor.BN(11_000_000));
  });
});
