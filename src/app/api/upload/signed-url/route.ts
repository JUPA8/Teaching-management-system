import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, S3_BUCKET_NAME } from '@/lib/s3';
import { requireAuth } from '@/lib/auth-helpers';

const uploadRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1),
  fileSize: z.number().positive().max(10 * 1024 * 1024), // Max 10MB
  folder: z.enum(['courses', 'users', 'documents']).default('documents'),
});

// POST /api/upload/signed-url - Generate pre-signed URL for S3 upload
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    const body = await request.json();
    const validation = uploadRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { fileName, fileType, fileSize, folder } = validation.data;

    // Validate file type (only allow images and PDFs for now)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
    ];

    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Generate unique file name
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${user.id}/${timestamp}-${sanitizedFileName}`;

    // Generate pre-signed URL for upload
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
      Metadata: {
        userId: user.id,
        uploadedAt: new Date().toISOString(),
      },
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    // Construct the public URL (after upload completes)
    const publicUrl = `https://${S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      data: {
        signedUrl,
        publicUrl,
        key,
        expiresIn: 3600,
      },
      message: 'Pre-signed URL generated successfully',
    });
  } catch (error: any) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate upload URL' },
      { status: error.message?.includes('Unauthorized') ? 403 : 500 }
    );
  }
}
