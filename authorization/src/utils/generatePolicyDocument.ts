import { PolicyPremisionEffect } from "@declarations/PolicyPremisionEffect";
import { APIGatewayAuthorizerResult } from "aws-lambda";

export const generatePolicyDocument = (
  Effect: PolicyPremisionEffect,
  Resource: any,
  principalId: any
): APIGatewayAuthorizerResult => {
  return {
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect,
          Action: ['execute-api:Invoke'],
          Resource,
        },
      ],
    },
    principalId,
  };
};