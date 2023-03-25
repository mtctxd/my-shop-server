import { Product } from '@declarations/Product';
import { StatusCode } from '@declarations/StatusCode';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import dotenv from 'dotenv';
import { productCreateSchema } from 'src/schema/ProductSchema';
import { productsService } from 'src/services/ProductsService';

dotenv.config();

export const createProduct: ValidatedEventAPIGatewayProxyEvent<
  Product
> = async (event) => {
  const product = event.body as Product;

  if (!productCreateSchema.safeParse(product).success) {
    return formatJSONResponse({
      response: { message: 'The product is invalid' },
      statusCode: StatusCode.BAD_REQUEST,
    });
  }

  try {
    await productsService.createProduct(product);

    return formatJSONResponse({
      statusCode: StatusCode.CREATED,
    });
  } catch {
    formatJSONResponse({
      response: {
        message: 'Could not create product',
      },
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    });
  }
};

export const createProductHandler = middyfy(createProduct);
