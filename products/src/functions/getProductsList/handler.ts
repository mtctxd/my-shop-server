import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsMock } from 'src/@mocks/productsMock';

const getProductsListHandler: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async () => {
  return formatJSONResponse({
    message: productsMock,
  });
};

export const main = middyfy(getProductsListHandler);
