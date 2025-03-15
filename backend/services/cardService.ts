import { Card, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getAllCardsForUser(userId: string): Promise<Card[]> {
    return await prisma.card.findMany({
        where: {
            id: userId
        }
    })
}

async function getCardById(cardId: string): Promise<Card | null> {
    return await prisma.card.findUnique({
        where: {
            id: cardId
        }
    })
}

async function createCard(card: Card) {
    await prisma.card.create({
        data: card
    })
}

async function updateCardOwner(ownerId: string, cardId: string) {
    await prisma.card.update({
        where: {
            id: cardId
        },
        data: {
            ownerId: ownerId
        }
    })
}