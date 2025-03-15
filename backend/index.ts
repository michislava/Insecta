import express, { Request, Response } from 'express';
import multer from 'multer';
import { uploadImage } from './image-logic/uploadImage';
import dotenv from 'dotenv';
import { checkDiscoverer } from './db-services/userService';
import { createCard, getAllCardsForUser } from './db-services/cardService';
import fs from 'fs/promises';
import { Rarity } from '@prisma/client';
import { getAnimalByLatinName } from './db-services/animalService';
import { CardPartial } from './db-services/cardService'
import { Decimal } from '@prisma/client/runtime/library';
import axios from 'axios';

dotenv.config();
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
const HARDCODED_USERS = [
    { userId:'123123123', name:'Alice', },
    { userId:'241', name:'Bob', },
    { userId:'12415', name:'Carl', },
    { userId:'9871287', name:'Dave', },

]
const HARDCODED_ANIMALS = {
    bee: {
        id:'bee',
        name: 'Bee specialicus', 
        description: "Very bzzzz",
        animalClass: "INSECTA",
        wiki: 'https://www.wikiwand.com/en/articles/Bee'
      },
      butterfly: {
        id:'butterfly',
        name: 'Butterfly wowicus', 
        description: "Very wow",
        animalClass: "INSECTA",
        wiki: 'https://www.wikiwand.com/en/articles/Butterfly'
      },
      ant: {
        id:'ant',
        name: 'Anticus smalikus', 
        description: "Very smol",
        animalClass: "INSECTA",
        wiki: 'https://www.wikiwand.com/en/articles/Ant'
      },
      dragonfly: {
        id:'dragonfly',
        name: 'dracarys', 
        description: "Very fly",
        animalClass: "INSECTA",
        wiki: 'https://www.wikiwand.com/en/articles/dragonfly'
      },
      ladybug: {
        id:'ladybug',
        name: 'Ladius bugas', 
        description: "Red",
        animalClass: "INSECTA",
        wiki: 'https://www.wikiwand.com/en/articles/ladybug'
      },
      grasshopper: {
        id:'grasshopper',
        name: 'grasshop', 
        description: "Green? Sometimes",
        animalClass: "INSECTA",
        wiki: 'https://www.wikiwand.com/en/articles/grasshopper'
      }
}
const HARDCODED_CARDS:any[] = [
    {
        id: 'bee1',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://media.istockphoto.com/id/1416170341/photo/bee.jpg?s=612x612&w=0&k=20&c=ulq9ad3TM-gZRml3jRECrEXB_-8QhmykZ0-Ys0oAqqg=',
        rarity: "RARE",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'bee',
        animal: HARDCODED_ANIMALS.bee,
        status: 'discovered'
    },
    {
        id: 'bee2',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/800px-Apis_mellifera_Western_honey_bee.jpg',
        rarity: "RARE",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'bee',
        animal: HARDCODED_ANIMALS.bee,
        status: 'traded'
    },
    {
        id: 'butterfly1',
        latitude: 42.597708,
        longitude: 23.421867,
        pictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Apis_mellifera_Western_honey_bee.jpg/800px-Apis_mellifera_Western_honey_bee.jpg',
        rarity: "LEGENDARY",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'butterfly',
        animal: HARDCODED_ANIMALS.butterfly,
        status: 'discovered'
    },    
    {
        id: 'bee3',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://cms.bbcearth.com/sites/default/files/factfiles/2024-07/Header%20image%20honeybee%20%28c%29%20adria_76_Bee%20Factfile_BBC%20Earth%20Factfile.jpg?imwidth=1920',
        rarity: "RARE",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'bee',
        animal: HARDCODED_ANIMALS.bee,
        status: 'traded'
    },
    {
        id: 'butterfly2',
        latitude: 42.597708,
        longitude: 23.421867,
        pictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLKth1ccgTNEpKB6mhkW0N_Q9uBMS9Fvti-w&s',
        rarity: "LEGENDARY",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'butterfly',
        animal: HARDCODED_ANIMALS.butterfly,
        status: 'traded'
    },
    {
        id: 'butterfly3',
        latitude: 42.597708,
        longitude: 23.421867,
        pictureUrl: 'https://monarchbutterflies.ca/wp-content/uploads/2021/11/shutterstock_1244001271-1-scaled-e1639912934464.jpg',
        rarity: "LEGENDARY",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'butterfly',
        animal: HARDCODED_ANIMALS.butterfly,
        status: 'traded'
    },
    {
        id: 'ant1',
        latitude: 42.597708,
        longitude: 23.421867,
        pictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHjJW4O8HBFUxYr6HVDMvy4KVG1KkVg3fMyw&s',
        rarity: "COMMON",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'ant',
        animal: HARDCODED_ANIMALS.ant,
        status: 'discovered'
    },
    {
        id: 'ant2',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://americanpest.net/wp-content/uploads/2024/12/carpenter-ants-in-maryland.png',
        rarity: "COMMON",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'ant',
        animal: HARDCODED_ANIMALS.ant,
        status: 'traded'
    },
    {
        id: 'dragonfly1',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://images.squarespace-cdn.com/content/v1/61c4da8eb1b30a201b9669f2/1717428004979-5XKMUIC8XWVHA1B1J4V8/Dragonfly2.jpg',
        rarity: "EPIC",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'dragonfly',
        animal: HARDCODED_ANIMALS.dragonfly,
        status: 'discovered'
    },
    {
        id: 'dragonfly2',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://drivebyeexterminators.com/wp-content/uploads/2019/03/Fastest-Flying-Insect-is-the-Dragonfly.jpeg',
        rarity: "EPIC",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'dragonfly',
        animal: HARDCODED_ANIMALS.dragonfly,
        status: 'traded'
    },
    {
        id: 'ladybug1',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg/800px-7-Spotted-Ladybug-Coccinella-septempunctata-sq1.jpg',
        rarity: "COMMON",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'ladybug',
        animal: HARDCODED_ANIMALS.ladybug,
        status: 'discovered'
    },
    {
        id: 'ladybug2',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Seven_spotted_ladybug.jpg',
        rarity: "COMMON",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'ladybug',
        animal: HARDCODED_ANIMALS.ladybug,
        status: 'traded'
    },
    {
        id: 'grasshopper1',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKmumsgkNz82_kLGL8qj4jiR7ug9-JDyoeTw&s',
        rarity: "RARE",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'grasshopper',
        animal: HARDCODED_ANIMALS.grasshopper,
        status: 'discovered'
    },
    {
        id: 'grasshopper2',
        latitude: 42.697708,
        longitude: 23.321867,
        pictureUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Grasshopper_01.jpg',
        rarity: "RARE",
        obtainmentDate: '2025-03-15T10:45:48.888Z',
        animalId: 'grasshopper',
        animal: HARDCODED_ANIMALS.grasshopper,
        status: 'traded'
    }
]

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


async function tryCatchRoute(fn: any, req: any, res: any, next: any) {
	try {
		await fn(req, res, next)
	} catch (err) {
    	return res.status(500).json({ message: 'internal error' })
	}
}


app.get('/cards/:userId', tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    const { userId } = req.params;
    const cards = await getAllCardsForUser(userId.padStart(32,'0')).catch(console.error)
    if (!cards?.length)
        return res.status(200).json({cards: HARDCODED_CARDS});
    return res.json(cards);
  }))


// @TODO use db
app.get('/nearby-users/:lat/:lon', tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    return res.json({users:HARDCODED_USERS})
}))

// @TODO use db
app.get('/battle-deck/:userId', tryCatchRoute.bind(null, async (req: any, res: any): Promise<any> => {
    const cards = []
    while(cards.length<5){
        cards.push(HARDCODED_CARDS[Math.floor((Math.random()%1)*HARDCODED_CARDS.length)])
    }
    return res.json({ cards })
}))


app.post('/upload', upload.single('image'), async (req: Request, res: Response): Promise<any> => {
    const userId = req.body.userId;

    if (!req.file?.path) {
        return res.status(400).json({ success: false, error: "Invalid upload" });
    }

    const fileBuffer = await fs.readFile(req.file.path)
        .catch(error => {
            return res.status(500).json({message: 'Error reading file', error: error});
        })

    const base64Image = "data:image/jpeg;base64," + fileBuffer.toString("base64");

    const data = JSON.stringify({
        images: [base64Image],
    });

    const url = `${config.INSECT_API_HOST!}/api/v1/identification?details=url,description,image`

    let body = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: {
            'Api-Key': config.INSECT_API_KEY,
            'Content-Type': 'application/json'
        },
        data : data
    };

    const response = await axios.request(body)

    const latinName = response.data.result.classification.suggestions[0]?.name;
    console.log(latinName)

    // if (await checkDiscoverer(userId, latinName)) {
    //     return res.json({
    //         'message': 'Card already discovered'
    //     });
    // }

    try {
        const imageUrl = await uploadImage(req.file.path, userId);
        console.log({imageUrl});
        return res.json({ success: true, imageUrl });

    } catch (error) {
        return res.json({ success: false, error: "Internal server error" });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});