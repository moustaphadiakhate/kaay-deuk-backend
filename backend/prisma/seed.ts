import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Démarrage du seed KaayDeuk...\n');

  // ── Super Admin ───────────────────────────────────────────────────────────
  const adminEmail = process.env.SUPER_ADMIN_EMAIL ?? 'admin@kaaydeuk.com';
  const adminPassword = process.env.SUPER_ADMIN_PASSWORD ?? 'Admin@KaayDeuk2025!';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.utilisateur.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nom: 'Super Admin',
      email: adminEmail,
      telephone: '+221 77 000 00 00',
      motDePasse: hashedPassword,
      typeUtilisateur: 'ADMINISTRATEUR',
    },
  });

  const admin = await prisma.administrateur.upsert({
    where: { utilisateurId: adminUser.id },
    update: {},
    create: {
      utilisateurId: adminUser.id,
      rib: 'SN-KAAY-001',
    },
  });

  console.log('✅ Admin créé:', adminUser.email);

  // ── Types de Logement ─────────────────────────────────────────────────────
  const typeLogements = [
    'Appartement',
    'Maison',
    'Villa',
    'Studio',
    'Chambre',
  ];

  const createdTypes = [];
  for (const typeLibelle of typeLogements) {
    const typeLogement = await prisma.typeLogement.upsert({
      where: { libelle: typeLibelle },
      update: {},
      create: { libelle: typeLibelle },
    });
    createdTypes.push(typeLogement);
  }

  console.log(`✅ ${createdTypes.length} types de logement créés`);

  console.log('\n🎉 Seed terminé avec succès !');
  console.log(`\n📧 Admin : ${adminEmail}`);
  console.log(`🔑 Mot de passe : ${adminPassword}`);
  console.log(`\n🚀 Lancez le backend : cd backend && npm run dev`);
  console.log(`🌐 API Docs : http://localhost:3000/api/docs`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur durant le seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
