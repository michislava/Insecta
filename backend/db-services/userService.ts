import { User, PrismaClient } from '@prisma/client';
import { getAnimalById } from './animalService';

const prisma = new PrismaClient();


export async function createUser(user: Omit<User,'id'>) {
    return await prisma.user.create({ data: user })
}

export async function getUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: {
            id: userId
        }
    })
}

export async function checkDiscoverer(userId: string, latinName: string): Promise<Boolean | null> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            discoveredCards: true
        }
    })

    if (!user)
        return null;

    for (let i = 0; i < user.discoveredCards.length; i++) {
        const animal = await getAnimalById(user.discoveredCards[i].animalId);

        if (animal?.latinName == latinName) {
            return true;
        }
    }

    return false;
}
