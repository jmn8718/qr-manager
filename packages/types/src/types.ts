import type {APIGatewayProxyWithLambdaAuthorizerEvent} from 'aws-lambda';

export interface IError {
  code: string;
  message: string;
}

export interface INormalizedRestEvent<
  C extends {
    environments?: Record<string, string>;
  }
> extends Omit<APIGatewayProxyWithLambdaAuthorizerEvent<{}>, 'body'> {
  body: Record<string, unknown>;
  rawBody: string;

  context: C['environments'];
}

export interface INormalizedResponse<T = {success: boolean}> {
  statusCode: number;
  headers?: Record<string, string>;
  body: T | IError;
}
