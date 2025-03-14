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