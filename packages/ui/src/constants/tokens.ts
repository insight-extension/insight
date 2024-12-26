export enum DepositToken {
    USDC = "usdc",
    SOL = "sol",
}

export const TOKEN_CURRENCIES = {
    [DepositToken.USDC]: {
        symbol: DepositToken.USDC,
        decimals: 6,
    },
    [DepositToken.SOL]: {
        symbol: DepositToken.SOL,
        decimals: 9,
    },
};
