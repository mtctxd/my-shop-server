import { StatusCode } from '@declarations/StatusCode';
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsStorage } from '@utils/ProductsStorage';

export const getProductById: ValidatedEventAPIGatewayProxyEvent<
  unknown
> = async (event) => {
  const { productID } = event.pathParameters;
  const product = await productsStorage.getProductById(productID);

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

export const getProductByIdHandler = middyfy(getProductById);
