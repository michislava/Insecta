import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import "dotenv/config"

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadImage = async (filePath: string, userId: string): Promise<string> => {
    const fileContent = fs.readFileSync(filePath);
    const fileName = `images/${userId}/${Date.now()}-${uuidv4()}.jpg`;

    const params = {
        Bucket: 'insectopia-image-bucket',
        Key: fileName,
        Body: fileContent,
        ContentType: 'image/jpeg',
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


