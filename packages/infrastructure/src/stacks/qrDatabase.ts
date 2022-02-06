import {Stack, StackProps} from 'aws-cdk-lib';
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table
} from 'aws-cdk-lib/aws-dynamodb';
import {Construct} from 'constructs';

export class QrDatabase extends Stack {
  public readonly table: {
    name: string;
    streamArn?: string;
  };
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'qrTable', {
      partitionKey: {name: 'pk', type: AttributeType.STRING},
      billingMode: BillingMode.PAY_PER_REQUEST,
      stream: StreamViewType.NEW_AND_OLD_IMAGES
    });

    this.table = {
      name: table.tableName,
      streamArn: table.tableStreamArn
    };
  }
}
