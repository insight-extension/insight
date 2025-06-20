import { fold } from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import * as t from "io-ts";

export const createFallbackedCodec = <TCodec extends t.Type<any, any, unknown>>(
  codec: TCodec,
  fallbackValue: TCodec["_A"]
) => {
  return new t.Type(
    `FallbackType<${codec.name}>`,
    codec.is,
    (input, _context) =>
      pipe(
        codec.decode(input),
        fold(
          () => t.success(fallbackValue),
          (value) => t.success(value)
        )
      ),
    codec.encode
  );
};
