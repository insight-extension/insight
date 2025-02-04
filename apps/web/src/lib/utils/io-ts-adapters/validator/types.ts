import { ValidatorAdapter } from "@tanstack/react-router";

export interface IoTsTypeLike {
  _A: any;
  _O: any;
  decode: (input: any) => any;
}

export type InputOutputOption = "input" | "output";

export interface IoTsValidatorOptions {
  readonly codec: IoTsTypeLike;
  readonly input?: InputOutputOption;
  readonly output?: InputOutputOption;
}

export type IoTsValidatorInput<
  Options extends IoTsTypeLike | IoTsValidatorOptions
> = Options extends IoTsValidatorOptions
  ? "input" extends Options["input"]
    ? Options["codec"]["_A"]
    : Options["codec"]["_O"]
  : Options extends IoTsTypeLike
    ? Options["_A"]
    : never;

export type IoTsValidatorOutput<
  Options extends IoTsTypeLike | IoTsValidatorOptions
> = Options extends IoTsValidatorOptions
  ? "output" extends Options["output"]
    ? Options["codec"]["_O"]
    : Options["codec"]["_A"]
  : Options extends IoTsTypeLike
    ? Options["_O"]
    : never;

export type IoTsValidatorAdapter<
  Options extends IoTsTypeLike | IoTsValidatorOptions
> = ValidatorAdapter<IoTsValidatorInput<Options>, IoTsValidatorOutput<Options>>;
