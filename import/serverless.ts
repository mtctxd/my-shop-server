import type { AWS } from '@serverless/typescript';
import dotenv from 'dotenv';

import * as functions from './src/functions';
import { ENV } from '@declarations/env';

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
  }
};

module.exports = serverlessConfiguration;
