import {Table, Entity} from 'dynamodb-toolbox';
import {DocumentClient} from 'aws-sdk/clients/dynamodb';
import {IQr, QrEntity} from '@qr/types';

export class Command {
  protected readonly _table: Table;
  protected readonly _entity: Entity<IQr>;
  public constructor(
    tableName: string,
    options?: {
      sortKey?: string;
      indexes?: Record<string, {partitionKey: string; sortKey?: string}>;
    }
  ) {
    this._table = new Table({
      name: tableName,
      partitionKey: 'pk',
      sortKey: options?.sortKey,
      indexes: options?.indexes,
      removeNullAttributes: true,
      autoExecute: true,
      autoParse: true,
      DocumentClient: new DocumentClient({})
    });

    this._entity = new Entity<IQr>({
      name: 'QR_RECORD',
      attributes: {
        pk: {
          type: 'string',
          partitionKey: true
        },
        targetUrl: {
          type: 'string',
          required: true
        }
      },
      timestamps: true,
      table: this._table
    });
  }

  public async getQr(pk: string): Promise<QrEntity | undefined> {
    const record = await this._entity.get({pk});
    return record?.Item;
  }

  public async createQr(payload: IQr): Promise<QrEntity> {
    return this._entity.put(payload, {
      conditions: {
        attr: 'pk',
        exists: false
      }
    });
  }
}
