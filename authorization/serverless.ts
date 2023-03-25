import { ENV } from '@declarations/ENV';
import type { AWS } from '@serverless/typescript';

import functions from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'authorization',
  frameworkVersion: '3',
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-dotenv-plugin',
  ],
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
    iamRoleStatements: [],
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
    dotenv: {
      exclude: [ENV.AWS_ACCESS_KEY_ID, ENV.AWS_SECRET_ACCESS_KEY],
    },
  },
};

module.exports = serverlessConfiguration;
