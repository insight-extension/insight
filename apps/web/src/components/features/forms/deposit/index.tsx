import {
  FC,
  FormEvent,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import * as Sentry from "@sentry/react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useAtomValue } from "jotai";
import { z } from "zod";

import {
  APP_SEARCH_PARAMS,
  SPLToken,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { AnchorClient, relayMessenger } from "@repo/shared/services";
import { roundToDecimals } from "@repo/shared/utils";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components";
import { useToast } from "@/hooks";
import { TRANSLATIONS } from "@/i18n";
import { cn } from "@/lib/cn";
import { anchorProviderAtom } from "@/store";

import { DepositFormFields, depositFormSchema } from "./validation";

interface DepositFormProps {
  onSuccessSubmit: () => void;
}

export const DepositForm: FC<DepositFormProps> = memo(({ onSuccessSubmit }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isAirdroppedSOL, setIsAirdroppedSOL] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const anchorClientRef = useRef<AnchorClient | null>(null);

  const anchorProvider = useAtomValue(anchorProviderAtom);

  const { publicKey } = useWallet();

  const handleSuccessSubmit = useCallback((signature: string) => {
    // todo: use pipe here
    toast({
      title: TRANSLATIONS.depositForm.toast.successfulTransactionTitle,
      description: signature,
      variant: "success"
    });

    navigate({
      to: "/",
      search: { action: APP_SEARCH_PARAMS.action.default }
    });

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
      token: SPLToken.USDC
      // subscriptionType: SubscriptionType.PER_USAGE
    } as DepositFormFields,
    onSubmit: async ({ value: { amount, token } }) => {
      const anchorClient = anchorClientRef.current;

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
          amount,
          token
        });

        await relayMessenger.deposit({
          amount,
          transactionSignature,
          token
        });

        handleSuccessSubmit(transactionSignature);
      } catch (error: any) {
        Sentry.captureException(error);

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

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      triggerSubmit();
    },
    [triggerSubmit]
  );

  const updateBalance = useCallback(async () => {
    const anchorClient = anchorClientRef.current;

    if (!anchorClient) return;

    setBalance(await anchorClient.getUserBalance(getFieldValue("token")));
  }, []);

  useEffect(() => {
    if (publicKey && anchorProvider) {
      anchorClientRef.current = new AnchorClient(anchorProvider);

      anchorClientRef.current.on("airdropSOL", () => {
        setIsAirdroppedSOL(true);
      });

      (async () => {
        await updateBalance();
      })();

      return () => {
        anchorClientRef.current?.clear();
      };
    }
  }, [publicKey]);

  useEffect(() => {
    if (!isSubmitted) return;

    (async () => {
      await updateBalance();
    })();
  }, [isSubmitted]);

  useEffect(() => {
    if (isAirdroppedSOL) {
      toast({
        title: TRANSLATIONS.depositForm.toast.successfulAirDropTitle,
        description:
          TRANSLATIONS.depositForm.toast.successfulAirDropDescription,
        variant: "success"
      });

      setIsAirdroppedSOL(false);
    }
  }, [isAirdroppedSOL]);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex flex-col gap-5">
        {/* not used for now */}
        {/* <Field name="subscriptionType">
          {({ state, name, handleChange }) => (
            <RadioGroup
              name={name}
              defaultValue={state.value}
              onValueChange={(value) => handleChange(value as SubscriptionType)}
              className="flex gap-8"
              disabled
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
                    {TRANSLATIONS.depositForm.fields.subscription[type]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </Field> */}

        <div className="flex gap-4">
          <Field
            name="amount"
            validators={{
              onChange: z
                .number()
                .min(1, TRANSLATIONS.depositForm.validation.amount.minimum),
              onChangeAsyncDebounceMs: 500
            }}
          >
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
                onValueChange={(value) => handleChange(value as SPLToken)}
              >
                <SelectTrigger className="w-2/6">
                  <SelectValue
                    placeholder={TRANSLATIONS.depositForm.fields.token.select}
                  />
                </SelectTrigger>

                <SelectContent className="bg-dark z-10 w-2/6 rounded">
                  {Object.values(SPLToken).map((token) => {
                    const tokenValue = TOKEN_CURRENCIES[token].symbol;
                    const isDisabled = state.value !== tokenValue;

                    return (
                      <SelectItem
                        disabled={isDisabled}
                        key={token.toString()}
                        value={tokenValue}
                      >
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
          ]}
        >
          {([canSubmit, isSubmitting, isPristine]) => (
            <button
              className="text-dark h-10 cursor-pointer rounded bg-green-300 font-bold"
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
          {() => (
            <Label className="text-medium">
              {TRANSLATIONS.depositForm.info.balance} {": "}
              {roundToDecimals(balance)}{" "}
              {TOKEN_CURRENCIES[getFieldValue("token")].symbol}
            </Label>
          )}
        </Subscribe>
      </div>
    </form>
  );
});
