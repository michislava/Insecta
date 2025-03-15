-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "userAId" UUID NOT NULL,
    "userBId" UUID,
    "cardAId" UUID NOT NULL,
    "cardBId" UUID,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_cardAId_fkey" FOREIGN KEY ("cardAId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_cardBId_fkey" FOREIGN KEY ("cardBId") REFERENCES "Card"("id") ON DELETE SET NULL ON UPDATE CASCADE;
