import { z } from "zod";

import { TRANSLATIONS } from "@/i18n";
import { SubscriptionType } from "@/constants";
import { DepositToken } from "@/constants";

export const depositFormSchema = z.object({
    amount: z
        .number()
        .min(1, { message: TRANSLATIONS.depositForm.validation.amount.minimum })
        .max(100000, {
            message: TRANSLATIONS.depositForm.validation.amount.maximum,
        }),
    token: z.nativeEnum(DepositToken, {
        errorMap: () => ({
            message: TRANSLATIONS.depositForm.validation.token.required,
        }),
    }),
    subscriptionType: z.nativeEnum(SubscriptionType, {
        errorMap: () => ({
            message:
                TRANSLATIONS.depositForm.validation.subscriptionType.required,
        }),
    }),
});

export type DepositFormFields = z.infer<typeof depositFormSchema>;
