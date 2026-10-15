import "server-only";
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const config = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET,
  publicUrl: process.env.R2_PUBLIC_URL?.replace(/\/$/, ""),
};

function r2(): { client: S3Client; bucket: string } {
  if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || !config.bucket) {
    throw new Error(
      "R2 env vars missing. Fill R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET in .env.local / Vercel."
    );
  }
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
  return { client, bucket: config.bucket };
}

export function publicUrlFor(key: string): string {
  if (!config.publicUrl) throw new Error("R2_PUBLIC_URL is not set.");
  return `${config.publicUrl}/${key}`;
}

/** Presigned PUT — client uploads straight to R2, bypassing Vercel body limits. */
export async function presignUpload(key: string, mimeType: string): Promise<string> {
  const { client, bucket } = r2();
  return getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: mimeType }),
    { expiresIn: 600 }
  );
}

export async function deleteObject(key: string): Promise<void> {
  const { client, bucket } = r2();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function objectExists(key: string): Promise<boolean> {
  try {
    const { client, bucket } = r2();
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}
