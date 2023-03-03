import type { AWS } from '@serverless/typescript';

import * as functions from './src/functions';

const fs = require('fs');

function getDeclarationFiles(): string[] {
  const declarationDir = './src/declarations';
  const declarationFiles: string[] = [];

  const files = fs.readdirSync(declarationDir);

  for (const file of files) {
    if (file.endsWith('.d.ts')) {
      declarationFiles.push(`${declarationDir}/${file}`);
    }
  }

  return declarationFiles;
}

const serverlessConfiguration: AWS = {
  service: 'products',
  frameworkVersion: '3',
  plugins: [
    'serverless-auto-swagger',
    'serverless-webpack',
    'serverless-offline',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    profile: 'admin',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
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
    autoswagger: {
      title: 'Products service',
      basePath: '/dev',
      apiType: 'httpApi',
      generateSwaggerOnDeploy: true,
      typefiles: [...getDeclarationFiles()]
    }
  },
};

module.exports = serverlessConfiguration;
