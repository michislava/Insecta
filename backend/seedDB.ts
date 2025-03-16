import { User, Animal, PrismaClient } from '@prisma/client';
import { createUser, createUserFromObj } from "./db-services/userService";
import { createCard } from './db-services/cardService';

const prisma = new PrismaClient();

async function main(){
    const users = [
        { name: 'AntyStudios', email: 'antystudios@example.com', passwordHash: 'hash' },
        { name: 'BuzzAldrin', email: 'buzzaldrin@example.com', passwordHash: 'hash' },
        { name: 'CardiBee', email: 'cardibee@example.com', passwordHash: 'hash' }
    ] as any[];
     
    const userIds = await Promise.all(users.map(createUserFromObj)).then(records=>records.map(record=>record.id))
      
    const animals:any[] = await Promise.all([
        prisma.animal.create({data:{ latinName: 'Apis mellifera', name: 'Honeybee', description: 'Pollinating insect', animalClass: 'INSECTA' }}),
        prisma.animal.create({data:{ latinName: 'Acheta domesticus', name: 'House Cricket', description: 'Common cricket species', animalClass: 'INSECTA' }}),
        prisma.animal.create({data:{ latinName: 'Latrodectus mactans', name: 'Black Widow', description: 'Venomous spider', animalClass: 'ARACHNIDA' }}),
    ])

    const cardsToAdd: any[] = [
        {
            "latitude": 40.7128,
            "longitude": -74.0060,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/European_honey_bee_extracts_nectar.jpg/640px-European_honey_bee_extracts_nectar.jpg",
            "rarity": "COMMON",
            "animalId": animals[0].id,
            "ownerId": userIds[1-1],
            "discovererId": userIds[1-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Tonight_a_female_cricket_came_to_see_me%2C_but_he_did_not_..._told_me_%28Acheta_domestica%29-_DSC04475_by_Gianni_Del_Bufalo_%28bygdb%29_01.jpg/640px-Tonight_a_female_cricket_came_to_see_me%2C_but_he_did_not_..._told_me_%28Acheta_domestica%29-_DSC04475_by_Gianni_Del_Bufalo_%28bygdb%29_01.jpg",
            "rarity": "RARE",
            "animalId": animals[0].id,
            "ownerId": userIds[2-1],
            "discovererId": userIds[2-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Black_Widow_11-06.jpg/640px-Black_Widow_11-06.jpg",
            "rarity": "EPIC",
            "animalId": animals[0].id,
            "ownerId": userIds[3-1],
            "discovererId": userIds[3-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 40.7306,
            "longitude": -73.9352,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Apis_mellifera_flying.jpg/640px-Apis_mellifera_flying.jpg",
            "rarity": "COMMON",
            "animalId": animals[1].id,
            "ownerId": userIds[1-1],
            "discovererId": userIds[1-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Tonight_a_female_cricket_came_to_see_me%2C_but_he_did_not_..._told_me_%28Acheta_domestica%29-_DSC04471_by_Gianni_Del_Bufalo_%28bygdb%29_02.jpg/640px-Tonight_a_female_cricket_came_to_see_me%2C_but_he_did_not_..._told_me_%28Acheta_domestica%29-_DSC04471_by_Gianni_Del_Bufalo_%28bygdb%29_02.jpg",
            "rarity": "RARE",
            "animalId": animals[1].id,
            "ownerId": userIds[2-1],
            "discovererId": userIds[2-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Latrodectus.png/640px-Latrodectus.png",
            "rarity": "EPIC",
            "animalId": animals[1].id,
            "ownerId": userIds[3-1],
            "discovererId": userIds[3-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 40.7306,
            "longitude": -73.9352,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Bee_Collecting_Pollen_2004-08-14.jpg/640px-Bee_Collecting_Pollen_2004-08-14.jpg",
            "rarity": "COMMON",
            "animalId": animals[1-1].id,
            "ownerId": userIds[1-1],
            "discovererId": userIds[1-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 34.0522,
            "longitude": -118.2437,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Acheta-domestica-1.jpg/640px-Acheta-domestica-1.jpg",
            "rarity": "RARE",
            "animalId": animals[2-1].id,
            "ownerId": userIds[2-1],
            "discovererId": userIds[2-1],
            "obtainmentDate": "2025-03-16T12:00:00.000Z"
        },
        {
            "latitude": 37.7749,
            "longitude": -122.4194,
            "pictureUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Adult_Female_Black_Widow.jpg/640px-Adult_Female_Black_Widow.jpg",
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