
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import "dotenv/config"
import { dataUriToBuffer } from 'data-uri-to-buffer'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadImage = async (base64Image: string, userId: string): Promise<string> => {
    const {buffer, type} = dataUriToBuffer(base64Image);
    const s3Buffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    const fileName = `images/${userId}/${Date.now()}-${uuidv4()}.jpg`;

    const params = {
        Bucket: 'insectopia-image-bucket',
        Key: fileName,
        Body: s3Buffer,
        ContentType: type
    };

    try {
        const result = await s3.upload(params).promise();
        console.log('Upload successful:', result.Location);
        return result.Location; // Return the S3 object URL
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
};


