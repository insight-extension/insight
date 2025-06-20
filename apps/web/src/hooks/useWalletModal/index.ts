import { createContext, useContext } from "react";

// todo: refactor
export interface WalletModalContextState {
  visible: boolean;
  setVisible: (open: boolean) => void;
}

const DEFAULT_CONTEXT = {
  setVisible(_open: boolean) {
    console.error(constructMissingProviderErrorMessage("call", "setVisible"));
  },
  visible: false
};

Object.defineProperty(DEFAULT_CONTEXT, "visible", {
  get() {
    console.error(constructMissingProviderErrorMessage("read", "visible"));
    return false;
  }
});

const constructMissingProviderErrorMessage = (
  action: string,
  valueName: string
) => {
  return (
    "You have tried to " +
    ` ${action} "${valueName}"` +
    " on a WalletModalContext without providing one." +
    " Make sure to render a WalletModalProvider" +
    " as an ancestor of the component that uses " +
    "WalletModalContext"
  );
};

export const WalletModalContext = createContext<WalletModalContextState>(
  DEFAULT_CONTEXT as WalletModalContextState
);

export const useWalletModal = (): WalletModalContextState =>
  useContext(WalletModalContext);
