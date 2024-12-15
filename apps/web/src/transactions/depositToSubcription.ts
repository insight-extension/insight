import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

import IDL, { type DepositProgram } from "@/onchain/idl";

const USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

const TOKEN_PROGRAM = TOKEN_PROGRAM_ID;

// remove
export const depositToSubscriptionVault = async ({
    provider,
    sender,
}: {
    provider: AnchorProvider;
    sender: PublicKey;
}) => {
    const program = new Program(IDL as DepositProgram, provider);

    const transactionSignature = await program.methods
        .depositToSubscriptionVault(new BN(3_000_000))
        .accounts({
            user: sender,
            token: USDC_MINT,
            tokenProgram: TOKEN_PROGRAM,
        })
        .rpc();

    return transactionSignature;
    // const instruction = await program.methods
    //     .depositToSubscriptionVault(new BN(3_000_000))
    //     .accounts({
    //         user: sender,
    //         token: USDC_MINT,
    //         tokenProgram: TOKEN_PROGRAM,
    //     })
    //     .instruction();

    // const transaction = new Transaction().add(instruction);

    // return transaction;
};
