import { z } from "zod";

import { SPLToken, UsageType } from "@repo/shared/constants";

import { TRANSLATIONS } from "@/i18n";

export const depositFormSchema = z.object({
  amount: z
    .number()
    .min(0.1, {
      message: TRANSLATIONS.depositForm.validation.amount.minimum
    })
    .max(10, {
      message: TRANSLATIONS.depositForm.validation.amount.maximum
    })
    .multipleOf(0.1, {
      message: TRANSLATIONS.depositForm.validation.amount.decimals
    }),
  token: z.nativeEnum(SPLToken, {
    errorMap: () => ({
      message: TRANSLATIONS.depositForm.validation.token.required
    })
  }),
  usageType: z.nativeEnum(UsageType, {
    errorMap: () => ({
      message: TRANSLATIONS.depositForm.validation.usageType.required
    })
  })
});

export type DepositFormFields = z.infer<typeof depositFormSchema>;
