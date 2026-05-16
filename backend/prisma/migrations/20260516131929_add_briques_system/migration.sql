-- AlterTable
ALTER TABLE "chercheurs" ADD COLUMN     "briques" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "transactions_briques" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "montant" INTEGER NOT NULL,
    "description" TEXT,
    "reference" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chercheurId" INTEGER NOT NULL,

    CONSTRAINT "transactions_briques_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_briques_reference_key" ON "transactions_briques"("reference");

-- AddForeignKey
ALTER TABLE "transactions_briques" ADD CONSTRAINT "transactions_briques_chercheurId_fkey" FOREIGN KEY ("chercheurId") REFERENCES "chercheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
