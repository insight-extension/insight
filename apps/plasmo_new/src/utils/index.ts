import { SEARCH_PARAMS } from "~constants";

export const constructURLWithSelectiveParams = <
  T extends keyof typeof SEARCH_PARAMS,
>({
  url,
  key,
  selectedParams,
}: {
  url: string;
  key: T;
  selectedParams: (keyof (typeof SEARCH_PARAMS)[T])[];
}) => {
  if (selectedParams.length === 0) {
    return url;
  }

  const params = SEARCH_PARAMS[key];

  const queryParams =
    selectedParams.length === 1
      ? `${key}=${params[selectedParams[0]]}`
      : selectedParams
          .map((paramKey) => `${key}=${params[paramKey]}`)
          .join("&");

  return `${url}?${queryParams}`;
};
