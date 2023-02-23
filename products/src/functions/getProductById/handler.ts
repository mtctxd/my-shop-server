import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsMock } from 'src/mocks/productsMock';
import { StatusCode } from 'src/types/StatusCode';

export const getProductByIdHandler: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async (event) => {
  const { productID } = event.pathParameters;
  const product = productsMock.find((product) => product.id === productID);

  if (!product) {
    return formatJSONResponse(
      {
        message: 'Not Found',
      },
      StatusCode.NOT_FOUND
    );
  }

  return formatJSONResponse({
    message: product,
  });
};

export const main = middyfy(getProductByIdHandler);
