import { Product } from '@declarations/Product';
import { StatusCode } from '@declarations/StatusCode';
import { formatJSONResponse } from '@libs/api-gateway';
import { midifyEvent } from '@libs/lambda';
import { SQSEvent } from 'aws-lambda';
import { productCSVSchema } from 'src/schema/ProductSchema';
import { productsService } from 'src/services/ProductsService';

export const catalogBatchProcess = async (event: SQSEvent) => {
  const { Records } = event;

  const products: Product[] = Records.map((record) => {
    const parsedRecord = JSON.parse(record.body.replace(/^\uFEFF/, ''));
    console.log(`record was parsed\n${JSON.stringify(parsedRecord)}`);
    return parsedRecord;
  })
    .flat()
    .filter((product) => {
      const { success } = productCSVSchema.safeParse(product);

      if (!success) {
        console.log(`product is not valid\n${JSON.stringify(product)}`);
      }

      return success;
    });

  try {
    await Promise.all(
      products.map(async (product) => {
        const createdProduct = await productsService.createProduct(product);

        console.log(
          `Product was added to database\n${JSON.stringify(createdProduct)}`
        );
      })
    );

    return formatJSONResponse({
      statusCode: StatusCode.OK,
      response: Records,
    });
  } catch (e) {
    return formatJSONResponse({
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      response: {
        message: e,
        event,
        products,
      },
    });
  }
};

export const catalogBatchProcessHandler = midifyEvent(catalogBatchProcess);
