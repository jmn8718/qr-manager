import {Duration, Stack, StackProps} from 'aws-cdk-lib';
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {Table} from 'aws-cdk-lib/aws-dynamodb';
import {Architecture} from 'aws-cdk-lib/aws-lambda';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {RetentionDays} from 'aws-cdk-lib/aws-logs';
import {HttpMethod} from 'aws-cdk-lib/aws-stepfunctions-tasks';
import {Construct} from 'constructs';
import {resolve} from 'path';
import {packagesDir} from '../dirname';

interface IExtendedStackProps extends StackProps {
  readonly publicApi: {
    restApiId: string;
    rootResourceId: string;
  };
  readonly table: {
    name: string;
    streamArn?: string;
  };
}

export class Qr extends Stack {
  constructor(scope: Construct, id: string, props: IExtendedStackProps) {
    super(scope, id, props);

    const importedRest = RestApi.fromRestApiAttributes(this, 'importedRest', {
      restApiId: props.publicApi.restApiId,
      rootResourceId: props.publicApi.rootResourceId
    });

    const table = Table.fromTableAttributes(this, 'table', {
      tableName: props.table.name,
      tableStreamArn: props.table.streamArn
    });

    const qrHandler = new NodejsFunction(this, 'qrHandler', {
      memorySize: this.node.tryGetContext('LAMBDA_MEMORY_ALLOCATION'),
      timeout: Duration.seconds(6),
      logRetentionRetryOptions: {
        maxRetries: 10,
        base: Duration.millis(500)
      },
      logRetention: RetentionDays.INFINITE,
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        TABLE_NAME: table.tableName
      },
      entry: resolve(packagesDir, 'functions', 'src', 'getQr', 'handler.ts'),
      handler: 'default',
      architecture: Architecture.ARM_64,
      bundling: {
        minify: true,
        sourceMap: true,
        externalModules: ['aws-sdk']
      }
    });

    table.grantReadData(qrHandler);

    importedRest.root
      .resourceForPath('/{qrcode}')
      .addMethod(HttpMethod.GET, new LambdaIntegration(qrHandler));
  }
}
