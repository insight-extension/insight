import { z, ZodType } from "zod";

import { AuthNonce, AuthTokens } from "./types";

export const AuthTokensSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
}) satisfies ZodType<AuthTokens>;

export const ClaimNonceSchema = z.object({
    nonce: z.string(),
    publicKey: z.string(),
}) satisfies ZodType<AuthNonce>;
