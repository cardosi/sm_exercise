import * as cdk from 'aws-cdk-lib';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
import path = require('path');
import { Bucket } from 'aws-cdk-lib/aws-s3';


const S3_BUCKET_ARN = 'arn:aws:s3:::static-site-infrastack'
const CLOUDFRONT_DISTRIBUTION_ID = 'E1CECJH27W94KB'
const CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME = 'dm1z6ybvy9u0p.cloudfront.net'

export class ClientInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticWebsiteBucket = Bucket.fromBucketAttributes(this, `bucket-${id}`, {
      bucketArn: S3_BUCKET_ARN,
    });

    const cloudFrontDistribution = cloudfront.Distribution.fromDistributionAttributes(this, `dist-${id}`, {
      domainName: CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME,
      distributionId: CLOUDFRONT_DISTRIBUTION_ID,
    });
    
    staticWebsiteBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
          effect: cdk.aws_iam.Effect.ALLOW,
          principals: [new cdk.aws_iam.ServicePrincipal('*')],
          actions: ['s3:GetObject'], 
          resources: [`${staticWebsiteBucket.bucketArn}/*`],
      })
    );

    new s3deploy.BucketDeployment(this, `bucketDeploy-${id}`, {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', '..', 'client', 'dist'))], 
      destinationBucket: staticWebsiteBucket,
      distribution: cloudFrontDistribution
    });
  }
}
