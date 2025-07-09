#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { CodeArtifactStack } from '../lib/codeartifact-stack';
import { LambdaCronStack } from '../lib/lambda-cron-stack';
import { S3Stack } from '../lib/s3-stack';
import { MwaaStack } from '../lib/mwaa-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  region: process.env.AWS_REGION,
};

const vpc = new VpcStack(app, 'VpcStackTS', { env });
const codeArtifact = new CodeArtifactStack(app, 'CodeArtifactStackTS', { env });
const s3 = new S3Stack(app, 'S3StackTS', { env });
const lambdaCron = new LambdaCronStack(app, 'LambdaCronStackTS', {
  env,
  codeArtifactStack: codeArtifact,
  s3Stack: s3,
});
const mwaa = new MwaaStack(app, 'MwaaStackTS', {
  env,
  vpcStack: vpc,
  s3Stack: s3,
});

mwaa.addDependency(lambdaCron);
