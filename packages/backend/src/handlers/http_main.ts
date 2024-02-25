import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { LambdaEvent, handle } from "hono/aws-lambda";
import { app } from "../app.js";

export const dispatch: APIGatewayProxyHandlerV2 = async (event, context) => {
  const handler = handle(app);
  const result = handler(event as unknown as LambdaEvent, context);
  return result;
};
