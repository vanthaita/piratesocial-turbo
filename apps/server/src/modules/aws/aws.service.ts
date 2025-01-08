import { Injectable, Logger } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import { NodeHttpHandler } from '@aws-sdk/node-http-handler';
import * as https from 'https';

const MAX_PARALLEL_UPLOADS = 10;
const S3_UPLOAD_RETRY_ATTEMPTS = 3;
const S3_UPLOAD_RETRY_DELAY_MS = 1000;

@Injectable()
export class AwsS3Service {
    private readonly logger = new Logger(AwsS3Service.name);
    private readonly bucketName = process.env.AWS_S3_BUCKET_NAME;
    private readonly s3Client: S3Client;
    private readonly allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_S3_REGION,
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            },
            requestHandler: new NodeHttpHandler({
                httpAgent: new https.Agent({
                    keepAlive: true,
                    maxSockets: 100,
                    timeout: 30000,
                }),
            }),
        });
    }
    private async uploadWithRetry(params): Promise<string> {
      let attempts = 0;
      while (attempts < S3_UPLOAD_RETRY_ATTEMPTS) {
          try {
              const upload = new Upload({
                client: this.s3Client,
                  params,
              });
              await upload.done();
              return `https://${this.bucketName}.s3.amazonaws.com/${params.Key}`;
          } catch (error) {
              attempts++;
              this.logger.warn(
                  `Upload failed, retrying attempt ${attempts} ` + `Error: ${error.message}`,
              );
              if (attempts === S3_UPLOAD_RETRY_ATTEMPTS) {
                this.logger.error(`Upload failed after all retry attempts:`, error);
                throw error;
              }
              await new Promise(resolve => setTimeout(resolve, S3_UPLOAD_RETRY_DELAY_MS));
          }
      }
      throw new Error("Upload failed after all retries.");
  }


    async uploadImage(imageBuffer: Buffer, mimeType: string): Promise<string> {
      if (!this.allowedMimeTypes.includes(mimeType)) {
          this.logger.error(`Invalid mime type: ${mimeType}`);
          throw new Error(`Invalid mime type: ${mimeType}`);
      }
        const key = `uploads/${uuidv4()}`;
        const params = {
          Bucket: this.bucketName,
          Key: key,
          Body: imageBuffer,
          ContentType: mimeType,
          ACL: 'public-read',
        };
        try{
          return await this.uploadWithRetry(params);
        }
        catch (error) {
            this.logger.error(`Error uploading image: ${error.message}`);
            throw error;
        }
    }

    async uploadMultipleImages(
        files: { buffer: Buffer; mimeType: string }[]
    ): Promise<string[]> {
        if (files.length === 0) {
            return [];
        }
        const uploadPromises = files.map(async (file) => {
          if (!this.allowedMimeTypes.includes(file.mimeType)) {
              this.logger.error(`Invalid mime type: ${file.mimeType}`);
              throw new Error(`Invalid mime type: ${file.mimeType}`);
          }
            const key = `uploads/${uuidv4()}`;
            const params = {
                Bucket: this.bucketName,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimeType,
                ACL: 'public-read',
            };
            try {
              return await this.uploadWithRetry(params);
            } catch (error) {
                this.logger.error(`Error uploading image: ${error.message}`);
                throw error
            }
        });

        const results: string[] = [];
        for (let i = 0; i < uploadPromises.length; i += MAX_PARALLEL_UPLOADS) {
            const batch = uploadPromises.slice(i, i + MAX_PARALLEL_UPLOADS);
            const uploadedUrls = await Promise.all(batch);
            results.push(...uploadedUrls);
        }
        return results;
    }
}