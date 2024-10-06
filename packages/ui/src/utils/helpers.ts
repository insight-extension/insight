import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

export const getAirdropSOL = async ({
  connection,
  publicKey,
}: {
  connection: Connection;
  publicKey: PublicKey | null;
}): Promise<void> => {
  try {
    if (!publicKey) {
      throw new Error("Wallet is not Connected");
    }

    const [latestBlockhash, signature] = await Promise.all([
      connection.getLatestBlockhash(),
      connection.requestAirdrop(publicKey, 1 * LAMPORTS_PER_SOL),
    ]);
    const signatureResult = await connection.confirmTransaction(
      { signature, ...latestBlockhash },
      "confirmed"
    );

    if (signatureResult) {
      alert("Airdrop was confirmed!");
    }
  } catch (error: any) {
    console.error("You are Rate limited for Airdrop", error.message);
  }
};
