import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3Service {
  private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
    const key = `uploads/${uuidv4()}`;
    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.bucketName,
        Key: key,
        Body: imageBuffer,
        ContentType: mimeType,
        ACL: 'public-read',
      },
    });

    await upload.done();

    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  async uploadMultipleImages(
    files: { buffer: Buffer; mimeType: string }[]
  ): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const key = `uploads/${uuidv4()}`;
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimeType,
          ACL: 'public-read',
        },
      });

      await upload.done();

      return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
    });

    return Promise.all(uploadPromises);
  }
}
