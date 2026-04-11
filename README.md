# KaayDeuk — Plateforme Immobilière · Thiès, Sénégal

> Trouve ton logement, visite en 3D.

## Stack Technique

| Couche | Technologie |
|--------|-------------|
| Backend | NestJS · TypeScript · Prisma · PostgreSQL |
| Auth | JWT · bcrypt |
| Frontend Admin | React · React Admin · Vite |
| Landing Page | HTML/CSS/JS statique servi par NestJS |
| Validation | class-validator · class-transformer |
| Docs API | Swagger/OpenAPI |
| Sécurité | Helmet · CORS |

## Structure du projet

```
kaay_deuk_backend/
├── backend/                        # NestJS API + serveur statique
│   ├── public/                     # Landing page statique (servi à /)
│   │   └── index.html
│   ├── prisma/
│   │   ├── schema.prisma           # Schéma de base de données
│   │   └── seed.ts                 # Données de démonstration
│   ├── src/
│   │   ├── main.ts                 # Bootstrap + configuration Express
│   │   ├── app.module.ts
│   │   ├── prisma/                 # PrismaService (global)
│   │   ├── auth/                   # Module Auth (JWT)
│   │   │   ├── auth.controller.ts  # POST /api/auth/admin/login
│   │   │   ├── auth.service.ts     # Logique env-var + DB fallback
│   │   │   ├── strategies/         # JWT Strategy
│   │   │   └── guards/             # JwtAuthGuard
│   │   ├── logements/              # Module Logements
│   │   │   ├── logements.controller.ts
│   │   │   ├── logements.service.ts
│   │   │   ├── logements.repository.ts
│   │   │   └── dto/
│   │   └── common/
│   │       ├── filters/            # HttpExceptionFilter global
│   │       └── interceptors/       # TransformInterceptor (enveloppe responses)
│   ├── .env                        # Variables d'environnement (à créer)
│   ├── .env.example                # Template .env
│   └── package.json
│
├── frontend/                       # React Admin (servi à /admin/)
│   ├── src/
│   │   ├── App.tsx                 # Admin avec thème KaayDeuk
│   │   ├── admin/
│   │   │   ├── authProvider.ts     # Login JWT via /api/auth/admin/login
│   │   │   ├── dataProvider.ts     # Appels REST personnalisés
│   │   │   └── resources/
│   │   │       └── logements/      # CRUD complet logements
│   │   │           ├── LogementList.tsx
│   │   │           ├── LogementCreate.tsx
│   │   │           ├── LogementEdit.tsx
│   │   │           └── LogementShow.tsx
│   └── package.json
│
└── README.md
```

## Installation & Démarrage

### Prérequis — Installation de Node.js v20 LTS

#### Windows
1. Téléchargez le fichier `.msi` depuis [nodejs.org/en/download](https://nodejs.org/en/download/) (choisir **LTS — Windows Installer 64-bit**).
2. Lancez l'installateur, suivez les étapes, cochez *Automatically install necessary tools*.
3. Redémarrez votre terminal puis vérifiez :
   ```powershell
   node -v   # v20.x.x
   npm -v    # 10.x.x
   ```

> **Alternative (recommandée) :** utilisez **nvm-windows** pour gérer plusieurs versions de Node :
> 1. Téléchargez `nvm-setup.exe` depuis [github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases).
> 2. `nvm install 20` puis `nvm use 20`.

---

### Prérequis — Installation de PostgreSQL v16

#### Windows
1. Téléchargez l'installateur depuis [enterprisedb.com/downloads/postgres-postgresql-downloads](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads) (choisir **version 16, Windows x86-64**).
2. Lancez l'installateur. Notez bien le mot de passe que vous choisissez pour l'utilisateur **postgres** (vous en aurez besoin dans `.env`).
3. Port par défaut : **5432**. Cochez pgAdmin si vous voulez une interface graphique.
4. Après installation, créez la base de données :
   ```powershell
   # Ouvrez SQL Shell (psql) depuis le menu Démarrer
   psql -U postgres
   CREATE DATABASE kaaydeuk;
   \q
   ```

---

### 1. Cloner & installer

```bash
# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

Ou depuis la racine :
```bash
npm run install:all
```

### 2. Configurer l'environnement

```bash
cd backend
cp .env.example .env
```

Éditez `.env` :
```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/kaaydeuk?schema=public"
JWT_SECRET="une-cle-secrete-longue-et-aleatoire"
JWT_EXPIRES_IN="7d"
SUPER_ADMIN_EMAIL="admin@kaaydeuk.com"
SUPER_ADMIN_PASSWORD="VotreMotDePasse123!"
PORT=3000
FRONTEND_URL="http://localhost:5173"
```

### 3. Base de données

```bash
cd backend

# Générer le client Prisma
npm run prisma:generate

# Créer les tables
npm run prisma:migrate

# Peupler avec des données de démo
npm run seed
```

### 4. Build du frontend

```bash
cd frontend
npm run build
```

Le build est généré dans `frontend/dist/` et sera servi par NestJS sous `/admin/`.

### 5. Lancer le serveur

```bash
# Développement backend avec hot-reload
cd backend
npm run dev

# En parallèle, développement frontend (optionnel)
cd frontend
npm run dev
```

Ou depuis la racine pour tout lancer :
```bash
npm run dev
```

## URLs

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Landing page |
| `http://localhost:3000/admin` | Dashboard administrateur |
| `http://localhost:3000/api` | API REST |
| `http://localhost:3000/api/docs` | Documentation Swagger |

## API Endpoints

### Authentification

```
POST /api/auth/admin/login
Body: { "email": "admin@kaaydeuk.com", "password": "..." }
Response: { accessToken, tokenType, expiresIn, admin }
```

### Logements (Lecture publique)

```
GET  /api/logements                          Lister avec pagination/filtres
GET  /api/logements/:id                      Détail d'un logement
```

**Paramètres de filtrage :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `page` | number | Numéro de page (défaut: 1) |
| `limit` | number | Éléments par page (défaut: 10) |
| `ville` | string | Filtre par ville |
| `prixMin` | number | Prix minimum |
| `prixMax` | number | Prix maximum |
| `disponible` | boolean | Seulement les disponibles |
| `typeLogementId` | number | Type de logement |
| `sortBy` | string | Champ de tri |
| `sortOrder` | asc/desc | Ordre de tri |

### Logements (Protégés JWT)

```
POST   /api/logements          Créer un logement
PUT    /api/logements/:id      Modifier un logement
DELETE /api/logements/:id      Supprimer un logement
```

## Format Images (JSON)

Les champs `images` et `images3D` sont stockés en JSON :

```json
// images
[
  { "url": "https://...", "description": "Salon", "ordreAffichage": 0 },
  { "url": "https://...", "description": "Cuisine", "ordreAffichage": 1 }
]

// images3D
[
  { "url": "https://tour.kaaydeuk.com/...", "type": "360", "ordreAffichage": 0 }
]
```

## Auth Admin — Logique de connexion

1. Si `email` et `password` correspondent aux variables `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` → connexion immédiate sans DB
2. Sinon → vérification en base de données (administrateurs)
3. JWT signé avec `JWT_SECRET`, valide `JWT_EXPIRES_IN`

## Credentials de démo (après seed)

```
Email    : admin@kaaydeuk.com
Password : Admin@KaayDeuk2025!
```

## Production

```bash
# Build complet
npm run build   # depuis la racine

# Démarrer en production
cd backend
npm run start:prod
```

Pour la production, pensez à :
- Changer toutes les valeurs dans `.env`
- Utiliser `npm run prisma:migrate:deploy` au lieu de `migrate dev`
- Configurer un reverse proxy (Nginx) devant NestJS
- Activer HTTPS

---

Fait avec ❤️ à Thiès, Sénégal — **KaayDeuk © 2025**
