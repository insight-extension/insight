export * from "./account";
export * from "./general";

export interface TokenPayload {
  publicKey: string;
  iat: number;
  exp: number;
}
