import { FC, FormEvent, memo, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useAtomValue } from "jotai";
import { z } from "zod";

import {
  DepositToken,
  SubscriptionType,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { AnchorClient } from "@repo/shared/services";

import {
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components";
import { useToast } from "@/hooks";
import { TRANSLATIONS } from "@/i18n";
import { cn } from "@/lib/cn";
import { relayMessenger } from "@/services";
import { anchorProviderAtom } from "@/store";

import { DepositFormFields, depositFormSchema } from "./validation";

interface DepositFormProps {
  onSuccessSubmit: () => void;
}

export const DepositForm: FC<DepositFormProps> = memo(({ onSuccessSubmit }) => {
  const { toast } = useToast();
  const [searchParams, _] = useSearchParams();

  const [isAirdroppedSOL, setIsAirdroppedSOL] = useState<boolean>(false);
  const [isSOLBalanceChanged, setIsSOLBalanceChanged] =
    useState<boolean>(false);

  // todo: aidrop flow

  const [userTokenBalance, setUserTokenBalance] = useState<number>(0);
  const [anchorClient, setAnchorClient] = useState<AnchorClient | null>(null);

  const anchorProvider = useAtomValue(anchorProviderAtom);

  const { publicKey } = useWallet();

  const handleSuccessSubmit = useCallback(() => {
    toast({
      title: TRANSLATIONS.depositForm.toast.successfulTransactionTitle,
      description:
        TRANSLATIONS.depositForm.toast.successfulTransactionDescription,
      variant: "success"
    });

    searchParams.delete("action");

    onSuccessSubmit();
  }, []);

  const {
    Field,
    Subscribe,
    handleSubmit: triggerSubmit,
    getFieldValue,
    state: { isSubmitted }
  } = useForm({
    defaultValues: {
      amount: 0,
      token: DepositToken.USDC,
      subscriptionType: SubscriptionType.PER_MONTH
    } as DepositFormFields,
    onSubmit: async ({ value: { amount, token, subscriptionType } }) => {
      if (!anchorClient) {
        throw new WalletNotConnectedError();
      }

      // todo: use pipe
      try {
        await anchorClient.checkUserTokenAccount({
          token
        });

        await anchorClient.airdropSOLIfRequired();

        const transactionSignature = await anchorClient.depositToVault({
          amount:
            amount /
            // todo:remove
            1000,
          token,
          subscriptionType
        });

        relayMessenger.deposit({
          amount,
          subscriptionType,
          transactionSignature,
          token
        });

        handleSuccessSubmit();
      } catch (error: any) {
        // todo: catch exeption
        toast({
          title: TRANSLATIONS.depositForm.toast.transactionFailedTitle,
          description:
            TRANSLATIONS.depositForm.toast.transactionFailedDescription,
          variant: "error"
        });
      }
    },
    validatorAdapter: zodValidator(),
    validators: {
      onChange: depositFormSchema
    }
  });

  const handleAirdropSOL = useCallback(() => {
    toast({
      title: "Airdrop",
      description: "SOL airdropped successfully",
      variant: "success"
    });
  }, []);

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
      const _anchorClient = new AnchorClient(publicKey, anchorProvider);

      setAnchorClient(_anchorClient);

      _anchorClient.on("airdropSOL", () => {
        setIsAirdroppedSOL(true);
      });

      _anchorClient.on("SOLbalanceChange", () => {
        setIsSOLBalanceChanged(true);
      });
    }
  }, [publicKey, anchorProvider]);

  useEffect(() => {
    (async () => {
      if (anchorClient) {
        setUserTokenBalance(
          await anchorClient.getTokenBalance({
            token: getFieldValue("token")
          })
        );
      }
    })();
  }, [anchorClient, isSubmitted]);

  useEffect(() => {
    if (isAirdroppedSOL) {
      handleAirdropSOL();

      setIsAirdroppedSOL(false);
    }
  }, [isAirdroppedSOL]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-col gap-5">
        <Field name="subscriptionType">
          {({ state, name, handleChange }) => (
            <RadioGroup
              name={name}
              defaultValue={state.value}
              onValueChange={(value) => handleChange(value as SubscriptionType)}
              className="flex gap-8">
              {Object.values(SubscriptionType).map((type) => (
                <div key={type} className="flex gap-2">
                  <RadioGroupItem
                    color="green"
                    key={type}
                    value={type}
                    id={type}
                  />

                  <Label htmlFor={type}>
                    {TRANSLATIONS.depositForm.fields.subscription[type]}
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
                .min(1, TRANSLATIONS.depositForm.validation.amount.minimum),
              onChangeAsyncDebounceMs: 500
            }}>
            {({ name, state, handleChange, handleBlur }) => {
              const {
                meta: { errors, isTouched, isValidating }
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
                        const sanitizedValue = target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        const value = Number(sanitizedValue);

                        handleChange(isNaN(value) ? 0 : value);
                      }}
                      type="text"
                      className={cn(
                        "relative z-10",
                        "cursor-pointer",
                        "h-10",
                        "px-3 py-2",
                        "border-input bg-dark rounded border"
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
                      ? TRANSLATIONS.depositForm.states.validating
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
                onValueChange={(value) => handleChange(value as DepositToken)}>
                <SelectTrigger className="w-2/6">
                  <SelectValue
                    placeholder={TRANSLATIONS.depositForm.fields.token.select}
                  />
                </SelectTrigger>

                <SelectContent className="bg-dark z-10 w-2/6 rounded">
                  {Object.values(DepositToken).map((token) => {
                    const tokenValue = TOKEN_CURRENCIES[token].symbol;
                    const isDisabled = state.value !== tokenValue;

                    return (
                      <SelectItem
                        disabled={isDisabled}
                        key={token.toString()}
                        value={tokenValue}>
                        {tokenValue}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </Field>
        </div>

        <Subscribe
          selector={({ canSubmit, isSubmitting, isPristine }) => [
            canSubmit,
            isSubmitting,
            isPristine
          ]}>
          {([canSubmit, isSubmitting, isPristine]) => (
            <button
              className="text-dark h-10 cursor-pointer rounded bg-green-300 font-bold"
              type="submit"
              disabled={!canSubmit || isPristine}>
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
