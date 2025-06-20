import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { SubscriptionType } from "@repo/shared/constants";

import { ConnectionStatus, TRANSLATION_LANGUAGES } from "@/constants";
import { PageValues, pages } from "@/constants/pages";
import { useAccessToken, useAudioRecord, useTokenBalance } from "@/hooks";
import { Language } from "@/types";

interface AppContextType {
  isSidebar: boolean;
  setIsSidebar: (value: boolean) => void;
  currentPage: PageValues;
  setCurrentPage: (page: PageValues) => void;
  sourceLanguage: Language;
  setSourceLanguage: (language: Language) => void;
  targetLanguage: Language;
  setTargetLanguage: (language: Language) => void;
  shouldUpdateBalance: boolean;
  setShouldUpdateBalance: (value: boolean) => void;
  subscriptionType: SubscriptionType;
  setSubscriptionType: (subscriptionType: SubscriptionType) => void;
  accessToken: string | null;
  balance: number | null;
  publicKey: string | null;
  freeHoursLeft: number | null;
  paidHoursLeft: number | null;
  nextFreeTime: string | null;
  start: () => void;
  resume: () => void;
  stop: () => void;
  isReady: boolean;
  status: ConnectionStatus;
  isRecording: boolean;
  transcription: string;
  translation: string;
  error: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebar, setIsSidebar] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageValues>(pages[0].value);

  const [sourceLanguage, setSourceLanguage] = useState<Language>(
    TRANSLATION_LANGUAGES.find((language) => language.countryCode === "US")!
  );
  const [targetLanguage, setTargetLanguage] = useState<Language>(
    TRANSLATION_LANGUAGES.find((language) => language.countryCode === "UA")!
  );
  const [shouldUpdateBalance, setShouldUpdateBalance] = useState(false);

  const { accessToken } = useAccessToken();

  const { balance, publicKey, freeHoursLeft, paidHoursLeft, nextFreeTime } =
    useTokenBalance({
      accessToken,
      shouldUpdate: shouldUpdateBalance
    });

  const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>(
    balance ? SubscriptionType.PER_MINUTE : SubscriptionType.FREE_TRIAL
  );

  const {
    start,
    resume,
    stop,
    isReady,
    status,
    isRecording,
    transcription,
    translation,
    error
  } = useAudioRecord({
    accessToken,
    subscriptionType,
    sourceLanguageAlpha2Code: sourceLanguage?.alpha2,
    targetLanguageAlpha2Code: targetLanguage?.alpha2
  });

  useEffect(() => {
    setSubscriptionType(
      balance
        ? subscriptionType !== SubscriptionType.FREE_TRIAL
          ? subscriptionType
          : SubscriptionType.PER_MINUTE
        : SubscriptionType.FREE_TRIAL
    );
  }, [balance]);

  return (
    <AppContext.Provider
      value={{
        isSidebar,
        setIsSidebar,
        sourceLanguage,
        setSourceLanguage,
        targetLanguage,
        setTargetLanguage,
        currentPage,
        setCurrentPage,
        shouldUpdateBalance,
        setShouldUpdateBalance,
        subscriptionType,
        setSubscriptionType,
        accessToken,
        balance,
        publicKey,
        freeHoursLeft,
        paidHoursLeft,
        nextFreeTime,
        start,
        resume,
        stop,
        isReady,
        status,
        isRecording,
        transcription,
        translation,
        error
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within a AppContextProvider");
  return context;
};
