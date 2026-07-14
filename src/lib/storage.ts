import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION ?? "us-east-1",
  forcePathStyle: true,
  credentials: process.env.S3_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? ""
      }
    : undefined
});

export async function createUploadUrl(key: string, contentType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType
  });
  return getSignedUrl(client, command, { expiresIn: 600 });
}

export async function createReadUrl(keyOrUrl: string) {
  if (keyOrUrl.startsWith("http")) return keyOrUrl;
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: keyOrUrl
  });
  return getSignedUrl(client, command, { expiresIn: 900 });
}
