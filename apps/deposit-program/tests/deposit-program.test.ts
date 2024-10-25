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
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const TOKEN_PROGRAM: typeof TOKEN_2022_PROGRAM_ID | typeof TOKEN_PROGRAM_ID =
  TOKEN_2022_PROGRAM_ID;

describe("Deposit Program", () => {
  // Set the provider for Anchor
  anchor.setProvider(anchor.AnchorProvider.env());
  const provider = anchor.getProvider();
  const connection = provider.connection;
  const program = anchor.workspace.DepositProgram as Program<DepositProgram>;
  const user = Keypair.generate();

  let usdcMint: PublicKey;
  let userUsdcAccount: PublicKey;
  const userUsdcDeposit = new anchor.BN(9_000_000); // 9 USDC in smallest units

  beforeAll(async () => {
    console.log(`User public key: ${user.publicKey}`);

    // Airdrop SOL to user for fees
    await airdropIfRequired(
      provider.connection,
      user.publicKey,
      5 * LAMPORTS_PER_SOL,
      5 * LAMPORTS_PER_SOL
    );

    // Create mock USDC mint
    usdcMint = await createMint(
      connection,
      user, // payer for transaction fees
      user.publicKey, // mint authority
      null, // freeze authority (optional)
      6, // decimal places for USDC
      Keypair.generate(),
      null,
      TOKEN_PROGRAM
    );

    // Get or create the ATA for the user's USDC account
    userUsdcAccount = await getAssociatedTokenAddress(
      usdcMint,
      user.publicKey,
      false,
      TOKEN_PROGRAM
    );
    try {
      // Check if account exists by fetching it
      await getAccount(connection, userUsdcAccount, null, TOKEN_PROGRAM);
    } catch (error) {
      // If the account doesn't exist, create it
      await createAssociatedTokenAccount(
        connection,
        user, // fee payer
        usdcMint, // USDC mint
        user.publicKey, // user's public key
        null,
        TOKEN_PROGRAM
      );
      console.log(`Created user USDC account: ${userUsdcAccount}`);
    }

    // Mint 9 USDC to user's ATA
    await mintTo(
      connection,
      user, // fee payer
      usdcMint, // USDC mint
      userUsdcAccount, // user's ATA
      user.publicKey, // mint authority
      userUsdcDeposit.toNumber(), // 9 USDC in smallest units
      [],
      null,
      TOKEN_PROGRAM
    );

    console.log(`Minted 9 USDC to user's account: ${userUsdcAccount}`);
  });

  test("Subscribes by transferring USDC to vault and storing user info", async () => {
    const [userInfoAddress, userInfoBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("user_info"), user.publicKey.toBuffer()],
      program.programId
    );

    const vault = await getAssociatedTokenAddress(
      usdcMint,
      userInfoAddress,
      true,
      TOKEN_PROGRAM
    );

    let tx: string | null = null;
    try {
      // Attempt to subscribe by transferring USDC to vault
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

    // Confirm that the transaction was successful
    expect(tx).not.toBeNull();

    // Additional checks can be added here, such as checking balances, state, etc.
    const userUsdcAccountInfo = await getAccount(
      connection,
      userUsdcAccount,
      null,
      TOKEN_PROGRAM
    );
    console.log(`User USDC Account Info: `, userUsdcAccountInfo);

    const userInfo = await program.account.userInfo.fetch(userInfoAddress);
    console.log(`User Info: `, userInfo);

    const vaultInfo = await getAccount(connection, vault, null, TOKEN_PROGRAM);
    console.log(`Vault Info: `, vaultInfo);
  });
});
