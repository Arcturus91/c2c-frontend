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
  const { fileName, fileType, metadata } = await request.json();

  if (!fileName || !fileType) {
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Missing fileName or fileType",
      }),
      { status: 400 }
    );
  }

  const metadataFields = metadata
    ? Object.entries(metadata).reduce((acc, [key, value]) => {
        acc[`x-amz-meta-${key.toLowerCase()}`] = value as string;
        return acc;
      }, {} as Record<string, string>)
    : {};
  try {
    const post = await createPresignedPost(s3Client, {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: fileName,
      Fields: {
        "Content-Type": fileType,
        ...metadataFields,
      },
      Expires: 600, // URL expires in 10 minutes
    });

    return new Response(JSON.stringify(post), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating presigned POST:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Failed to create presigned POST",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
