#!/usr/bin/env node
import 'source-map-support/register';
import { ClientInfraStack } from '../lib/client-infra-stack';
import { APIInfraStack } from '../lib/api-infra-stack';
import { App } from 'aws-cdk-lib';

const ENV = { 
  account: process.env.CDK_DEFAULT_ACCOUNT, 
  region: process.env.CDK_DEFAULT_REGION
}

const app = new App();
new ClientInfraStack(app, 'ClientInfraStack', {
  env: ENV
});

new APIInfraStack(app, 'APIInfraStack', {
  env: ENV
})