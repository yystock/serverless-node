// import {loader} from "@aws-sdk/client-api-gateway"
import { ApiGatewayManagementApiClient, PostToConnectionCommand, PostToConnectionCommandInputType } from "@aws-sdk/client-apigatewaymanagementapi";
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { messsageValidator } from "./db/validators";
import { getAPIGatewayClient } from "./lib/constants";

type Action = "$connect" | "$disconnect" | "getClients" | "sendMessage" | "getMessages";
let DB = {};
export const handler = async (event: APIGatewayProxyEvent, context, cb): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId as string;
  const routeKey = event.requestContext.routeKey as Action;

  try {
    switch (routeKey) {
      case "$connect":
        return handleConnect(event);
      case "$disconnect":
        return handleDisconnect(connectionId);
      default:
        return handleMain(event, context, cb);
    }
  } catch (e) {
    if (e instanceof Error) {
      return { statusCode: 200, body: "error" };
    }

    throw e;
  }
};

const handleConnect = async (event) => {
  const queryParameters = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;
  if (!queryParameters || !queryParameters["userId"]) {
    return { statusCode: 400, body: "Missing userId." };
  }
  const connectionId = event.requestContext.connectionId;
  // some auth or user update
  DB[connectionId] = DB[connectionId] ? [...DB[connectionId], queryParameters["userId"]] : [queryParameters["userId"]];
  const response = await sendToAll(Object.keys(DB), { connected: `${connectionId}` }, event.requestContext.domainName);
  return {
    statusCode: 200,
    body: "Connected.",
  };
};

const handleDisconnect = async (event) => {
  console.log("disconnect");
  return {
    statusCode: 200,
    body: "Disconnected.",
  };
};

const handleMain = async (event: APIGatewayProxyEvent, context, cb) => {
  const jsonBody = JSON.parse(event.body || "{}");
  const data = messsageValidator.safeParse(jsonBody);
  if (!data.success) {
    throw new Error("Invalid message.");
  }
  const response = await sendToAll(Object.keys(DB), jsonBody, event.requestContext.domainName);
  return {
    statusCode: 200,
    body: "Sent.",
  };
};

const sendToAll = async (ids, body, domain) => {
  console.log(ids);
  const all = ids.map((i) => sendToOne(i, body, domain));
  return Promise.all(all);
};

const sendToOne = async (id, body, domain) => {
  console.log(body);
  if (!body) {
    console.log("none");
  }
  try {
    const client = getAPIGatewayClient(domain);

    const command = new PostToConnectionCommand({
      ConnectionId: id,
      Data: JSON.stringify(body),
    });
    await client.send(command);
  } catch (err) {
    console.error(err);
  }
};

// const sendMessage = async (id, body) => {
//     const endpoint = process.env.STAGE ? `http://localhost:3001` : `https://${event.requestContext.domainName}/${event.requestContext.stage}`;
//     const client = new ApiGatewayManagementApiClient({
//       endpoint: endpoint,
//     });
//   try {
//     const command = new PostToConnectionCommand({
//       ConnectionId: id,
//       Data: Buffer.from(JSON.stringify(body)),
//     });
//     const response = await client.send(command);
//   } catch (err) {
//     console.error(err);
//   }
// };

// module.exports.auth = async (event, context) => {
//   // return policy statement that allows to invoke the connect function.
//   // in a real world application, you'd verify that the header in the event
//   // object actually corresponds to a user, and return an appropriate statement accordingly
//   return {
//     principalId: "user",
//     policyDocument: {
//       Version: "2012-10-17",
//       Statement: [
//         {
//           Action: "execute-api:Invoke",
//           Effect: "Allow",
//           Resource: event.methodArn,
//         },
//       ],
//     },
//   };
// };
