import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { VpcStack } from '../lib/vpc-stack';
import { CodeArtifactStack } from '../lib/codeartifact-stack';
import { S3Stack } from '../lib/s3-stack';

// Mock environment variables for testing
process.env.AWS_REGION = 'us-east-1';
process.env.BUCKET_NAME = 'test-bucket-name';
process.env.AIRFLOW_VERSION = '2.10.3';

describe('MWAA with CodeArtifact Stacks', () => {
  let app: cdk.App;
  let env: cdk.Environment;

  beforeEach(() => {
    app = new cdk.App();
    env = { region: 'us-east-1' };
  });

  test('VPC Stack creates VPC with correct configuration', () => {
    const stack = new VpcStack(app, 'TestVpcStack', { env });
    const template = Template.fromStack(stack);

    // Check VPC is created
    template.hasResourceProperties('AWS::EC2::VPC', {
      CidrBlock: '10.0.0.0/16',
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
    });

    // Check security group is created
    template.hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'MWAA SG',
    });

    // Check VPC endpoints are created
    template.resourceCountIs('AWS::EC2::VPCEndpoint', 9); // 8 interface + 1 gateway
  });

  test('CodeArtifact Stack creates domain and repository', () => {
    const stack = new CodeArtifactStack(app, 'TestCodeArtifactStack', { env });
    const template = Template.fromStack(stack);

    // Check CodeArtifact domain is created
    template.hasResourceProperties('AWS::CodeArtifact::Domain', {
      DomainName: 'mwaa',
    });

    // Check CodeArtifact repository is created
    template.hasResourceProperties('AWS::CodeArtifact::Repository', {
      RepositoryName: 'mwaa_repo',
      ExternalConnections: ['public:pypi'],
    });
  });

  test('S3 Stack creates bucket with correct configuration', () => {
    const stack = new S3Stack(app, 'TestS3Stack', { env });
    const template = Template.fromStack(stack);

    // Check S3 bucket is created
    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'test-bucket-name',
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
      VersioningConfiguration: {
        Status: 'Enabled',
      },
    });

    // Check bucket deployment is created
    template.resourceCountIs('Custom::CDKBucketDeployment', 1);
  });
});
