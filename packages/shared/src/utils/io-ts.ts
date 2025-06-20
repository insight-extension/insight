import * as t from "io-ts";

export const codecFromEnum = <EnumType>(
  enumName: string,
  theEnum: Record<string, string | number>
) => {
  const isEnumValue = (input: unknown): input is EnumType =>
    Object.values<unknown>(theEnum).includes(input);

  return new t.Type<EnumType>(
    enumName,
    isEnumValue,
    (input, context) =>
      isEnumValue(input) ? t.success(input) : t.failure(input, context),
    t.identity
  );
};
