import { createDecoder, createSigner, createVerifier } from "fast-jwt";
import { Result } from "neverthrow";
import { z } from "zod";
import { settings } from "../settings.js";

const schema = z.object({
  user_id: z.number().positive(),
});
export type AuthToken = z.infer<typeof schema>;

interface Options {
  secret: string;
}

export const AuthToken = {
  schema,

  extract_key(options?: Options) {
    return options?.secret ?? settings.TOKEN_SECRET;
  },

  sign(payload: AuthToken, options?: Options): string {
    const key = this.extract_key(options);
    const signSync = createSigner({
      key,
      // TODO: fast-jwt는 필요한 속성을 외부에서 연결할 수 있다.
      // jti: "sample-jti",
      // aud: "sample-aud",
      // iss: "sample-iss",
      expiresIn: "24h",
    });
    const token = signSync(payload);
    return token;
  },

  verify(token: string, options?: Options): AuthToken {
    const key = this.extract_key(options);
    const verifySync = createVerifier({ key });
    const output = verifySync(token);
    return this.schema.parse(output);
  },

  safeVerify(token: string, options?: Options) {
    const fn = Result.fromThrowable(
      () => this.verify(token, options),
      (e) => e as Error,
    );
    return fn();
  },

  decode(token: string): AuthToken {
    const decodeSync = createDecoder();
    const output = decodeSync(token);
    return this.schema.parse(output);
  },

  safeDecode(token: string) {
    const fn = Result.fromThrowable(
      () => this.decode(token),
      (e) => e as Error,
    );
    return fn();
  },
};
