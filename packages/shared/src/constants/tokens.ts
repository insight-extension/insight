export enum DepositToken {
  USDC = "usdc"
}

export const TOKEN_CURRENCIES = {
  [DepositToken.USDC]: {
    symbol: DepositToken.USDC,
    decimals: 6
  }
};

// todo: review usage
export const TOKEN_ADDRESSES: Record<DepositToken, string> = {
  [DepositToken.USDC]: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
};
