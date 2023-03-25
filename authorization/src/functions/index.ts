import { handlerPath } from '@libs/handler-resolver';
import dotenv from 'dotenv';

dotenv.config();

export default {
  basicAuthorizer: {
    handler: `${handlerPath(__dirname)}/basicAuthorizer.basicAuthorizerHandler`,
  },
};
