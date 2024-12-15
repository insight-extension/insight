import { SignerWalletAdapterProps } from "@solana/wallet-adapter-base";
import {
    createTransferInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    getAccount,
    Account,
} from "@solana/spl-token";
import {
    PublicKey,
    Transaction,
    Connection,
    TransactionInstruction,
} from "@solana/web3.js";

export const prepareAccountsForTransaction = async ({
    connection,
    senderAddress,
    mintTokenAddress,
    recipientAddress,
}: {
    connection: Connection;
    senderAddress: PublicKey;
    mintTokenAddress: PublicKey;
    recipientAddress: PublicKey;
}): Promise<{
    associatedTokenTo: PublicKey;
    fromAccount: Account;
}> => {
    try {
        const associatedTokenTo = await getAssociatedTokenAddress(
            mintTokenAddress,
            recipientAddress
        );

        const associatedTokenFrom = await getAssociatedTokenAddress(
            mintTokenAddress,
            senderAddress
        );

        const fromAccount = await getAccount(connection, associatedTokenFrom);

        return { associatedTokenTo, fromAccount };
    } catch (error) {
        throw error;
    }
};

export const createDepositTransaction = async ({
    senderAddress,
    associatedTokenTo,
    recipientAddress,
    mintTokenAddress,
    fromAccount,
    connection,
    amount = 1000000, // 1 usdc
}: {
    senderAddress: PublicKey;
    associatedTokenTo: PublicKey;
    recipientAddress: PublicKey;
    mintTokenAddress: PublicKey;
    fromAccount: Account;
    amount?: number;
    connection: Connection;
}): Promise<Transaction> => {
    const transactionInstructions: TransactionInstruction[] = [];

    if (!(await connection.getAccountInfo(associatedTokenTo))) {
        transactionInstructions.push(
            createAssociatedTokenAccountInstruction(
                senderAddress,
                associatedTokenTo,
                recipientAddress,
                mintTokenAddress
            )
        );
    }

    transactionInstructions.push(
        createTransferInstruction(
            fromAccount.address,
            associatedTokenTo,
            senderAddress,
            amount
        )
    );

    const transaction = new Transaction().add(...transactionInstructions);

    return transaction;
};

export const configureAndSendTransaction = async ({
    signTransaction,
    transaction,
    feePayer,
    connection,
}: {
    transaction: Transaction;
    connection: Connection;
    feePayer: PublicKey;
    signTransaction: SignerWalletAdapterProps["signTransaction"];
}): Promise<string> => {
    try {
        const blockHash = await connection.getLatestBlockhash();

        transaction.feePayer = feePayer;
        transaction.recentBlockhash = blockHash.blockhash;

        const signed = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(
            signed.serialize()
        );

        await connection.confirmTransaction({
            blockhash: blockHash.blockhash,
            lastValidBlockHeight: blockHash.lastValidBlockHeight,
            signature,
        });

        return signature;
    } catch (error) {
        throw error;
    }
};
