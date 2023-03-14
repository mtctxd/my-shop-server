import { handlerPath } from '@libs/handler-resolver';
import dotenv from 'dotenv';

dotenv.config();

export default {
  importProductsFile: {
    handler: `${handlerPath(
      __dirname
    )}/importProductsFile.importProductsFileHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'import',
          cors: true,
          request: {
            parameters: {
              querystrings: {
                name: true,
              },
            },
          },
        },
      },
    ],
  },
  importFileParser: {
    handler: `${handlerPath(
      __dirname
    )}/importFileParser.importFileParserHandler`,
    events: [
      {
        s3: {
          bucket: 'my-shop-server-imports',
          event: 's3:ObjectCreated:*',
          existing: true,
          rules: [
            {
              prefix: 'uploaded/',
              suffix: '.csv',
            },
          ],
        },
      },
    ],
  },
};
