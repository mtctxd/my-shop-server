import { handlerPath } from '@libs/handler-resolver';

export const getProductsList = {
  handler: `${handlerPath(__dirname)}/getProductsList.getProductsListHandler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products',
        request: {},
      },
    },
  ],
};
