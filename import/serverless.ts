import type { AWS } from '@serverless/typescript';
import dotenv from 'dotenv';

import functions from './src/functions';

dotenv.config();

const serverlessConfiguration: AWS = {
  service: 'import',
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
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [
          'arn:aws:s3:::my-shop-server-imports/',
          'arn:aws:s3:::my-shop-server-imports/*',
        ],
        Condition: {
          StringEquals: {
            'aws:SourceOrigin': '*',
          },
        },
      },
      {
        Effect: 'Allow',
        Action: ['sqs:SendMessage', 'sqs:GetQueueUrl'],
        Resource: {
          'Fn::Sub':
            'arn:aws:sqs:${AWS::Region}:${AWS::AccountId}:CATALOG_ITEMS_QUEUE',
        },
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
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: { Ref: 'ApiGatewayRestApi' },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
