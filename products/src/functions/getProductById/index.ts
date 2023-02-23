import { handlerPath } from '@libs/handler-resolver';

export const getProductById = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productID}',
        request: {
          // schemas: {
          //   'application/json': helpSchema,
          // },
        },
      },
    },
  ],
};
