import { Keypair } from "@solana/web3.js";

const { publicKey, secretKey } = Keypair.generate();

console.log(`publicKey: `, publicKey.toBase58());
console.log(`secretKey: `, secretKey);
