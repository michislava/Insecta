import { Trade, User, Card, PrismaClient } from "@prisma/client";
import { updateCardOwner } from "./cardService";

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

export async function finalizeTrade(tradedId:number, userId:string, cardId:string): Promise<Trade | null> {
    // @TODO actually change owners of cards
    await prisma.trade.update({
        where: {
            id: tradedId,
        },
        data: {
            userB:{ connect: {id:userId}},
            cardB:{ connect: {id:cardId}}
        },
    })

    const trade: Trade | null = await prisma.trade.findUnique({
        where: {
            id: tradedId
        },
        include: {
            userA: true,
            userB: true,
            cardA: true,
            cardB: true
        }
    })

    if (!trade || !trade.cardBId || !trade.userBId)
        return null;

    const userAId = trade.userAId;
    const userBId = trade.userBId;
    const cardAId = trade.cardAId;
    const cardBId = trade.cardBId;
    
    updateCardOwner(userAId, cardBId);
    updateCardOwner(userBId, cardAId);

    return trade;
}