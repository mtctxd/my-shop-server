import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsStorage } from '@utils/ProductsStorage';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async () => {
  const products = await productsStorage.getProducts();
  return formatJSONResponse({
    message: products,
  });
};

export const getProductsListHandler = middyfy(getProductsList);
