import type { ValidationError } from "@tanstack/form-core";
import * as t from "io-ts";

import { TransformFn } from "./types";

export const prefixSchemaToErrors = (
  errors: t.Errors,
  prefix: string
): t.Errors => {
  return errors.map((error) => ({
    ...error,
    context: error.context.map((ctx) => ({
      ...ctx,
      key: prefix ? `${prefix}.${ctx.key}` : ctx.key
    }))
  }));
};

export const defaultFormTransformer =
  (transformErrors: TransformFn) =>
  (errors: t.Errors): ValidationError =>
    transformErrors(errors);

export const defaultTransformErrors = (errors: t.Errors) =>
  errors
    .map(
      (error) =>
        error.context.map((context) => context.key).join(".") +
        ": " +
        error.message
    )
    .join(", ");
