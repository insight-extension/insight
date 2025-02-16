import { describe, expect, it } from "vitest";

import { createJWTTokenWithPayloadAndExpiration } from "../utils/jwt";

describe("JWT Token Comparison", () => {
  it("should correctly compare two different JWT tokens", () => {
    const publicKey = "6ASFUJeR2dJicMVRV39aghNmny2w3FgBzGssaxX91xQA";
    const payload = { publicKey, iat: 1739727907 };

    const token1 = createJWTTokenWithPayloadAndExpiration(
      payload,
      // import.meta.env.VITE_JWT_SECRET,
      "FAWRQW212432RFDAF2FSADCVMASD",
      30
    );

    expect(token1).toBeNull();
  });
});
