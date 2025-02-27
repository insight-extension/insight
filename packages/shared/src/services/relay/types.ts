export enum RelayRoute {
  DEPOSIT = "deposit"
}

export enum RelayStatus {
  SUCCESS = "success",
  PARSE_ERROR = "parseError",
  ERROR = "error"
}

export interface RelayResponse {
  status: RelayStatus;
}

export interface DepositMessage {
  amount: number;
  token: string;
  transactionSignature: string;
}
