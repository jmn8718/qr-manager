import {INormalizedResponse, QrEntity} from '@qr/types';
import {Command} from '@qr/libs';

interface IParams {
  qrcode: string;
  context: {
    tableName: string;
  };
}

const controller = async (
  params: IParams
): Promise<INormalizedResponse<QrEntity>> => {
  const command = new Command(params.context.tableName);

  const record = await command.getQr(params.qrcode);
  return {
    statusCode: record ? 200 : 404,
    body: record ?? {
      code: 'not_found',
      message: 'resource not found'
    }
  };
};

export default controller;
