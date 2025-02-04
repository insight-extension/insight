import { APP_SEARCH_PARAMS } from "@repo/shared/constants";

export const constructURLWithParams = <
  T extends keyof typeof APP_SEARCH_PARAMS
>({
  url,
  params
}: {
  url: string;
  params: Partial<Record<T, keyof (typeof APP_SEARCH_PARAMS)[T]>>;
}): string => {
  const queryParams = Object.entries(params)
    .map(([key, value]) => {
      const paramOptions = APP_SEARCH_PARAMS[key as T];

      return `${key}=${paramOptions[value as keyof typeof paramOptions]}`;
    })
    .join("&");

  return queryParams ? `${url}?${queryParams}` : url;
};
