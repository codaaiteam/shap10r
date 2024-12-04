// scripts/upload-to-r2.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  }
});

const getMimeType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'json': 'application/json'
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
};

async function uploadDirectory(dir: string, bucketPrefix: string = ''): Promise<void> {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = join(dir, file.name);
    
    if (file.isDirectory()) {
      await uploadDirectory(fullPath, join(bucketPrefix, file.name));
      continue;
    }

    const contentType = getMimeType(file.name);
    const key = bucketPrefix ? join(bucketPrefix, file.name) : file.name;

    try {
      const fileContent = readFileSync(fullPath);
      await R2.send(new PutObjectCommand({
        Bucket: 'game-assets',
        Key: key,
        Body: fileContent,
        ContentType: contentType
      }));
      console.log(`✓ Uploaded: ${key}`);
    } catch (error) {
      console.error(`✗ Error uploading ${key}:`, error);
    }
  }
}

async function uploadFiles(): Promise<void> {
  try {
    if (!process.env.CF_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
      throw new Error('Required environment variables are missing');
    }

    console.log('\n📄 Uploading games.json...');
    const gamesJson = readFileSync('src/data/games.json');
    await R2.send(new PutObjectCommand({
      Bucket: 'game-assets',
      Key: 'data/games.json',
      Body: gamesJson,
      ContentType: 'application/json'
    }));

    console.log('\n🌍 Uploading locale files...');
    const localeFiles = readdirSync('src/locales');
    for (const file of localeFiles) {
      if (file.endsWith('.json')) {
        const content = readFileSync(`src/locales/${file}`);
        await R2.send(new PutObjectCommand({
          Bucket: 'game-assets',
          Key: `locales/${file}`,
          Body: content,
          ContentType: 'application/json'
        }));
        console.log(`✓ Uploaded: locales/${file}`);
      }
    }

    console.log('\n✨ Upload completed successfully!');
  } catch (error) {
    console.error('\n❌ Upload failed:', error);
    process.exit(1);
  }
}

uploadFiles();