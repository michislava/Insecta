import { User, PrismaClient } from "@prisma/client"

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
