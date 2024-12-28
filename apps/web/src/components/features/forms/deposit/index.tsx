import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { FC, FormEvent, memo, useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useAtomValue } from "jotai";
import { BN } from "@coral-xyz/anchor";
import { match } from "ts-pattern";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useSearchParams } from "react-router";

import {
    Label,
    RadioGroup,
    RadioGroupItem,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components";
import { cn } from "@/lib/cn";
import { AnchorClient } from "@/services";
import { anchorProviderAtom } from "@/store";
import {
    DepositToken,
    SubscriptionType,
    TOKEN_CURRENCIES,
} from "@repo/shared/constants";
import { useToast } from "@/hooks";
import { TRANSLATIONS } from "@/i18n";

import { DepositFormFields, depositFormSchema } from "./validation";

interface DepositFormProps {
    onSuccessSubmit: () => void;
}

export const DepositForm: FC<DepositFormProps> = memo(({ onSuccessSubmit }) => {
    const { toast } = useToast();
    const [searchParams, _] = useSearchParams();

    const [userTokenBalance, setUserTokenBalance] = useState<number>(0);
    const [anchorClient, setAnchorClient] = useState<AnchorClient | null>(null);

    const anchorProvider = useAtomValue(anchorProviderAtom);

    const { publicKey } = useWallet();

    const handleSuccessSubmit = useCallback(() => {
        toast({
            title: TRANSLATIONS.depositForm.toast.successfulTransactionTitle,
            description:
                TRANSLATIONS.depositForm.toast.successfulTransactionDescription,
            variant: "success",
        });

        searchParams.delete("action");

        onSuccessSubmit();
    }, []);

    const {
        Field,
        Subscribe,
        handleSubmit: triggerSubmit,
        getFieldValue,
        state: { isSubmitted },
    } = useForm({
        defaultValues: {
            amount: 0,
            token: DepositToken.USDC,
            subscriptionType: SubscriptionType.PER_MONTH,
        } as DepositFormFields,
        onSubmit: async ({ value: { amount, token, subscriptionType } }) => {
            if (!anchorClient) {
                throw new WalletNotConnectedError();
            }

            try {
                const normalizedAmount = new BN(
                    (amount * 10 ** TOKEN_CURRENCIES[token].decimals) /
                        // todo: remove
                        1000
                );

                await anchorClient.checkUserTokenAccount({
                    token,
                });

                await anchorClient.airdropSOLIfRequired();

                const signature = await match(subscriptionType)
                    .returnType<Promise<string>>()
                    .with(
                        SubscriptionType.FREE_TRIAL,
                        () => Promise.resolve("signature")
                        // todo: complete
                    )
                    .with(SubscriptionType.PER_MONTH, () =>
                        anchorClient.depositToSubscriptionVault({
                            amount: normalizedAmount,
                            token,
                        })
                    )
                    .with(SubscriptionType.PER_USAGE, () =>
                        anchorClient.depositToTimedVault({
                            amount: normalizedAmount,
                            token,
                        })
                    )
                    .exhaustive();

                console.log("signature", signature);

                // todo: complete
                // await relayMessenger.deposit({
                //     amount: Number(normalizedAmount),
                //     subscriptionType,
                //     transactionSignature: signature,
                //     token,
                // });

                handleSuccessSubmit();
            } catch (error: any) {
                toast({
                    title: TRANSLATIONS.depositForm.toast
                        .transactionFailedTitle,
                    description:
                        TRANSLATIONS.depositForm.toast
                            .transactionFailedDescription +
                        `${error.message && ": " + error.message}`,
                    variant: "error",
                });
            }
        },
        validatorAdapter: zodValidator(),
        validators: {
            onChange: depositFormSchema,
        },
    });

    const handleFormSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            event.stopPropagation();

            triggerSubmit();
        },
        [triggerSubmit]
    );

    useEffect(() => {
        if (publicKey && anchorProvider) {
            setAnchorClient(new AnchorClient(publicKey, anchorProvider));
        }
    }, [publicKey, anchorProvider]);

    useEffect(() => {
        (async () => {
            if (anchorClient) {
                setUserTokenBalance(
                    await anchorClient.getTokenBalance({
                        token: getFieldValue("token"),
                    })
                );
            }
        })();
    }, [anchorClient, isSubmitted]);

    return (
        <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-5">
                <Field name="subscriptionType">
                    {({ state, name, handleChange }) => (
                        <RadioGroup
                            name={name}
                            defaultValue={state.value}
                            onValueChange={(value) =>
                                handleChange(value as SubscriptionType)
                            }
                            className="flex gap-8"
                        >
                            {Object.values(SubscriptionType).map((type) => (
                                <div key={type} className="flex gap-2">
                                    <RadioGroupItem
                                        color="green"
                                        key={type}
                                        value={type}
                                        id={type}
                                    />

                                    <Label htmlFor={type}>
                                        {
                                            TRANSLATIONS.depositForm.fields
                                                .subscription[type]
                                        }
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </Field>

                <div className="flex gap-4">
                    <Field
                        name="amount"
                        validators={{
                            onChange: z
                                .number()
                                .min(
                                    1,
                                    TRANSLATIONS.depositForm.validation.amount
                                        .minimum
                                ),
                            onChangeAsyncDebounceMs: 500,
                        }}
                    >
                        {({ name, state, handleChange, handleBlur }) => {
                            const {
                                meta: { errors, isTouched, isValidating },
                            } = state;

                            return (
                                <div className="flex w-4/6 flex-col gap-2">
                                    <div className="flex flex-col gap-2">
                                        <input
                                            id={name}
                                            name={name}
                                            value={state.value}
                                            onBlur={handleBlur}
                                            onChange={({ target }) => {
                                                const sanitizedValue =
                                                    target.value.replace(
                                                        /[^0-9]/g,
                                                        ""
                                                    );
                                                const value =
                                                    Number(sanitizedValue);

                                                handleChange(
                                                    isNaN(value) ? 0 : value
                                                );
                                            }}
                                            type="text"
                                            className={cn(
                                                "relative z-10",
                                                "cursor-pointer",
                                                "h-10",
                                                "px-3 py-2",
                                                "border-input rounded border bg-dark"
                                            )}
                                        />
                                    </div>

                                    <span>
                                        {isTouched && errors.length ? (
                                            <span className="text-xs text-red-500">
                                                {errors.join(",")}
                                            </span>
                                        ) : null}

                                        {isValidating
                                            ? TRANSLATIONS.depositForm.states
                                                  .validating
                                            : null}
                                    </span>
                                </div>
                            );
                        }}
                    </Field>

                    <Field name="token">
                        {({ state, name, handleChange }) => (
                            <Select
                                disabled
                                name={name}
                                defaultValue={state.value}
                                onValueChange={(value) =>
                                    handleChange(value as DepositToken)
                                }
                            >
                                <SelectTrigger className="w-2/6">
                                    <SelectValue
                                        placeholder={
                                            TRANSLATIONS.depositForm.fields
                                                .token.select
                                        }
                                    />
                                </SelectTrigger>

                                <SelectContent className="z-10 w-2/6 rounded bg-dark">
                                    {Object.values(DepositToken).map(
                                        (token) => {
                                            const tokenValue =
                                                TOKEN_CURRENCIES[token].symbol;
                                            const isDisabled =
                                                state.value !== tokenValue;

                                            return (
                                                <SelectItem
                                                    disabled={isDisabled}
                                                    key={token.toString()}
                                                    value={tokenValue}
                                                >
                                                    {tokenValue}
                                                </SelectItem>
                                            );
                                        }
                                    )}
                                </SelectContent>
                            </Select>
                        )}
                    </Field>
                </div>

                <Subscribe
                    selector={({ canSubmit, isSubmitting, isPristine }) => [
                        canSubmit,
                        isSubmitting,
                        isPristine,
                    ]}
                >
                    {([canSubmit, isSubmitting, isPristine]) => (
                        <button
                            className="h-10 cursor-pointer rounded bg-green-300 font-bold text-dark"
                            type="submit"
                            disabled={!canSubmit || isPristine}
                        >
                            {isSubmitting
                                ? TRANSLATIONS.depositForm.states.submitting
                                : TRANSLATIONS.depositForm.states.submit}
                        </button>
                    )}
                </Subscribe>

                <Subscribe selector={({ isSubmitting }) => [isSubmitting]}>
                    {([isSubmitting]) => (
                        <Label className="font- text-medium">
                            {isSubmitting
                                ? "..."
                                : `${TRANSLATIONS.depositForm.info.balance}: ${userTokenBalance} ${TOKEN_CURRENCIES[getFieldValue("token")].symbol}`}
                        </Label>
                    )}
                </Subscribe>
            </div>
        </form>
    );
});
