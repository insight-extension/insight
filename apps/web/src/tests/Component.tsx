import { getMint } from "@solana/spl-token";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";

const connection = new Connection(clusterApiUrl("devnet"));

const payer = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(import.meta.env.VITE_PAYER_SECRET_KEY))
);

const recipient = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(import.meta.env.VITE_RECIPIENT_SECRET_KEY))
);

export const TestComponent = () => {
    const [amount, _] = useState<number>(100000);

    useEffect(() => {
        (async () => {
            // const payerAmount = await getAccount(
            //     connection,
            //     new PublicKey(import.meta.env.VITE_PAYER_MINT_ACCOUNT)
            // );

            // const mintInfo = await connection.getAccountInfo(
            //     new PublicKey(import.meta.env.VITE_PAYER_MINT_ACCOUNT)
            // );
            // console.log("MINTINFO", mintInfo);

            // setAmount(Number(payerAmount.amount));

            const mintAddress = new PublicKey(
                "AbF23FYQbYWVCH5jfDCL1o6AcNV9NDzXiSiHFLw7paW7"
            );

            try {
                const mint = await getMint(connection, mintAddress);
                console.log("Mint Details:", mint);
            } catch (error) {
                console.error("Invalid Mint:", error);
            }
        })();
    }, []);

    return (
        <div role="alert" className="alert alert-info mx-auto max-w-screen-sm">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0 stroke-current"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>

            <div>
                <span>{payer.publicKey.toBase58()}</span>
                <hr />
                <span>{recipient.publicKey.toBase58()}</span>

                <hr />
                <span>{amount / 1000000}</span>
            </div>
        </div>
    );
};
