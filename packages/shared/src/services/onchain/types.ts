export type EventCallbackMap = {
  airdropSOL: () => void;
  SOLbalanceChange: (balance: number) => void;
};
