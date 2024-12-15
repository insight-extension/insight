import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import {
    createAssociatedTokenAccount,
    getAccount,
    getAssociatedTokenAddress,
    getMint,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import IDL, { type DepositProgram } from "@/onchain/idl";
import { DepositToken, TOKEN_CURRENCIES } from "@/constants";
import { TokenAccountNotFoundError } from "@/errors";

export class AnchorClient {
    private TOKEN_ADDRESSES: Record<DepositToken, string> = {
        [DepositToken.USDC]: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
        [DepositToken.SOL]: "",
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

    private async getAirdropSOL(): Promise<void> {
        try {
            const [latestBlockhash, signature] = await Promise.all([
                this.provider.connection.getLatestBlockhash(),
                this.provider.connection.requestAirdrop(
                    this.user,
                    1 * LAMPORTS_PER_SOL
                ),
            ]);
            const signatureResult =
                await this.provider.connection.confirmTransaction(
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

    private getSOLBalance = async () =>
        this.provider.connection.getBalance(this.user);

    public async checkUserTokenAccount({ token }: { token: DepositToken }) {
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
            throw new TokenAccountNotFoundError();
        }
    }

    public async airdropSOLIfRequired() {
        const balance = await this.getSOLBalance();

        if (balance === 0) {
            await this.getAirdropSOL();
        }
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

    // todo: for test usage
    public async checkTestSenderMintAccount({
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
}
