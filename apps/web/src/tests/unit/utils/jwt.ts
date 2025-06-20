import { sign as jwtSign } from "jsonwebtoken";

export const createJWTTokenWithPayloadAndExpiration = (
  payload: any,
  secret: string,
  expiresInSeconds: number
) => jwtSign(payload, secret, { expiresIn: expiresInSeconds });
