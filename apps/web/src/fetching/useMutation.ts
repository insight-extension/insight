import useSWRMutation from "swr/mutation";

export const useMutation = <Request, Response>({
  key,
  mutateFn,
}: {
  key: string;
  mutateFn: (data: Request) => Promise<Response>;
}) =>
  useSWRMutation<Response, Error, string, Request>(key, (_, { arg: args }) =>
    mutateFn(args)
  );
