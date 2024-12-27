import { JwtPayload, jwtDecode } from "jwt-decode";
import { match, P } from "ts-pattern";

import { SECOND } from "@repo/shared/constants";

export const isTokenExpired = ({
  token,
  shiftInMilliseconds = 30 * SECOND,
}: {
  token: string;
  shiftInMilliseconds?: number;
}): boolean => {
  try {
    const { exp: expiresInSeconds } = jwtDecode<JwtPayload>(token);

    return match(expiresInSeconds)
      .with(P.nullish, () => true)
      .otherwise(
        (expiresIn) => Date.now() >= expiresIn * SECOND + shiftInMilliseconds
      );
  } catch (error) {
    return true;
  }
};

export { jwtDecode, type JwtPayload };
