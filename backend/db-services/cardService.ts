import { PrismaClient, Card } from '@prisma/client';

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

export async function createCard(card: Card) {
    await prisma.card.create({
        data: card
    })
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