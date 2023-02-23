import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { productsMock } from '@mocks/productsMock';
import { StatusCode } from '@declarations/StatusCode';

export const getProductById: ValidatedEventAPIGatewayProxyEvent<
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

export const getProductByIdHandler = middyfy(getProductById);
