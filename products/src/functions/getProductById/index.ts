import { handlerPath } from '@libs/handler-resolver';

export const getProductById = {
  handler: `${handlerPath(__dirname)}/getProductById.getProductByIdHandler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productID}',
        request: {},
      },
    },
  ],
};
