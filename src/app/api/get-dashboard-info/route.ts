import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const ddbClient = new DynamoDBClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const docClient = DynamoDBDocumentClient.from(ddbClient);

export async function GET() {
  try {
    const scanCommand = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME as string,
    });

    const scanResponse = await docClient.send(scanCommand);

    if (!scanResponse.Items || scanResponse.Items.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Not Found",
          message: "No items found in the database",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(scanResponse.Items), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error scanning DynamoDB:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: "Failed to retrieve dashboard data",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
