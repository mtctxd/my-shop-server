import DynamoDB from 'aws-sdk/clients/dynamodb'

export const dynamoDBService = new DynamoDB.DocumentClient();
