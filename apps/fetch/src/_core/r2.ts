import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export type R2Kind = "data" | "backup";

export type R2Store = {
  kind: R2Kind;
  bucket: string;
  client: S3Client;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

export function createR2Store(kind: R2Kind): R2Store {
  const prefix = kind === "data" ? "R2_DATA" : "R2_BACKUP";
  return {
    kind,
    bucket: requiredEnv(`${prefix}_BUCKET`),
    client: new S3Client({
      endpoint: requiredEnv(`${prefix}_ENDPOINT`),
      region: "auto",
      credentials: {
        accessKeyId: requiredEnv(`${prefix}_ACCESS_KEY_ID`),
        secretAccessKey: requiredEnv(`${prefix}_SECRET_ACCESS_KEY`),
      },
    }),
  };
}

export async function putR2Object(
  store: R2Store,
  key: string,
  body: string | Uint8Array,
  options: { contentType: string; cacheControl?: string } = {
    contentType: "application/octet-stream",
  },
) {
  await store.client.send(
    new PutObjectCommand({
      Bucket: store.bucket,
      Key: key,
      Body: body,
      ContentType: options.contentType,
      CacheControl: options.cacheControl,
    }),
  );
}

export async function getR2ObjectText(store: R2Store, key: string) {
  return new TextDecoder().decode(await getR2ObjectBytes(store, key));
}

export async function getR2ObjectBytes(store: R2Store, key: string) {
  const result = await store.client.send(
    new GetObjectCommand({ Bucket: store.bucket, Key: key }),
  );
  if (!result.Body) throw new Error(`R2 object has no body: ${key}`);
  return result.Body.transformToByteArray();
}

export async function hasR2Object(store: R2Store, key: string) {
  try {
    await store.client.send(
      new HeadObjectCommand({ Bucket: store.bucket, Key: key }),
    );
    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } })
      .$metadata?.httpStatusCode;
    if (status === 404 || (error as { name?: string }).name === "NotFound") {
      return false;
    }
    throw error;
  }
}
