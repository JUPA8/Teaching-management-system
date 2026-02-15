import { S3Client } from '@aws-sdk/client-s3';

// Initialize S3 client only if credentials are available
const awsRegion = process.env.AWS_REGION || 'us-east-1';
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

export const s3Client = awsAccessKeyId && awsSecretAccessKey
  ? new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    })
  : null;

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';

// Helper to check if S3 is configured
export const isS3Configured = () => !!s3Client && !!S3_BUCKET_NAME;
