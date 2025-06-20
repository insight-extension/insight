import * as t from "io-ts";

export interface SessionTokenPayload {
  publicKey: string;
  iat: number;
  exp: number;
}

export const SessionTokenPayloadCodec = t.type({
  publicKey: t.string,
  iat: t.number,
  exp: t.number
});
