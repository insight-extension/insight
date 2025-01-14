export enum SPLToken {
  USDC = "usdc"
}
export enum SOLToken {
  SOL = "sol"
}

export const TOKEN_CURRENCIES = {
  [SPLToken.USDC]: {
    symbol: SPLToken.USDC,
    decimals: 6
  },
  [SOLToken.SOL]: {
    symbol: SOLToken.SOL,
    decimals: 9
  }
};

// todo: review usage
export const TOKEN_ADDRESSES: Record<SPLToken, string> = {
  [SPLToken.USDC]: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
};
