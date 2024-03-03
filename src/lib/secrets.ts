import { SSMClient, GetParameterCommand, PutParameterCommand, PutParameterCommandInput } from "@aws-sdk/client-ssm";
import { AWS_REGION, STAGE } from "./constants";

export async function getDatabaseUrl() {
  const DATABASE_URL_SSM_PARAM = `/serverless-node/${STAGE}/database-url`;
  const client = new SSMClient({ region: AWS_REGION });
  const paramStoreData = {
    Name: DATABASE_URL_SSM_PARAM,
    WithDecryption: true,
  };
  const command = new GetParameterCommand(paramStoreData);
  const result = await client.send(command);
  return result.Parameter.Value;
}

export async function putDatabaseUrl(stage, dbUrlVal) {
  const paramStage = stage ? stage : "dev";
  if (paramStage === "prod") {
    return;
  }
  if (!dbUrlVal) {
    return;
  }
  const DATABASE_URL_SSM_PARAM = `/serverless-node/${paramStage}/database-url`;
  const client = new SSMClient({ region: AWS_REGION });
  const paramStoreData: PutParameterCommandInput = {
    Name: DATABASE_URL_SSM_PARAM,
    Value: dbUrlVal,
    Type: "SecureString",
    Overwrite: true,
  };
  const command = new PutParameterCommand(paramStoreData);
  const result = await client.send(command);
  return result;
}
