import { ValidatorAdapterParams } from "@tanstack/form-core";
import * as t from "io-ts";

export type Params = ValidatorAdapterParams<t.ValidationError>;

export type TransformFn = NonNullable<Params["transformErrors"]>;

export type ValidationSource = "form" | "field";
