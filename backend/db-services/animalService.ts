import { Animal, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAnimalById(animalId: string): Promise<Animal | null> {
    return await prisma.animal.findUnique({
        where: {
            id: animalId
        }
    })
}