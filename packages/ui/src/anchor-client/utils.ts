export const displayShortPublicKey = (base58: string) => {
  return base58.length === 44
    ? `0x${base58.slice(0, 4)}..${base58.slice(-4)}`
    : "";
};
