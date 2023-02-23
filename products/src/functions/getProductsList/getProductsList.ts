import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsMock } from '@mocks/productsMock';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async () => {
  return formatJSONResponse({
    message: productsMock,
  });
};

export const getProductsListHandler = middyfy(getProductsList);
