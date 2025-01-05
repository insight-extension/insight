import { useSearchParams } from "react-router";
import { useMemo } from "react";

import { SEARCH_PARAMS } from "@repo/shared/constants";

export const useSearchParamValue = <T extends keyof typeof SEARCH_PARAMS>(
    key: T
): string | null => {
    const [searchParams] = useSearchParams();

    return useMemo(() => searchParams.get(key), [searchParams, key]);
};
