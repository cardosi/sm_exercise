import * as cdk from 'aws-cdk-lib';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import path = require('path');
import { Bucket } from 'aws-cdk-lib/aws-s3';


const DOMAIN_NAME = "camcardosi.com";
const WWW_DOMAIN_NAME = `www.${DOMAIN_NAME}`;
const S3_BUCKET_ARN = 'arn:aws:s3:::static-site-infrastack'
const HOSTED_ZONE_ID = 'Z07740291T60M7JJQ1LBF'
const HTTPS_CERT_ARN = 'arn:aws:acm:us-east-1:524959358776:certificate/03cfaf26-c45f-4c22-bea0-b7eac2a39b35'

export class ClientInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const staticWebsiteBucket = Bucket.fromBucketAttributes(this, `bucket-${id}`, {
      bucketArn: S3_BUCKET_ARN,
    });

    const hostedZone = route53.HostedZone.fromLookup(
      this, HOSTED_ZONE_ID, { domainName: DOMAIN_NAME }
    );

    const httpsCertificate = acm.Certificate.fromCertificateArn(this, `cert-${id}`, HTTPS_CERT_ARN)

    const oac = new cloudfront.CfnOriginAccessControl(this, `oac-${id}`, {
      originAccessControlConfig: {
          name: `StaticWebOriginAccessControl`,
          originAccessControlOriginType: 's3',
          signingBehavior: 'always',
          signingProtocol: 'sigv4',
      },
    });

    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(this, `dist-${id}`, {
      defaultRootObject: 'index.html',
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(httpsCertificate, {
          aliases: [DOMAIN_NAME, WWW_DOMAIN_NAME]
      }),
      originConfigs: [{
          s3OriginSource: {
              s3BucketSource: staticWebsiteBucket
          },
          behaviors: [{
              isDefaultBehavior: true,
              viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          }]
      }],
      errorConfigurations: [{
          errorCode: 403,
          responsePagePath: '/index.html',
          responseCode: 200,
          errorCachingMinTtl: 60
      }]
    });

    const cfnDistribution = cloudFrontDistribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addPropertyOverride('DistributionConfig.Origins.0.OriginAccessControlId', oac.getAtt('Id'));
    
    staticWebsiteBucket.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
          effect: cdk.aws_iam.Effect.ALLOW,
          principals: [new cdk.aws_iam.ServicePrincipal('*')],
          actions: ['s3:GetObject'], 
          resources: [`${staticWebsiteBucket.bucketArn}/*`],
      })
    );

    new route53.ARecord(this, `aRecord-${id}`, {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
      recordName: DOMAIN_NAME
    });

    new route53.ARecord(this, `aRecordwww-${id}`, {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
      recordName: WWW_DOMAIN_NAME
    });

    new s3deploy.BucketDeployment(this, `bucketDeploy-${id}`, {
      sources: [s3deploy.Source.asset(path.join(__dirname, '..', '..', 'client', 'dist'))], 
      destinationBucket: staticWebsiteBucket,
      distributionPaths: ['/*'], 
      distribution: cloudFrontDistribution
    });

  }
}
