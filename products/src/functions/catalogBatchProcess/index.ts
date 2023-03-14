import { handlerPath } from '@libs/handler-resolver';

export const catalogBatchProcess = {
  handler: `${handlerPath(
    __dirname
  )}/catalogBatchProcess.catalogBatchProcessHandler`,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['CatalogItamQueue', 'Arn'] },
        batchSize: 5,
      },
    },
  ],
};
