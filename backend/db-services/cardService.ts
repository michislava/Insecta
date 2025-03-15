import { PrismaClient, Card } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export type CardPartial = Omit<Card, | 'id' | 'obtainmentDate'>;

export async function getAllCardsForUser(userId: string): Promise<Card[]> {
    return await prisma.card.findMany({
        where: {
            id: userId
        }
    })
}

export async function getCardById(cardId: string): Promise<Card | null> {
    return await prisma.card.findUnique({
        where: {
            id: cardId
        }
    })
}

export async function createCard(cardPartial: CardPartial): Promise<String | undefined> {
    const card: Card = {
        id: uuidv4(),
        latitude: cardPartial.latitude,
        longitude: cardPartial.longitude,
        pictureUrl: cardPartial.pictureUrl,
        rarity: cardPartial.rarity,
        animalId: cardPartial.animalId,
        ownerId: cardPartial.ownerId,
        discovererId: cardPartial.discovererId,
        obtainmentDate: new Date()
    };

    const createdCard = await prisma.card.create({
        data: card
    });

    return createdCard?.id;
}

export async function updateCardOwner(ownerId: string, cardId: string) {
    await prisma.card.update({
        where: {
            id: cardId
        },
        data: {
            ownerId: ownerId
        }
    })
}