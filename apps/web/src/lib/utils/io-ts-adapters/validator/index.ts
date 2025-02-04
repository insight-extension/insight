import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as t from "io-ts";

import { IoTsValidatorAdapter } from "./types";

export const ioTsValidator = <
  Params,
  Codec extends t.Type<any, any, unknown> & { _O: Params }
>(
  codec: Codec,
  defaultValues: Partial<Params>
): IoTsValidatorAdapter<typeof codec> => {
  return {
    types: {
      input: codec._A,
      output: codec._O
    },
    parse: (input) =>
      pipe(
        codec.decode(input),
        fold(
          (_errors) => defaultValues,
          (value) => value
        )
      )
  };
};
