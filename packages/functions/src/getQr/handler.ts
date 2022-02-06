import {INormalizedRestEvent, INormalizedResponse, QrEntity} from '@qr/types';
import {middifyHandler} from '@qr/libs';
import controller from './controller';

const context = {
  environments: {
    tableName: 'TABLE_NAME'
  }
};

interface ISchema {
  pathParameters: {
    qrcode: string;
  };
}

type Event = INormalizedRestEvent<typeof context> & ISchema;
const handler = async (
  event: Event
): Promise<INormalizedResponse<QrEntity>> => {
  const {statusCode, body} = await controller({
    qrcode: event.pathParameters.qrcode,
    context: event.context
  });

  return {
    statusCode: statusCode === 200 ? 302 : 404,
    ...(statusCode === 200
      ? {
          headers: {
            Location: (body as QrEntity).targetUrl
          }
        }
      : {}),
    body
  };
};

export default middifyHandler(handler, context);
