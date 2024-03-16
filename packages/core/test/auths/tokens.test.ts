import { assert, describe, it } from "vitest";
import { AuthToken } from "../../src/auths/tokens.js";

describe("AuthToken", () => {
  const secret = "helloworld";

  it("ok", () => {
    const input: AuthToken = { user_id: 123 };
    const token = AuthToken.sign(input, { secret });
    const actual = AuthToken.verify(token, { secret });
    assert.deepEqual(input.user_id, actual.user_id);
  });

  describe("verify", () => {
    it("error: invalid auth token format", () => {
      const input: AuthToken = { user_id: -1 };
      const token = AuthToken.sign(input, { secret });
      assert.throws(() => AuthToken.verify(token, { secret }));
    });

    it("error: invalid jwt", () => {
      assert.throws(() => AuthToken.verify("asdf", { secret }));
    });

    it("error: different secret", () => {
      const input: AuthToken = { user_id: 123 };
      const token = AuthToken.sign(input, { secret: "a" });
      assert.throws(() => AuthToken.verify(token, { secret: "b" }));
    });
  });

  describe("safeVerify", () => {
    it("error: different secret", () => {
      const input: AuthToken = { user_id: 123 };
      const token = AuthToken.sign(input, { secret: "a" });
      const actual = AuthToken.safeVerify(token, { secret: "b" });
      assert.strictEqual(actual.isErr(), true);
    });
  });

  describe("decode", () => {
    it("ok: different secret", () => {
      const input: AuthToken = { user_id: 123 };
      const token = AuthToken.sign(input, { secret: secret });
      const actual = AuthToken.decode(token);
      assert.strictEqual(actual.user_id, input.user_id);
    });
  });
});
