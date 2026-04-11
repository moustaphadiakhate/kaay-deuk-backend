import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ── Helpers ───────────────────────────────────────────────────────────────────
function img(url: string, description: string, ordre = 0) {
  return { url, description, ordreAffichage: ordre };
}
function img3d(url: string, type: '360' | 'panorama' | 'matterport', description = 'Visite 360°', ordre = 0) {
  return { url, description, ordreAffichage: ordre, type };
}

// ── Données seed des logements ────────────────────────────────────────────────
const LOGEMENTS_DATA = [
  // ── Appartements ────────────────────────────────────────────────────────────
  {
    titre: 'Appartement F3 moderne — Thiès Centre',
    description:
      "Bel appartement 3 pièces au cœur de Thiès, entièrement rénové. Cuisine équipée, salon lumineux, 2 chambres climatisées, salle de bain carrelée. Idéal pour famille ou professionnel.",
    prix: 250000,
    adresse: 'Avenue Léopold Sédar Senghor, Thiès Centre',
    ville: 'Thiès',
    superficie: 85,
    nombrePieces: 3,
    disponible: true,
    caution: 500000,
    typeLibelle: 'Appartement',
    images: [
      img('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Salon principal'),
      img('https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', 'Cuisine équipée', 1),
      img('https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', 'Chambre principale', 2),
    ],
    images3D: [img3d('https://tour.kaaydeuk.com/appart-centre-001', '360', 'Visite 360° salon + chambres')],
  },
  {
    titre: 'Appartement F2 standing — Thiès Plateau',
    description:
      "Appartement standing 2 pièces, finitions haut de gamme, vue dégagée, balcon. Quartier Plateau, à 5 min du marché central. Charges comprises.",
    prix: 150000,
    adresse: 'Rue du Plateau, Thiès Plateau',
    ville: 'Thiès',
    superficie: 65,
    nombrePieces: 2,
    disponible: true,
    caution: 300000,
    typeLibelle: 'Appartement',
    images: [
      img('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Vue salon-balcon'),
      img('https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'Chambre avec vue', 1),
    ],
    images3D: [],
  },
  {
    titre: 'Appartement F4 résidentiel — Cité Lamy',
    description:
      "Grand appartement 4 pièces dans résidence sécurisée Cité Lamy. Gardiennage 24h/24, parking privé, groupe électrogène. Parfait pour famille nombreuse.",
    prix: 350000,
    adresse: 'Cité Lamy, Rue 12, Thiès',
    ville: 'Thiès',
    superficie: 120,
    nombrePieces: 4,
    disponible: false,
    caution: 700000,
    typeLibelle: 'Appartement',
    images: [
      img('https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', 'Salon spacieux'),
      img('https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800', 'Cuisine ouverte', 1),
    ],
    images3D: [img3d('https://tour.kaaydeuk.com/appart-lamy-004', '360', 'Visite complète de l\'appartement')],
  },

  // ── Maisons ─────────────────────────────────────────────────────────────────
  {
    titre: 'Maison familiale 4 pièces — Thiès Plateau',
    description:
      "Belle maison de plain-pied, 4 pièces spacieuses, cour privée, parking, terrasse. À deux pas de l'école centrale. Calme et sécurisé.",
    prix: 200000,
    adresse: 'Thiès Plateau, Rue des Baobabs',
    ville: 'Thiès',
    superficie: 110,
    nombrePieces: 4,
    disponible: true,
    caution: 400000,
    typeLibelle: 'Maison',
    images: [
      img('https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'Façade principale'),
      img('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Cour intérieure', 1),
      img('https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800', 'Cuisine', 2),
    ],
    images3D: [],
  },
  {
    titre: 'Maison 5 pièces avec jardin — Thiès Nord',
    description:
      "Superbe maison 5 pièces avec jardin arboré, deux salons, 3 chambres, 2 salles de bain. Quartier calme et résidentiel à Thiès Nord. Idéale pour grande famille.",
    prix: 300000,
    adresse: 'Quartier Résidentiel Nord, Thiès',
    ville: 'Thiès',
    superficie: 160,
    nombrePieces: 5,
    disponible: true,
    caution: 600000,
    typeLibelle: 'Maison',
    images: [
      img('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'Vue extérieure'),
      img('https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800', 'Jardin privé', 1),
      img('https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=800', 'Salon principal', 2),
    ],
    images3D: [img3d('https://tour.kaaydeuk.com/maison-nord-005', '360', 'Visite 360° jardin + intérieur')],
  },
  {
    titre: 'Petite maison 2 pièces — Thiès Sud',
    description:
      "Maison compacte et bien entretenue, idéale pour couple ou personne seule. Petite cour, économique, quartier animé de Thiès Sud.",
    prix: 75000,
    adresse: 'Quartier Sud, Thiès',
    ville: 'Thiès',
    superficie: 45,
    nombrePieces: 2,
    disponible: true,
    caution: 150000,
    typeLibelle: 'Maison',
    images: [
      img('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'Façade'),
    ],
    images3D: [],
  },

  // ── Studios ──────────────────────────────────────────────────────────────────
  {
    titre: 'Studio meublé cosy — Thiès Nord (Univ)',
    description:
      "Studio meublé et équipé, idéal pour étudiant ou jeune professionnel. Cuisine intégrée, Wi-Fi inclus, proche de l'université de Thiès. Disponible immédiatement.",
    prix: 80000,
    adresse: 'Quartier Universitaire, Thiès Nord',
    ville: 'Thiès',
    superficie: 28,
    nombrePieces: 1,
    disponible: true,
    caution: 160000,
    typeLibelle: 'Studio',
    images: [
      img('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'Studio complet'),
      img('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', 'Coin cuisine', 1),
    ],
    images3D: [img3d('https://tour.kaaydeuk.com/studio-univ-007', '360', 'Visite studio 360°')],
  },
  {
    titre: 'Studio lumineux — Centre-Ville Thiès',
    description:
      "Studio 30 m², bien orienté, lumière naturelle toute la journée. Parfait pour professionnel en déplacement ou étudiant. Charges (eau + électricité) incluses.",
    prix: 95000,
    adresse: 'Avenue Malick Sy, Thiès Centre',
    ville: 'Thiès',
    superficie: 30,
    nombrePieces: 1,
    disponible: true,
    caution: 190000,
    typeLibelle: 'Studio',
    images: [
      img('https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800', 'Studio lumineux'),
    ],
    images3D: [],
  },
  {
    titre: 'Studio neuf équipé — Thiès Plateau',
    description:
      "Studio neuf 35 m² avec équipements modernes : cuisine induction, climatisation, rangements. Dans résidence neuve, gardien, parking moto disponible.",
    prix: 110000,
    adresse: 'Rue 3, Thiès Plateau',
    ville: 'Thiès',
    superficie: 35,
    nombrePieces: 1,
    disponible: false,
    caution: 220000,
    typeLibelle: 'Studio',
    images: [
      img('https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'Studio neuf'),
      img('https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800', 'Cuisine induction', 1),
    ],
    images3D: [img3d('https://tour.kaaydeuk.com/studio-plateau-009', '360', 'Tour du studio')],
  },

  // ── Villas ───────────────────────────────────────────────────────────────────
  {
    titre: 'Villa standing avec piscine — Cité Lamy',
    description:
      "Magnifique villa 5 pièces avec piscine privée, jardin paysagé, deux salons, 3 chambres en-suite. Résidence sécurisée, gardiennage. Le summum du luxe à Thiès.",
    prix: 750000,
    adresse: 'Cité Lamy, Villa 24, Thiès',
    ville: 'Thiès',
    superficie: 280,
    nombrePieces: 5,
    disponible: true,
    caution: 1500000,
    typeLibelle: 'Villa',
    images: [
      img('https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 'Façade villa'),
      img('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', 'Piscine privée', 1),
      img('https://images.unsplash.com/photo-1551361415-69c87624334f?w=800', 'Salon luxueux', 2),
      img('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Jardin paysagé', 3),
    ],
    images3D: [
      img3d('https://tour.kaaydeuk.com/villa-lamy-010', '360', 'Visite complète villa + piscine'),
      img3d('https://tour.kaaydeuk.com/villa-lamy-010-garden', 'panorama', 'Vue panoramique jardin', 1),
    ],
  },
  {
    titre: 'Villa familiale 4 chambres — Thiès Ouest',
    description:
      "Belle villa 6 pièces en duplex, 4 chambres, grand séjour avec terrasse, garage 2 voitures. Quartier résidentiel calme à Thiès Ouest. Proche école française.",
    prix: 450000,
    adresse: 'Quartier Résidentiel Ouest, Thiès',
    ville: 'Thiès',
    superficie: 220,
    nombrePieces: 6,
    disponible: true,
    caution: 900000,
    typeLibelle: 'Villa',
    images: [
      img('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'Villa extérieur'),
      img('https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800', 'Séjour duplex', 1),
      img('https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800', 'Cuisine américaine', 2),
    ],
    images3D: [img3d('https://tour.kaaydeuk.com/villa-ouest-011', '360', 'Visite villa duplex')],
  },

  // ── Chambres ─────────────────────────────────────────────────────────────────
  {
    titre: 'Chambre meublée — Cité Ballabey',
    description:
      "Chambre meublée dans maison partagée, accès cuisine commune, salle de bain privée. Idéal pour étudiant ou personne de passage. Ambiance conviviale.",
    prix: 40000,
    adresse: 'Cité Ballabey, Thiès',
    ville: 'Thiès',
    superficie: 15,
    nombrePieces: 1,
    disponible: true,
    caution: 80000,
    typeLibelle: 'Chambre',
    images: [
      img('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', 'Chambre meublée'),
    ],
    images3D: [],
  },
  {
    titre: 'Chambre indépendante avec SDB — Thiès Centre',
    description:
      "Chambre indépendante avec salle de bain privée et entrée séparée. Dans une villa, accès jardin. Calme, sécurisé, idéal pour professionnel isolé.",
    prix: 55000,
    adresse: 'Villa Résidentielle, Thiès Centre',
    ville: 'Thiès',
    superficie: 20,
    nombrePieces: 1,
    disponible: true,
    caution: 110000,
    typeLibelle: 'Chambre',
    images: [
      img('https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800', 'Chambre cosy'),
      img('https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800', 'Salle de bain', 1),
    ],
    images3D: [],
  },
];

async function main(): Promise<void> {
  console.log('🌱 Démarrage du seed KaayDeuk...\n');

  // ── Types de logement ─────────────────────────────────────────────────────
  const types = ['Appartement', 'Maison', 'Studio', 'Villa', 'Chambre'];
  for (const libelle of types) {
    await prisma.typeLogement.upsert({
      where: { libelle },
      update: {},
      create: { libelle },
    });
  }
  console.log('✅ Types de logement créés:', types.join(', '));

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

  // ── Insertion des logements ───────────────────────────────────────────────
  let created = 0;
  for (const data of LOGEMENTS_DATA) {
    const typeLogement = await prisma.typeLogement.findUnique({
      where: { libelle: data.typeLibelle },
    });
    if (!typeLogement) {
      console.warn(`⚠️  Type inconnu: ${data.typeLibelle}, ignoré.`);
      continue;
    }

    const { typeLibelle, images, images3D, ...rest } = data;
    await prisma.logement.create({
      data: {
        ...rest,
        administrateurId: admin.id,
        typeLogementId: typeLogement.id,
        images: images as any,
        images3D: images3D as any,
      },
    });
    created++;
  }

  console.log(`✅ ${created} logements créés`);
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
