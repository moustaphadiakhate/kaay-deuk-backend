-- AlterTable
ALTER TABLE "logements" ADD COLUMN     "equipements" JSONB NOT NULL DEFAULT '{"wifiHauteVitesse":false,"garagePrivé":false,"sécurité24h7":false,"climatisation":false}';
