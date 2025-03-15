import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage } from './image-logic/uploadImage';
import dotenv from 'dotenv';
import { checkDiscoverer } from './db-services/userService';
import fs from 'fs/promises';
import { createCard } from './db-services/cardService';
import { Rarity } from '@prisma/client';
import { getAnimalByLatinName } from './db-services/animalService';
import { CardPartial } from './db-services/cardService'
import { Decimal } from '@prisma/client/runtime/library';

const app = express();
const upload = multer({ dest: 'uploads/' });

interface AnimalDTO {
    result: {
        classification: {
            suggestions: [
                {
                    name: string
                }
            ]
        }
    }
}

const rarityMap: { [key: number]: Rarity } = {
    0: 'COMMON',
    1: 'UNCOMMON',
    2: 'RARE',
    3: 'EPIC',
    4: 'LEGENDARY',
    5: 'MYTHIC'
};

dotenv.config();

const config = {
    INSECT_API_HOST: process.env.INSECT_API_HOST,
    INSECT_API_KEY: process.env.INSECT_API_KEY
}

function getRarity(): number {
    const random = Math.random();
    let rarity = 0;

    if (random < 0.75) {
        rarity = 1;
    } else if (random < 0.85) {
        rarity = 2;
    } else if (random < 0.92) {
        rarity = 3;
    } else if (random < 0.97) {
        rarity = 4;
    } else {
        rarity = 5;
    }

    return rarity;
}

function getCardPartial(animalId: string, latitude: Decimal, longitude: Decimal, imageUrl: string, userId: string): CardPartial {

    const card: CardPartial = {
        latitude: latitude,
        longitude: longitude,
        pictureUrl: imageUrl,
        rarity: rarityMap[getRarity()],
        animalId: animalId,
        ownerId: userId,
        discovererId: userId
    }

    return card;
}

app.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
    const userId = req.body.userId;

    if (!req.file?.path) {
        return res.status(400).json({ success: false, error: "Invalid upload" });
    }

    const fileBuffer = await fs.readFile(req.file.path)
        .catch(error => {
            return res.status(500).json({ message: 'Error reading file', error: error });
        })

    const base64Image = fileBuffer.toString('base64');

    const requestBody = {
        images: [base64Image],
        similar_images: true
    };

    const response = await fetch(`${config.INSECT_API_HOST!}/api/v1/identification?details=url,description,image`, {
        method: 'POST',
        headers: {
            'Api-Key': config.INSECT_API_KEY!,
        },
        body: JSON.stringify(requestBody)
    }).catch(() => {
        return res.status(500).json({ success: false, error: "Internal server error" });
    });

    const data = await response.json() as AnimalDTO;
    const latinName = data.result.classification.suggestions[0].name;

    try {
        const animal = await getAnimalByLatinName(latinName);
        
        if (!animal)
            return res.status(500).json({ success: false, error: 'Animal not found' })
        
        
        if (await checkDiscoverer(userId, latinName))
            return res.status(500).json({ success: false, error: 'Card already discovered' });
        
        const imageUrl = await uploadImage(req.file.path, userId);

        const card = getCardPartial(animal.id, req.body.latitude, req.body.longitude, imageUrl, userId);
        
        const cardId = await createCard(card);
        
        if (!cardId) {
            return res.status(500).json({ success: false, error: "Card wasn't created successfuly" });
        }
        
        return res.json({ success: true, imageUrl });
    } catch (error) {
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});