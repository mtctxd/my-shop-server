import {
  DocumentClient,
  ScanInput,
  GetItemInput,
  Key,
} from 'aws-sdk/clients/dynamodb';
import { dynamoDBService } from './DynamoDBService';
import dotenv from 'dotenv';
import { DBProduct, DBStocks, Product } from '@declarations/Product';
import { ENV } from '@declarations/env';
import { omit } from 'lodash';

dotenv.config();

export class ProductsService {
  productsTableName = 'PRODUCTS';
  stocksTableName = 'STOCKS';

  static createPutRequestItems<T>(items: T[]): { PutRequest: { Item: T } }[] {
    return items.map((item) => ({
      PutRequest: {
        Item: item,
      },
    }));
  }

  constructor(private dynamoDBService: DocumentClient) {}

  async getProducts(): Promise<Product[]> {
    const dbProductsScanParams: ScanInput = {
      TableName: this.productsTableName,
    };
    const dbStocksScanParams: ScanInput = {
      TableName: this.stocksTableName,
    };

    const [dbProducts, dbStocks] = await Promise.all([
      this.dynamoDBService
        .scan(dbProductsScanParams)
        .promise()
        .then(({ Items }) => Items as DBProduct[]),
      this.dynamoDBService
        .scan(dbStocksScanParams)
        .promise()
        .then(({ Items }) => Items as DBStocks[]),
    ]);

    const products = [dbProducts, dbStocks].flat().reduce((acc, ite) => {
      const currentId = ite['product_id'] || ite['id'];

      acc[currentId] = {
        ...acc[currentId],
        ...omit(ite, 'product_id'),
      };

      return acc;
    }, {});

    return Object.values(products);
  }

  async getProductById(id: string): Promise<Product> {
    const dbProductGetParams: GetItemInput = {
      TableName: this.productsTableName,
      Key: {
        id,
      } as Key,
    };
    const dbStockGetParams: GetItemInput = {
      TableName: this.stocksTableName,
      Key: {
        product_id: id,
      } as Key,
    };

    try {
      const [dbProduct, dbStock] = await this.dynamoDBService
        .transactGet({
          TransactItems: [
            {
              Get: dbProductGetParams,
            },
            {
              Get: dbStockGetParams,
            },
          ],
        })
        .promise()
        .then(({ Responses }) =>
          Responses.map(
            ({ Item }) => Item as Omit<DBProduct & DBStocks, 'product_id'>
          )
        );

      return {
        ...dbProduct,
        ...omit(dbStock, 'product_id'),
      };
    } catch {
      throw new Error('Transaction failed');
    }
  }

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const createdProduct: Product = {
      ...product,
      id: Math.random().toString(16),
    };
    const dbProduct: DBProduct = omit(createdProduct, 'count');

    const dbStock: DBStocks = {
      product_id: createdProduct.id,
      count: product.count || 0,
    };

    const productParams = {
      TableName: this.productsTableName,
      Item: dbProduct,
    };

    const stockParams = {
      TableName: this.stocksTableName,
      Item: dbStock,
    };

    try {
      await this.dynamoDBService
        .transactWrite({
          TransactItems: [
            {
              Put: productParams,
            },
            {
              Put: stockParams,
            },
          ],
        })
        .promise();

      return createdProduct;
    } catch {
      throw new Error('Transaction failed');
    }
  }
}

export const productsService = new ProductsService(dynamoDBService);
