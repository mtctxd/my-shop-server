import { formatJSONResponse } from '@libs/api-gateway';
import { productsMock } from '@mocks/productsMock';
import { Context } from 'aws-lambda';
import { getProductsList } from '../getProductsList';

const event: any = {};
const context = {} as Context;
const callback = jest.fn();

describe('getProductList', () => {
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
