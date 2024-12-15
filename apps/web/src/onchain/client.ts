import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
    createAssociatedTokenAccount,
    getAccount,
    getAssociatedTokenAddress,
    getMint,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, PublicKey } from "@solana/web3.js";

import IDL, { type DepositProgram } from "@/onchain/idl";
import { DepositToken } from "@/constants";

export class AnchorClient {
    private TOKEN_ADDRESSES: Record<DepositToken, string> = {
        [DepositToken.USDC]: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        [DepositToken.SOL]: "sol-address",
    };
    private TOKEN_PROGRAM = TOKEN_PROGRAM_ID;

    constructor(
        private user: PublicKey,
        private provider: AnchorProvider
    ) {
        this.user = user;
        this.provider = provider;
    }

    public async depositToSubscriptionVault({
        token,
        amount,
    }: {
        amount: BN;
        token: DepositToken;
    }): Promise<string> {
        const program = new Program(IDL as DepositProgram, this.provider);

        const transactionSignature = await program.methods
            .depositToSubscriptionVault(new BN(amount))
            .accounts({
                user: this.user,
                token: this.TOKEN_ADDRESSES[token],
                tokenProgram: this.TOKEN_PROGRAM,
            })
            .rpc();

        return transactionSignature;
    }

    public async depositToTimedVault({
        token,
        amount,
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
                tokenProgram: this.TOKEN_PROGRAM,
            })
            .rpc();

        return transactionSignature;
    }

    private async getTokenMint(token: PublicKey) {
        const tokenMint = await getMint(this.provider.connection, token);

        return tokenMint;
    }

    // todo: for test usage
    public async checkSenderAccount({
        user,
        token,
    }: {
        user: Keypair;
        token: DepositToken;
    }) {
        const tokenMint = await this.getTokenMint(
            new PublicKey(this.TOKEN_ADDRESSES[token])
        );

        const userATA = await getAssociatedTokenAddress(
            tokenMint.address,
            user.publicKey,
            false,
            this.TOKEN_PROGRAM
        );

        // TODO: user must have USDC account
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
}
