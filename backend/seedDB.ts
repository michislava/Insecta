import { User, Animal, PrismaClient } from '@prisma/client';
import { createUser } from "./db-services/userService";
import { createCard } from './db-services/cardService';

const prisma = new PrismaClient();

async function main(){
    const users = [
        { name: 'AntyStudios', email: 'antystudios@example.com', passwordHash: 'hash' },
        { name: 'BuzzAldrin', email: 'buzzaldrin@example.com', passwordHash: 'hash' },
        { name: 'CardiBee', email: 'cardibee@example.com', passwordHash: 'hash' }
    ] as any[];
     
    const userIds = await Promise.all(users.map(createUser)).then(records=>records.map(record=>record.id))
      
    const animals:any[] = await Promise.all([
        prisma.animal.create({data:{ latinName: 'Apis mellifera', name: 'Honeybee', description: 'Pollinating insect', animalClass: 'INSECTA' }}),
        prisma.animal.create({data:{ latinName: 'Latrodectus mactans', name: 'Black Widow', description: 'Venomous spider', animalClass: 'ARACHNIDA' }}),
        prisma.animal.create({data:{ latinName: 'Acheta domesticus', name: 'House Cricket', description: 'Common cricket species', animalClass: 'INSECTA' }}),
    ])

    const cardsToAdd: any[] = [
        {
            "latitude": 40.7128,
            "longitude": -74.0060,
            "pictureUrl": "https://example.com/image1.jpg",
            "rarity": "COMMON",
            "animalId": animals[0].id,
            "ownerId": userIds[1-1],
            "discovererId": userIds[1-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "pictureUrl": "https://example.com/image2.jpg",
            "rarity": "RARE",
            "animalId": animals[0].id,
            "ownerId": userIds[2-1],
            "discovererId": userIds[2-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "pictureUrl": "https://example.com/image3.jpg",
            "rarity": "EPIC",
            "animalId": animals[0].id,
            "ownerId": userIds[3-1],
            "discovererId": userIds[3-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 40.7306,
            "longitude": -73.9352,
            "pictureUrl": "https://example.com/image4.jpg",
            "rarity": "COMMON",
            "animalId": animals[1].id,
            "ownerId": userIds[1-1],
            "discovererId": userIds[1-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "pictureUrl": "https://example.com/image5.jpg",
            "rarity": "RARE",
            "animalId": animals[1].id,
            "ownerId": userIds[2-1],
            "discovererId": userIds[2-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "pictureUrl": "https://example.com/image6.jpg",
            "rarity": "EPIC",
            "animalId": animals[1].id,
            "ownerId": userIds[3-1],
            "discovererId": userIds[3-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 40.7306,
            "longitude": -73.9352,
            "pictureUrl": "https://example.com/image7.jpg",
            "rarity": "COMMON",
            "animalId": animals[1-1].id,
            "ownerId": userIds[1-1],
            "discovererId": userIds[1-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "pictureUrl": "https://example.com/image8.jpg",
            "rarity": "RARE",
            "animalId": animals[2-1].id,
            "ownerId": userIds[2-1],
            "discovererId": userIds[2-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "pictureUrl": "https://example.com/image9.jpg",
            "rarity": "EPIC",
            "animalId": animals[3-1].id,
            "ownerId": userIds[3-1],
            "discovererId": userIds[3-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        }
      ]
      const cards = await Promise.all(cardsToAdd.map(c=>createCard(c)))

      

}

main()