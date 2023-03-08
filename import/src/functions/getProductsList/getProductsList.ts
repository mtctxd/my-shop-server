import { StatusCode } from '@declarations/StatusCode';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsService } from 'src/services/ProductsService';

export const getProductsList: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async () => {
  try {
    const products = await productsService.getProducts();

    return formatJSONResponse({
      response: products,
    });
  } catch (error) {
    return formatJSONResponse({
      response: {
        message: error.message,
      },
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export const getProductsListHandler = middyfy(getProductsList);
