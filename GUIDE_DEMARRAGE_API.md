# API Backend - Kaay Dëk

## Démarrage du serveur

### 1. Installation des dépendances

\`\`\`bash
cd kaay-deuk-backend/backend
npm install
\`\`\`

### 2. Configuration de la base de données

Créez un fichier \`.env\` à la racine du dossier \`backend\` avec:

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/kaay_deuk?schema=public"
JWT_SECRET="votre-secret-jwt-tres-securise"
PORT=3000
\`\`\`

### 3. Migrations de la base de données

\`\`\`bash
npx prisma migrate dev
npx prisma generate
\`\`\`

### 4. Démarrer le serveur

\`\`\`bash
npm run start:dev
\`\`\`

Le serveur sera accessible sur \`http://localhost:3000\`

### 5. Documentation API

Une fois le serveur démarré, la documentation Swagger est accessible sur:
\`http://localhost:3000/api\`

## Nouveaux endpoints ajoutés

### Visites 3D

- \`GET /api/visites-3d/verifier-acces/:chercheurId\` - Vérifie si un chercheur peut accéder aux visites 3D
- \`POST /api/visites-3d/enregistrer\` - Enregistre une nouvelle visite 3D
- \`GET /api/visites-3d/historique/:chercheurId\` - Récupère l'historique des visites d'un chercheur

Tous ces endpoints nécessitent une authentification JWT.

## Structure des dossiers

\`\`\`
backend/
├── src/
│   ├── visites3d/         # Nouveau module pour les visites 3D
│   │   ├── dto/
│   │   ├── visites3d.controller.ts
│   │   ├── visites3d.service.ts
│   │   └── visites3d.module.ts
│   ├── auth/              # Authentification
│   ├── logements/         # Gestion des logements
│   ├── utilisateurs/      # Gestion des utilisateurs
│   └── ...
\`\`\`

## Tests

Pour tester l'API avec curl:

\`\`\`bash
# Login
curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","motDePasse":"password"}'

# Vérifier accès visite 3D (remplacer TOKEN par le token JWT reçu)
curl -X GET http://localhost:3000/api/visites-3d/verifier-acces/1 \\
  -H "Authorization: Bearer TOKEN"
\`\`\`
