import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const helloHandler: ValidatedEventAPIGatewayProxyEvent<unknown> = async (
  event
) => {
  try {
    return formatJSONResponse({
      message: `Hello, welcome to the exciting Serverless world!!!!`,
      event,
    });
  } catch (e) {
    console.log(e);
  }
};

export const main = middyfy(helloHandler);
