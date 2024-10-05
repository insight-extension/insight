import { z } from "zod";

export const CreateSignatureSchema = z.object({
  signature: z.string(),
});
export const CreateAccountSchema = z.object({
  nonce: z.string(),
});
