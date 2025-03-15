import { User, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export async function createUser(user: User) {
    await prisma.user.create({ data: user })
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
        if (user.discoveredCards[i].latinName == latinName) {
            return true;
        }
    }

    return false;
}
