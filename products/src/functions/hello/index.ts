import { handlerPath } from '@libs/handler-resolver';

export const hello = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'hello',
        request: {
          // schemas: {
          //   'application/json': helpSchema,
          // },
        },
      },
    },
  ],
};
