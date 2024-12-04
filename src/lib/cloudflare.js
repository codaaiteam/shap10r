// lib/cloudflare.js
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const R2 = new S3Client({
 region: 'auto',
 endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
 credentials: {
   accessKeyId: process.env.R2_ACCESS_KEY_ID,
   secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
 },
});

export async function getGamesData() {
 try {
   const response = await R2.send(new GetObjectCommand({
     Bucket: 'game-assets',
     Key: 'data/games.json'
   }));
   const data = await response.Body?.transformToString();
   return JSON.parse(data);
 } catch {
   return import('@/data/games.json');
 }
}

export async function getTranslation(locale) {
 try {
   const response = await R2.send(new GetObjectCommand({
     Bucket: 'game-assets', 
     Key: `locales/${locale}.json`
   }));
   const data = await response.Body?.transformToString();
   return JSON.parse(data);
 } catch {
   return import(`@/locales/${locale}.json`);
 }
}