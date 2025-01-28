export const APP_SEARCH_PARAMS = {
  action: {
    deposit: "deposit",
    "connect-wallet": "connect-wallet",
    default: "default"
  }
};

export type AppSearchParams = typeof APP_SEARCH_PARAMS;
export type AppSearchParamsKeys = keyof typeof APP_SEARCH_PARAMS;
