import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

export async function POST(request: Request) {
  const { fileName, fileType } = await request.json();

  if (!fileName || !fileType) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Missing fileName or fileType",
      }),
      { status: 500 }
    );
  }

  const post = await createPresignedPost(s3Client, {
    Bucket: process.env.S3_BUCKET_NAME as string,
    Key: fileName,
    Fields: {
      "Content-Type": fileType,
    },
    Expires: 600, // URL expires in 10 minutes
  });

  return new Response(JSON.stringify(post), { status: 200 });
}
