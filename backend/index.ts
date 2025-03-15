import express from 'express';
import multer from 'multer';
import { uploadImage } from './image-logic/uploadImage';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) : Promise<any> => {
    const userId = req.body.userId;

    if(!req.file?.path){
        return res.status(400).json({ success: false, error: "Invalid upload" });
    }
    const filePath = req.file.path;

    try {
        const imageUrl = await uploadImage(filePath, userId, );

        return res.json({ success: true, imageUrl });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});