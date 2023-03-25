import { ENV } from '@declarations/ENV';
import { PolicyPremisionEffect } from '@declarations/PolicyPremisionEffect';
import { generatePolicyDocument } from '@utils/generatePolicyDocument';
import { getTokenInfo } from '@utils/getTokenInfo';
import {
  APIGatewayAuthorizerResult,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayTokenAuthorizerHandler,
} from 'aws-lambda';
import dotenv from 'dotenv';

dotenv.config();

const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  const { methodArn, authorizationToken } = event;
  console.log('Parsing token', { authorizationToken });

  const { token, principalId } = getTokenInfo(authorizationToken);

  console.log('Parsed information: ', { principalId, token });

  const Effect =
    token === process.env[ENV.mtctxd]
      ? PolicyPremisionEffect.ALLOW
      : PolicyPremisionEffect.DENY;

  return generatePolicyDocument(Effect, methodArn, principalId);
};

export const basicAuthorizerHandler = basicAuthorizer;
