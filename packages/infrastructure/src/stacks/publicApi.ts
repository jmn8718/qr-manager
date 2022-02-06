import {Stack, StackProps} from 'aws-cdk-lib';
import {Cors, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {Construct} from 'constructs';

export class PublicApi extends Stack {
  public readonly api: {
    restApiId: string;
    rootResourceId: string;
  };

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new RestApi(this, 'publicApi', {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS
      },
      deployOptions: {
        tracingEnabled: true,
        metricsEnabled: true
      },
      deploy: true
    });

    this.api = {
      restApiId: api.restApiId,
      rootResourceId: api.restApiRootResourceId
    };
  }
}
