import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

export const AWS_REGION = "us-east-2";
export const STAGE = process.env.STAGE || "prod";

export const getAPIGatewayClient = (domainName: string) => {
  const endpoint = process.env.STAGE ? `http://localhost:3001` : `https://${domainName}/prod`;
  return new ApiGatewayManagementApiClient({
    endpoint: endpoint,
  });
};
