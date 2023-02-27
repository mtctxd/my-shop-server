import { handlerPath } from '@libs/handler-resolver';

export const createProduct = {
  handler: `${handlerPath(__dirname)}/createProduct.createProductHandler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        cors: true,
        request: {},
      },
    },
  ],
};
