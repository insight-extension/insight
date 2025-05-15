import type { Validator } from "@tanstack/form-core";
import { isRight } from "fp-ts/Either";
import { fromEither } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import * as t from "io-ts";

import { Params, ValidationSource } from "./types.js";
import { defaultFormTransformer, defaultTransformErrors } from "./utils.js";

export const formIoTsValidator =
  (params: Params = {}): Validator<unknown, t.Type<unknown>> =>
  () => {
    const transformFieldErrors =
      params.transformErrors ?? defaultTransformErrors;

    const getTransformStrategy = (validationSource: ValidationSource) =>
      validationSource === "form"
        ? defaultFormTransformer(transformFieldErrors)
        : transformFieldErrors;

    return {
      validate({ value, validationSource }, fn) {
        const result = fn.decode(value);

        if (isRight(result)) return;

        const transformer = getTransformStrategy(validationSource);

        return transformer(result.left);
      },
      async validateAsync({ value, validationSource }, fn) {
        const result = await pipe(fn.decode(value), fromEither)();

        if (isRight(result)) return;

        const transformer = getTransformStrategy(validationSource);

        return transformer(result.left);
      }
    };
  };

export type FormIoTsValidator = ReturnType<typeof formIoTsValidator>;
