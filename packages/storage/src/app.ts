import { type Context, Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { decode } from "hono/jwt";
import { z } from "zod";
import { engine, settings, storageClient } from "./instances.js";

export const app = new Hono();

app.use("*", cors());
app.use("*", compress());

// TODO: 인증은 나중에 생각
// app.use("/auth/*", jwt({ secret: settings.TOKEN_SECRET }));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse();
  }

  if (err instanceof Error) {
    const output = {
      name: err.name,
      message: err.message,
    };
    return c.json(output, 400);
  }

  // else..
  const output = {
    name: "UnknownError",
  };
  return c.json(output, 500);
});

const robotsTxt = `
User-agent: *
Allow: /

User-agent: GPTBot
Disallow: /
`.trimStart();

app.get("/robots.txt", async (c) => {
  return c.text(robotsTxt);
});

// supabase auth token 뜯어서 필요한 부분만 얻고싶다
// exp, iat 토큰에서 취급안해도 된다.
const authTokenSchema = z.object({
  sub: z.string().min(1),
});

const extractUserId = (c: Context): string => {
  const tokenToDecode = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!tokenToDecode) {
    throw new HTTPException(401);
  }

  const { header, payload } = decode(tokenToDecode);
  const data = authTokenSchema.parse(payload);
  return data.sub;
};

const bucketName = "yuuka";

app.get("/storage/download/signedUrl", async (c) => {
  const userId = extractUserId(c);
  const fp = `${userId}/book.db`;

  const { data, error } = await storageClient
    .from(bucketName)
    .createSignedUrl(fp, 60);

  if (error) {
    throw error;
  }

  return c.json(data);
});

app.get("/storage/upload/signedUrl", async (c) => {
  const userId = extractUserId(c);
  const fp = `${userId}/book.db`;

  // createSignedUploadUrl() 사용하면 새로운 파일 업로드는 되는데 덮어쓰기가 안된다?
  // StorageUnknownError 발생하는데 supbase 권한으로 삽질하면 되려나?
  // const { data, error } = await storageClient
  //   .from("yuuka")
  //   .update(filename, body, {
  //     contentType: "application/octet-stream",
  //     upsert: true,
  //   });
  // return c.json(data);

  const { data, error } = await storageClient
    .from(bucketName)
    .createSignedUploadUrl(fp);

  if (error) {
    throw error;
  }

  return c.json(data);
});

app.get("/", async (c) => {
  const html = await engine.renderFile("index", { name: "yuuka" });
  return c.html(html);
});
