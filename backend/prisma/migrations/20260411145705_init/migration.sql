-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "typeUtilisateur" TEXT NOT NULL,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chercheurs" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,

    CONSTRAINT "chercheurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrateurs" (
    "id" SERIAL NOT NULL,
    "utilisateurId" INTEGER NOT NULL,
    "rib" TEXT NOT NULL,

    CONSTRAINT "administrateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locataires" (
    "id" SERIAL NOT NULL,
    "chercheurId" INTEGER NOT NULL,
    "dateDebutContrat" TIMESTAMP(3),
    "caution" DOUBLE PRECISION,

    CONSTRAINT "locataires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "types_logement" (
    "id" SERIAL NOT NULL,
    "libelle" TEXT NOT NULL,

    CONSTRAINT "types_logement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logements" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "prix" DOUBLE PRECISION NOT NULL,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "superficie" DOUBLE PRECISION NOT NULL,
    "nombrePieces" INTEGER NOT NULL,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "caution" DOUBLE PRECISION,
    "images" JSONB NOT NULL DEFAULT '[]',
    "images3D" JSONB NOT NULL DEFAULT '[]',
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "administrateurId" INTEGER NOT NULL,
    "typeLogementId" INTEGER NOT NULL,

    CONSTRAINT "logements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favoris" (
    "id" SERIAL NOT NULL,
    "dateAjout" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chercheurId" INTEGER NOT NULL,
    "logementId" INTEGER NOT NULL,

    CONSTRAINT "favoris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "montantTotal" DOUBLE PRECISION NOT NULL,
    "acompte" DOUBLE PRECISION,
    "dateReservation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chercheurId" INTEGER NOT NULL,
    "logementId" INTEGER NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiements" (
    "id" SERIAL NOT NULL,
    "datePaiement" TIMESTAMP(3),
    "montant" DOUBLE PRECISION NOT NULL,
    "methode" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'EN_ATTENTE',
    "referenceTransaction" TEXT,
    "dateCreation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locataireId" INTEGER NOT NULL,
    "reservationId" INTEGER,

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visites_3d" (
    "id" SERIAL NOT NULL,
    "dureeVisite" INTEGER NOT NULL DEFAULT 0,
    "dateVisite" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chercheurId" INTEGER NOT NULL,
    "logementId" INTEGER NOT NULL,

    CONSTRAINT "visites_3d_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chercheurs_utilisateurId_key" ON "chercheurs"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "administrateurs_utilisateurId_key" ON "administrateurs"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "locataires_chercheurId_key" ON "locataires"("chercheurId");

-- CreateIndex
CREATE UNIQUE INDEX "types_logement_libelle_key" ON "types_logement"("libelle");

-- CreateIndex
CREATE UNIQUE INDEX "favoris_chercheurId_logementId_key" ON "favoris"("chercheurId", "logementId");

-- CreateIndex
CREATE UNIQUE INDEX "paiements_referenceTransaction_key" ON "paiements"("referenceTransaction");

-- AddForeignKey
ALTER TABLE "chercheurs" ADD CONSTRAINT "chercheurs_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "administrateurs" ADD CONSTRAINT "administrateurs_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locataires" ADD CONSTRAINT "locataires_chercheurId_fkey" FOREIGN KEY ("chercheurId") REFERENCES "chercheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logements" ADD CONSTRAINT "logements_administrateurId_fkey" FOREIGN KEY ("administrateurId") REFERENCES "administrateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logements" ADD CONSTRAINT "logements_typeLogementId_fkey" FOREIGN KEY ("typeLogementId") REFERENCES "types_logement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_chercheurId_fkey" FOREIGN KEY ("chercheurId") REFERENCES "chercheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoris" ADD CONSTRAINT "favoris_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "logements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_chercheurId_fkey" FOREIGN KEY ("chercheurId") REFERENCES "chercheurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "logements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_locataireId_fkey" FOREIGN KEY ("locataireId") REFERENCES "locataires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visites_3d" ADD CONSTRAINT "visites_3d_chercheurId_fkey" FOREIGN KEY ("chercheurId") REFERENCES "chercheurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visites_3d" ADD CONSTRAINT "visites_3d_logementId_fkey" FOREIGN KEY ("logementId") REFERENCES "logements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
