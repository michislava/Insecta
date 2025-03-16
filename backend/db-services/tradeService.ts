import { Trade, User, Card, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTradeById(tradeId: number): Promise<Trade | null> {
    return await prisma.trade.findUnique({
        where: {
            id: tradeId
        },
        include: {
            cardA: {include:{animal:true}},
            cardB: {include:{animal:true}},
        }
    })
}

export async function createTrade(userId:string,cardId:string): Promise<Trade | null> {
    return await prisma.trade.create({
        data: {
            userA:{ connect: {id:userId}},
            cardA:{ connect: {id:cardId}}
        },
    })
}

export async function finalizeTrade(tradedId:number, userId:string,cardId:string): Promise<Trade | null> {
    return await prisma.trade.update({
        where: {
            id: tradedId,
        },
        data: {
            userB:{ connect: {id:userId}},
            cardB:{ connect: {id:cardId}}
        },
    })
}