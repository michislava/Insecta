import { PrismaClient, Card } from '@prisma/client';
import { create } from 'domain';

const prisma = new PrismaClient();

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

export async function createCard(card: Card): Promise<String | undefined> {
    await prisma.card.create({
        data: card
    })

    const createdCard = await prisma.card.findUnique({ where: card });

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