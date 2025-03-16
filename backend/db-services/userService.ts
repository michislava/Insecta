import { User, PrismaClient } from '@prisma/client';
import { getAnimalById } from './animalService';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();


export async function createUserFromObj(user: Omit<User,'id'>) {
    console.log(user)
    const u = await prisma.user.create({ data: user })
    console.log(u)
    return u
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

export async function createUser(email: string, username: string, passHash: string): Promise<String | undefined> {
    const user: User = {
        id: uuidv4(),
        name: username,
        email: email,
        passwordHash: passHash,
        bio: null,
        pictureUrl: null,
        isDeleted: null
    }

    await prisma.user.create({
        data: user
    });

    const createdUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }
    });

    return createdUser?.id;
}

export async function loginUser(username: string, passHash: string): Promise<String | undefined> {
    const user = await prisma.user.findUnique({
        where: {
            name: username,
            passwordHash: passHash
        }
    })

    if (!user)
        return undefined;

    return user.id;
}
