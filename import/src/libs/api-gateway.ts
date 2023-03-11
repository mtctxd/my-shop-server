import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { StatusCode } from '@declarations/StatusCode';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

const defaultHeaders = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
};

export type FormatJSONResponseOptions = {
  response?: unknown;
  statusCode?: StatusCode;
  headers?: Record<string, string>;
};

export const formatJSONResponse = ({
  statusCode,
  headers,
  response,
}: FormatJSONResponseOptions = {}) => {
  return {
    body: JSON.stringify(response),
    statusCode: statusCode || StatusCode.OK,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };
};
