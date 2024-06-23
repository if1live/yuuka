import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { decode } from "hono/jwt";
import { z } from "zod";

// supabase session.access_token
// 사용할 가능성 있는 필드만 뜯기
const accessTokenSchema = z.object({
  sub: z.string(),
});

const decodeAccessToken = (text: string) => {
  const { payload } = decode(text ?? "");
  const token = accessTokenSchema.safeParse(payload);
  return token;
};

const extractBearer = (c: Context): string | undefined => {
  const header = c.req.header("Authorization");
  const text = header?.replace("Bearer ", "");
  return text;
};

const extractUserId = (token: z.infer<typeof accessTokenSchema>) => {
  const userId = token.sub;
  return userId;
};

const extract = (c: Context): string | undefined => {
  const tokenText = extractBearer(c);
  if (!tokenText) return undefined;

  const token = decodeAccessToken(tokenText);
  if (token.error) return undefined;

  const userId = extractUserId(token.data);
  return userId;
};

const extractOrThrow = (c: Context): string => {
  const userId = extract(c);
  if (!userId) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return userId;
};

export const AccessTokenHelper = {
  extract,
  extractOrThrow,
};
