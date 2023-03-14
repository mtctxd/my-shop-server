import type { AWS } from '@serverless/typescript';
import dotenv from 'dotenv';

import * as functions from './src/functions';
import { ENV } from '@declarations/env';

dotenv.config();

if (
  !process.env[ENV.TABLE_PRODUCTS] ||
  !process.env[ENV.TABLE_STOCKS] ||
  !process.env[ENV.CATALOG_ITEMS_QUEUE]
) {
  throw new Error('Some ENV variables is not provided');
}

const serverlessConfiguration: AWS = {
  service: 'products',
  frameworkVersion: '3',
  plugins: ['serverless-webpack', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'admin',
    region: 'us-east-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TABLE_PRODUCTS: process.env[ENV.TABLE_PRODUCTS],
      TABLE_STOCKS: process.env[ENV.TABLE_STOCKS],
      CATALOG_ITEMS_QUEUE: process.env[ENV.CATALOG_ITEMS_QUEUE],
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Scan',
          'dynamodb:Query',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchWrite',
        ],
        Resource:
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_PRODUCTS}',
      },
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:Scan',
          'dynamodb:Query',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchWrite',
        ],
        Resource:
          'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TABLE_STOCKS}',
      },
      {
        Effect: 'Allow',
        Action: ['SQS:ReceiveMessage'],
        Resource: [{ 'Fn::GetAtt': ['CatalogItamQueue', 'Arn'] }],
      },
    ],
  },
  // import the functions via paths
  functions,
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    ['serverless-offline']: {
      useChildProcesses: true,
    },
  },
  resources: {
    Resources: {
      CatalogItamQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: process.env[ENV.CATALOG_ITEMS_QUEUE],
        },
      },
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: process.env[ENV.TABLE_PRODUCTS],
        },
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: 'product_id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'product_id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
          TableName: process.env[ENV.TABLE_STOCKS],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
