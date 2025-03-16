import { Animal, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createAnimal(
    latinName: string,
    description: string,
  ) {
    return await prisma.animal.create({
      data: {
        latinName,
        name: latinName,
        description,
        animalClass:'INSECTA',
      },
    });
  }

export async function getAnimalById(animalId: string): Promise<Animal | null> {
    return await prisma.animal.findUnique({
        where: {
            id: animalId
        }
    })
}

export async function getAnimalByLatinName(latinName: string): Promise<Animal | null> {
    return await prisma.animal.findFirst({
        where: {
            latinName: latinName
        }
    });
}