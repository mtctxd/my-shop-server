import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsMock } from 'src/@mocks/productsMock';

const getProductByIdHandler: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async (event) => {
  const { id } = event.pathParameters;
  return formatJSONResponse({
    message: productsMock.find((product) => product.id === id),
  });
};

export const main = middyfy(getProductByIdHandler);
