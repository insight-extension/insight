import { SECOND } from "@shared/constants";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { P, match } from "ts-pattern";

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
      .with(P.nullish, () => true)
      .otherwise(
        (expiresIn) => Date.now() >= expiresIn * SECOND + shiftInMilliseconds
      );
  } catch (error) {
    return true;
  }
};

export { jwtDecode, type JwtPayload };
