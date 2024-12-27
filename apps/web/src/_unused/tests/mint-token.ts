import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";

require("dotenv").config({ path: require("find-config")(".env") });

const connection = new Connection(clusterApiUrl("devnet"));

// Generate keypairs for the payer (mint authority) and recipient
const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.VITE_PAYER_SECRET_KEY!))
);
const recipient = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(process.env.VITE_RECIPIENT_SECRET_KEY!))
);

// const USDC_DECIMALS = 6;

// const mint = await createMint(
//     connection,
//     payer, // Fee payer
//     payer.publicKey, // Mint authority (can mint tokens)
//     null, // Freeze authority (optional)
//     USDC_DECIMALS // Number of decimal places
// );

// Create associated token account for the payer
const payerTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    new PublicKey(process.env.VITE_MINT!),
    payer.publicKey
);

console.log(
    "Payer Token Account Address:",
    payerTokenAccount.address.toBase58()
);

// Create associated token account for the recipient
const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    new PublicKey(process.env.VITE_MINT!),
    recipient.publicKey
);

console.log(
    "Recipient Token Account Address:",
    recipientTokenAccount.address.toBase58()
);

const mintAmount = 10000000;

await mintTo(
    connection,
    payer,
    new PublicKey(process.env.VITE_MINT!),
    recipientTokenAccount.address, // Destination token account
    payer.publicKey, // Mint authority
    mintAmount // Amount to mint
);

console.log(`Minted ${mintAmount / 1000000} USDC to Payer's Token Account`);
