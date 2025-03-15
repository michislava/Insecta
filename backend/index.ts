import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage } from './image-logic/uploadImage';
import dotenv from 'dotenv';
import { checkDiscoverer } from './db-services/userService';

const app = express();
const upload = multer({ dest: 'uploads/' });

dotenv.config();

const config = {
    INSECT_API_HOST: process.env.INSECT_API_HOST,
    INSECT_API_KEY: process.env.INSECT_API_KEY
}

app.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
    const userId = req.body.userId;
    
    if (!req.file?.path) {
        return res.status(400).json({ success: false, error: "Invalid upload" });
    }
    const filePath = req.file.path;
    
    const formData = new FormData();
    formData.append('image', req.file.path);

    const response = await fetch(config.INSECT_API_HOST!, {
        method: 'POST',
        headers: {
            'Api-Key': config.INSECT_API_KEY!,
        },
        body: formData
    }).catch(() => {
        return res.status(500).json({ success: false, error: "Internal server error" });
    });
    
    try {
        const imageUrl = await uploadImage(filePath, userId,);

        return res.json({ success: true, imageUrl });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});