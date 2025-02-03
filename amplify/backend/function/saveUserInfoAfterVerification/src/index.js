import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  if (!event.request?.userAttributes) {
    console.error("No user attributes found in event");
    return event;
  }

  const userId = event.request.userAttributes.sub;
  const email = event.request.userAttributes.email;
  const phoneNumber = event.request.userAttributes.phone_number;
  const userType = event.request.userAttributes["custom:type"] || "standard";
  const userStatus = event.request.userAttributes["custom:status"] || "active";

  const params = {
    TableName: "User-bhsuluo55vac3f3w6fsk6j4rdm-dev",
    Item: {
      id: userId,
      email,
      phoneNumber,
      type: userType,
      status: userStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamodb.send(new PutCommand(params));
    console.log("✅ User data inserted into DynamoDB:", params.Item);
  } catch (error) {
    console.error("❌ Error inserting user data into DynamoDB:", error);
    throw new Error("Unable to insert user data into DynamoDB");
  }

  return event;
};
