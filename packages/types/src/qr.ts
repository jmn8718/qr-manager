export interface IQr {
  pk: string;
  targetUrl: string;
}

export interface IEntity {
  pk: string;
  _et: string;
  _md: string;
  _ct: string;
}

export type QrEntity = IEntity & IQr;
