import { useMemo } from "react";
import { useSearchParams } from "react-router";

import { APP_SEARCH_PARAMS } from "@repo/shared/constants";

export const useSearchParamValue = <T extends keyof typeof APP_SEARCH_PARAMS>(
  key: T
): string | null => {
  const [searchParams] = useSearchParams();

  return useMemo(() => searchParams.get(key), [searchParams, key]);
};
