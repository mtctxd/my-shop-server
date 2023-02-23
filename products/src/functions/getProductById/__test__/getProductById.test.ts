import { formatJSONResponse } from '@libs/api-gateway';
import { StatusCode } from '@declarations/StatusCode';
import { productsMock } from '@mocks/productsMock';
import { getProductById } from '../getProductById';
import { Context } from 'aws-lambda';

const context = {} as Context;
const callback = jest.fn()

describe('getProductById', () => {
  it('should return a product when given a valid ID', async () => {
    const product = productsMock[0];
    const event = {
      pathParameters: {
        productID: product.id,
      },
    } as any;

    const response: any = await getProductById(event, context, callback);

    expect(response).toEqual(
      formatJSONResponse({
        message: product,
      })
    );
    expect(response.statusCode).toEqual(200);
  });

  it('should return a 404 error when given an invalid ID', async () => {
    const invalidID = 'invalid_id';
    const event = {
      pathParameters: {
        productID: invalidID,
      },
    } as any;

    const response: any = await getProductById(event, context, callback);

    expect(response).toEqual(
      formatJSONResponse(
        {
          message: 'Not Found',
        },
        StatusCode.NOT_FOUND
      )
    );
    expect(response.statusCode).toEqual(StatusCode.NOT_FOUND);
  });
});
