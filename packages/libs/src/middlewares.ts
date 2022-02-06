import middy from '@middy/core';
import type {MiddlewareObj, MiddyfiedHandler} from '@middy/core';
import type {Handler} from 'aws-lambda';
import env from 'env-var';

import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import httpEventNormalizer from '@middy/http-event-normalizer';
import cors from '@middy/http-cors';
import inputOutputLogger from '@middy/input-output-logger';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import httpResponseSerializer from '@middy/http-response-serializer';

const eventContextualizer: (environment?: Record<string, string>) => {
  before(request: middy.Request): void;
} = (environment?: Record<string, string>) => ({
  before(request: middy.Request) {
    let context;
    if (environment)
      context = Object.entries(environment).reduce((acc, curr) => {
        const [key, value] = curr;
        return {...acc, [key]: env.get(value).asString()};
      }, {} as Record<string, unknown>);
    request.event.context = {...request.context, ...context};
    return;
  }
});

export const middifyHandler = <TEvent = any, TResult = any>(
  handler: Handler<TEvent, TResult>,
  options: {
    optionalMiddlewares?: MiddlewareObj[];
    environments?: Record<string, string>;
  }
): MiddyfiedHandler => {
  const middlewares = [
    httpHeaderNormalizer(),
    httpEventNormalizer(),
    httpSecurityHeaders(),
    cors(),
    inputOutputLogger({logger: console.info}),
    eventContextualizer(options.environments),
    ...(options.optionalMiddlewares ?? []),
    doNotWaitForEmptyEventLoop(),
    httpErrorHandler({logger: console.error}),
    httpResponseSerializer({
      serializers: [
        {
          regex: /^application\/json$/,
          serializer: ({body}) => JSON.stringify(body)
        }
      ],
      default: 'application/json'
    })
  ];
  return middy(handler).use(middlewares);
};
