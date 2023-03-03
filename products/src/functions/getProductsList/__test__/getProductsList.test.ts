import { formatJSONResponse } from '@libs/api-gateway';
import { productsMock } from '@mocks/productsMock';
import { productsStorage } from '@utils/ProductsStorage';
import { Context } from 'aws-lambda';
import { getProductsList } from '../getProductsList';

jest.mock('@utils/ProductsStorage', () => ({
  productsStorage: {
    getProducts: jest.fn(),
  },
}));

const event: any = {};
const context = {} as Context;
const callback = jest.fn();

describe('getProductList', () => {
  ( productsStorage.getProducts as jest.Mock).mockImplementationOnce(
    async () => productsMock
  );
  it('should return products list', async () => {
    const response: any = await getProductsList(event, context, callback);

    expect(response).toEqual(
      formatJSONResponse({
        message: productsMock,
      })
    );
    expect(response.statusCode).toEqual(200);
  });
});
