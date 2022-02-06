#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {Qr as QrStack} from './stacks/qr';
import {QrDatabase as QrDatabaseStack} from './stacks/qrDatabase';
import {PublicApi as PubliApiStack} from './stacks/publicApi';

const app = new cdk.App();

const publicApi = new PubliApiStack(app, 'PubliApi');

const qrDatabase = new QrDatabaseStack(app, 'QrTable');

new QrStack(app, 'ServiceQr', {
  publicApi: publicApi.api,
  table: qrDatabase.table
});
