import { StatusCode } from '@declarations/StatusCode';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import AWS from 'aws-sdk';

import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3();

export const importProductsFile: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async (event) => {
  const { name } = event.queryStringParameters;

  if (!name) {
    return formatJSONResponse({
      response: 'No name provided',
    });
  }

  const params = {
    Bucket: 'my-shop-server-imports',
    Key: `uploaded/${name}`,
    ContentType: 'text/csv',
  };

  const signedUrl = await s3.getSignedUrlPromise('putObject', params);

  try {
    return formatJSONResponse({
      response: signedUrl,
    });
  } catch (error) {
    return formatJSONResponse({
      response: {
        message: error.message,
      },
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export const importProductsFileHandler = middyfy(importProductsFile);
