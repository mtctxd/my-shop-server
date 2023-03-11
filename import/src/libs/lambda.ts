import middy, { MiddlewareObj } from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { Context } from 'aws-lambda';

export const loggerMiddy = (): MiddlewareObj<any, any, Error, Context> => {
  return {
    before: async (request) => {
      console.log(request);
    },
    onError: async (request) => {
      console.error(request);
    },
  };
};

export const midifyEvent = (handler) => {
  return middy(handler).use(loggerMiddy());
};

export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser()).use(loggerMiddy());
};
