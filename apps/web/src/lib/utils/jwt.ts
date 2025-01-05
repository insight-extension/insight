import { InvalidTokenError, JwtPayload, jwtDecode } from "jwt-decode";
import { P, match } from "ts-pattern";

import { SECOND } from "@repo/shared/constants";

// todo: refactor to use either
export const isTokenExpired = ({
  token,
  shiftInMilliseconds = 30 * SECOND
}: {
  token: string;
  shiftInMilliseconds?: number;
}): boolean => {
  try {
    const { exp: expiresInSeconds } = jwtDecode<JwtPayload>(token);

    return match(expiresInSeconds)
      .with(
        P.nonNullable,
        (expiresIn) => Date.now() >= expiresIn * SECOND + shiftInMilliseconds
      )
      .otherwise(() => true);
  } catch (error: any) {
    throw new InvalidTokenError(error.message);
  }
};
