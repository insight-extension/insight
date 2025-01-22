import { z } from "zod";

import { SubscriptionType } from "@repo/shared/constants";
import { SPLToken } from "@repo/shared/constants";

import { TRANSLATIONS } from "@/i18n";

export const depositFormSchema = z.object({
  amount: z
    .number()
    .min(1, { message: TRANSLATIONS.depositForm.validation.amount.minimum })
    .max(10, {
      message: TRANSLATIONS.depositForm.validation.amount.maximum
    }),
  token: z.nativeEnum(SPLToken, {
    errorMap: () => ({
      message: TRANSLATIONS.depositForm.validation.token.required
    })
  }),
  subscriptionType: z.nativeEnum(SubscriptionType, {
    errorMap: () => ({
      message: TRANSLATIONS.depositForm.validation.subscriptionType.required
    })
  })
});

export type DepositFormFields = z.infer<typeof depositFormSchema>;
