// src/app/services/aws-s3.service.ts
import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsConfig } from '../aws-config';

@Injectable({
  providedIn: 'root',
})
export class AwsS3Service {
  private s3: S3Client;

  constructor() {
    this.s3 = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async uploadJsonFile(key: string, data: any): Promise<void> {
    const jsonString = JSON.stringify(data, null, 2);
    const command = new PutObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
      Body: jsonString,
      ContentType: 'application/json',
      ACL: 'public-read',
    });

    await this.s3.send(command);
  }

  async getJsonFile(key: string): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
    });

    const response = await this.s3.send(command);
    const body = response.Body as ReadableStream<Uint8Array>;
    const reader = body.getReader();
    const chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      if (value) {
        chunks.push(value);
      }
      done = doneReading;
    }

    const decoder = new TextDecoder('utf-8');
    const content = decoder.decode(Uint8Array.from(chunks.reduce((acc, chunk) => {
      const newAcc = new Uint8Array(acc.length + chunk.length);
      newAcc.set(acc);
      newAcc.set(chunk, acc.length);
      return newAcc;
    }, new Uint8Array())));
    return JSON.parse(content);
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: awsConfig.bucketName,
        Key: key,
      });
      await this.s3.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NoSuchKey') {
        return false;
      }
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: key,
    });
    await this.s3.send(command);
  }
}
