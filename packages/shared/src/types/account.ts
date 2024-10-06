import { z } from "zod";

import {
  CreateAccountSchema,
  CreateSignatureSchema,
} from "@repo/shared/validation";

export interface CreateAccountRequest {
  publicKey: string;
}

export interface CreateAccountResponse
  extends z.infer<typeof CreateAccountSchema> {}

export interface CreateSignatureResponse
  extends z.infer<typeof CreateSignatureSchema> {}

export interface ValidateAccountRequest {
  publicKey: string;
  signature: string;
}
