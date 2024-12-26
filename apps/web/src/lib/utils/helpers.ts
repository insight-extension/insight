import { PublicKey } from "@solana/web3.js";

export const convertToBaseUnits = ({
    decimals,
    value,
}: {
    decimals: number;
    value: number;
}) => {
    const factor = 10 ** decimals;

    return value * factor;
};

export const formatPublicKey = (publicKey: PublicKey) =>
    publicKey.toBase58().slice(0, 4) + ".." + publicKey.toBase58().slice(-4);
