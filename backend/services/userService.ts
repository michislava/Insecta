import { User, Card, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function createUser(user: User) {
    await prisma.user.create({ data: user })
}

async function getUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
        where: {
            id: userId
        }
    })
}

async function checkDiscoverer(userId: string, animalId: string): Promise<Boolean | null> {
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
        if (user.discoveredCards[i].animalId == animalId) {
            return true;
        }
    }

    return false;
}
