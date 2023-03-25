import dotenv from 'dotenv';
import { Product } from '@declarations/Product';
import { StatusCode } from '@declarations/StatusCode';
import { formatJSONResponse } from '@libs/api-gateway';
import { midifyEvent } from '@libs/lambda';
import { SQSEvent } from 'aws-lambda';
import { productCSVSchema } from 'src/schema/ProductSchema';
import { productsService } from 'src/services/ProductsService';
import { CreatedProductsNotificationSender } from 'src/services/CreatedProductsNotificationSender';
import { ENV } from '@declarations/ENV';

dotenv.config();

export const catalogBatchProcess = async (event: SQSEvent) => {
  const { Records } = event;

  const products: Product[] = Records.map((record) => {
    const parsedRecord = JSON.parse(record.body.replace(/^\uFEFF/, ''));
    return parsedRecord;
  })
    .flat()
    .filter((product) => productCSVSchema.safeParse(product));

  try {
    const { createdProducts } = await productsService.bulkCreateProducts(
      products
    );

    if (createdProducts.length) {
      const createdProductsNotificationSender =
        new CreatedProductsNotificationSender(
          `arn:aws:sns:us-east-1:530876135829:createProductTopic`
        );
      await createdProductsNotificationSender.send(createdProducts);
    }

    return formatJSONResponse({
      statusCode: StatusCode.OK,
      response: Records,
    });
  } catch (e) {
    return formatJSONResponse({
      statusCode: StatusCode.INTERNAL_SERVER_ERROR,
      response: e,
    });
  }
};

export const catalogBatchProcessHandler = midifyEvent(catalogBatchProcess);
