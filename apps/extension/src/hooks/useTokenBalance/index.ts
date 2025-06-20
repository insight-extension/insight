import { useCallback, useEffect, useRef, useState } from "react";

import { Connection, PublicKey } from "@solana/web3.js";
import { match, tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";

import { AnchorProvider } from "@repo/shared/anchor";
import {
  DAYS_IN_WEEK,
  HOURS_IN_DAY,
  SECOND,
  SOLANA_CLUSTER_URL,
  SPLToken,
  StorageKey,
  TOKEN_CURRENCIES
} from "@repo/shared/constants";
import { AnchorClient, accountService } from "@repo/shared/services";

import { storage } from "@/background";
import { sessionManager } from "@/session/manager";

interface UseTokenBalanceProps {
  accessToken: string | null;
  token?: SPLToken;
  shouldUpdate: boolean;
}

export const useTokenBalance = ({
  accessToken,
  // todo: make it dynamic from current user token
  token = TOKEN_CURRENCIES[SPLToken.USDC].symbol,
  shouldUpdate
}: UseTokenBalanceProps) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const [hasBalanceChanged, setHasBalanceChanged] = useState(false);
  const [freeHoursLeft, setFreeHoursLeft] = useState<number | null>(null);
  const [paidHoursLeft, setPaidHoursLeft] = useState<number | null>(null);
  const [nextFreeTime, setNextFreeTime] = useState<string | null>(null);

  const anchorClientRef = useRef<AnchorClient | null>(null);

  const updateBalance = useCallback(async () => {
    const anchorClient = anchorClientRef.current;

    if (!anchorClient) return;

    // todo: doesnt get actual balance event with timeout
    setBalance(await anchorClient.getUserBalance(token));
  }, [token]);

  const handleBalanceChange = useCallback(async () => {
    setHasBalanceChanged(true);
  }, []);

  useEffect(() => {
    if (balance === 0 && accessToken) {
      pipe(
        accountService.getFreeTrialInfo(accessToken),
        match(
          () => {
            setFreeHoursLeft(null);
          },
          (freeTimeInfo) => {
            setFreeHoursLeft(freeTimeInfo.freeHoursLeft);

            const nextFreeTime = freeTimeInfo.freeHoursStartDate
              ? new Date(freeTimeInfo.freeHoursStartDate)
              : null;

            if (nextFreeTime) {
              nextFreeTime.setHours(
                nextFreeTime.getHours() + HOURS_IN_DAY * DAYS_IN_WEEK
              );

              setNextFreeTime(nextFreeTime.toLocaleString());
            } else {
              setNextFreeTime(null);
            }
          }
        )
      )();
    }

    const anchorClient = anchorClientRef.current;

    if (anchorClient && balance && balance > 0 && accessToken) {
      pipe(
        tryCatch(
          async () => await anchorClient.getUserPaidTimeLeft(),
          () => null
        ),
        match(
          () => {
            setPaidHoursLeft(null);
          },
          (paidHoursLeft) => {
            setPaidHoursLeft(paidHoursLeft);
          }
        )
      )();
    }
  }, [balance, accessToken]);

  useEffect(() => {
    if (!hasBalanceChanged) return;

    (async () => {
      await updateBalance();

      setHasBalanceChanged(false);
    })();
  }, [hasBalanceChanged, updateBalance]);

  useEffect(() => {
    if (!shouldUpdate) return;

    (async () => {
      await updateBalance();

      setHasBalanceChanged(false);
    })();
  }, [shouldUpdate, updateBalance]);

  useEffect(() => {
    const callbackMap = {
      [StorageKey.DEPOSIT]: handleBalanceChange
    };

    storage.watch(callbackMap);

    return () => {
      storage.unwatch(callbackMap);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setPublicKey(null);
      setBalance(null);

      return;
    }

    (async () => {
      setPublicKey(sessionManager.decodeToken(accessToken));
    })();
  }, [accessToken]);

  useEffect(() => {
    if (!publicKey) return;

    (async () => {
      anchorClientRef.current = new AnchorClient(
        new AnchorProvider(new Connection(SOLANA_CLUSTER_URL), {
          publicKey: new PublicKey(publicKey),
          signTransaction: async (_) => _,
          signAllTransactions: async (_) => []
        })
      );

      await storage.set(StorageKey.PUBLIC_KEY, publicKey);

      await updateBalance();
    })();
  }, [publicKey]);

  return {
    balance,
    freeHoursLeft,
    paidHoursLeft,
    publicKey,
    nextFreeTime
  };
};
