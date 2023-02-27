import { StatusCode } from '@declarations/StatusCode';
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsService } from 'src/services/ProductsService';

export const getProductById: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async (event) => {
  const { productID } = event.pathParameters;
  try {
    const product = await productsService.getProductById(productID);

    if (!product) {
      return formatJSONResponse({
        response: {
          message: 'Product Not Found',
        },
        statusCode: StatusCode.NOT_FOUND,
      });
    }

    return formatJSONResponse({
      response: product,
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

export const getProductByIdHandler = middyfy(getProductById);
