import { describe, expect, it } from "vitest";

import { createJWTTokenWithPayloadAndExpiration } from "../utils/jwt";

describe("JWT Token Comparison", () => {
  it("should correctly compare two different JWT tokens", () => {
    const publicKey = ""; // add your wallet;
    const payload = { publicKey, iat: 1739727907 };

    const token1 = createJWTTokenWithPayloadAndExpiration(
      payload,
      import.meta.env.VITE_JWT_SECRET,
      30
    );

    expect(token1).toBeNull();
  });
});
