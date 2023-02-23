import { handlerPath } from '@libs/handler-resolver';

export const getProductById = {
  handler: `${handlerPath(__dirname)}/getProductById.getProductByIdHandler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productID}',
        request: {},
        responseData: {
          200: {
            description: 'Should return product by id',
            bodyType: 'Product'
          },
          404: {
            description: 'Should return "Not foudnd if there is no product with corresponding id"'
          }
        },
      },
    },
  ],
};
