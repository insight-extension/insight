import { createFileRoute, stripSearchParams } from "@tanstack/react-router";
import * as t from "io-ts";

import { APP_SEARCH_PARAMS } from "@repo/shared/constants";

import { Home } from "@/app/pages/home";
import { ioTsValidator } from "@/lib/utils/io-ts-adapters/validator";

const ActionCodec = t.type({
  action: t.union([
    t.literal(APP_SEARCH_PARAMS.action["connect-wallet"]),
    t.literal(APP_SEARCH_PARAMS.action.deposit)
  ])
});

const defaultValues = {
  action: APP_SEARCH_PARAMS.action.default
};

export const Route = createFileRoute("/")({
  component: () => <Home />,
  validateSearch: ioTsValidator(ActionCodec, defaultValues),
  search: {
    middlewares: [stripSearchParams(defaultValues)]
  }
});
