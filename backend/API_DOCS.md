# API Documentation - KaayDeuk Backend

## Base URL
```
http://localhost:3000/api
```

---

## 📋 Logements Endpoints

### GET /logements
**Récupérer la liste des logements avec pagination et filtres**

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | Non | 1 | Numéro de page |
| `limit` | number | Non | 10 | Nombre d'éléments par page |
| `ville` | string | Non | - | Filtrer par ville (case-insensitive) |
| `prixMin` | number | Non | - | Prix minimum mensuel (FCFA) |
| `prixMax` | number | Non | - | Prix maximum mensuel (FCFA) |
| `disponible` | boolean | Non | - | Filtrer par disponibilité (true/false) |
| `typeLogementId` | number | Non | - | Filtrer par type de logement |
| `sortBy` | string | Non | dateCreation | Champ de tri (dateCreation, prix, superficie, nombrePieces, titre) |
| `sortOrder` | string | Non | desc | Ordre de tri (asc ou desc) |

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/logements?page=1&limit=10&ville=Thiès&prixMin=100000&prixMax=500000&disponible=true&sortBy=prix&sortOrder=asc"
```

#### Success Response (200 OK)
```json
{
  "data": [
    {
      "id": 1,
      "titre": "Appartement moderne Centre-Ville",
      "description": "Bel appartement 3 pièces avec vue sur la rue",
      "prix": 250000,
      "adresse": "Avenue Léopold Sédar Senghor",
      "ville": "Thiès",
      "superficie": 85,
      "nombrePieces": 3,
      "disponible": true,
      "caution": 500000,
      "equipements": {
        "wifiHauteVitesse": true,
        "garagePrivé": false,
        "sécurité24h7": true,
        "climatisation": true
      },
      "images": [
        {
          "url": "https://example.com/photo1.jpg",
          "titre": "Salon",
          "lieu": "Séjour principal avec vue sur le jardin",
          "description": "Vue du salon principal",
          "ordreAffichage": 0
        }
      ],
      "images3D": [
        {
          "url": "https://tour.kaaydeuk.com/logement-1",
          "titre": "Salon",
          "lieu": "Visite 360° du salon",
          "description": "Visite complète",
          "type": "360",
          "ordreAffichage": 0
        }
      ],
      "dateCreation": "2026-04-16T13:30:00Z",
      "administrateurId": 1,
      "typeLogementId": 3,
      "typeLogement": {
        "id": 3,
        "libelle": "Villa"
      },
      "administrateur": {
        "id": 1,
        "rib": "SN-KAAY-001",
        "utilisateur": {
          "id": 1,
          "nom": "Super Admin",
          "telephone": "+221 77 000 00 00",
          "email": "admin@kaaydeuk.com"
        }
      }
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

#### Error Response (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": "Erreur de validation",
  "error": "Bad Request"
}
```

---

### GET /logements/:id
**Récupérer un logement spécifique par son ID**

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Oui | ID du logement |

#### Example Request
```bash
curl -X GET "http://localhost:3000/api/logements/1"
```

#### Success Response (200 OK)
```json
{
  "id": 1,
  "titre": "Appartement moderne Centre-Ville",
  "description": "Bel appartement 3 pièces avec vue sur la rue",
  "prix": 250000,
  "adresse": "Avenue Léopold Sédar Senghor",
  "ville": "Thiès",
  "superficie": 85,
  "nombrePieces": 3,
  "disponible": true,
  "caution": 500000,
  "equipements": {
    "wifiHauteVitesse": true,
    "garagePrivé": false,
    "sécurité24h7": true,
    "climatisation": true
  },
  "images": [
    {
      "url": "https://example.com/photo1.jpg",
      "titre": "Salon",
      "lieu": "Séjour principal avec vue sur le jardin",
      "description": "Vue du salon principal",
      "ordreAffichage": 0
    }
  ],
  "images3D": [
    {
      "url": "https://tour.kaaydeuk.com/logement-1",
      "titre": "Salon",
      "lieu": "Visite 360° du salon",
      "description": "Visite complète",
      "type": "360",
      "ordreAffichage": 0
    }
  ],
  "dateCreation": "2026-04-16T13:30:00Z",
  "administrateurId": 1,
  "typeLogementId": 3,
  "typeLogement": {
    "id": 3,
    "libelle": "Villa"
  },
  "administrateur": {
    "id": 1,
    "rib": "SN-KAAY-001",
    "utilisateur": {
      "id": 1,
      "nom": "Super Admin",
      "telephone": "+221 77 000 00 00",
      "email": "admin@kaaydeuk.com"
    }
  }
}
```

#### Error Response (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Logement introuvable",
  "error": "Not Found"
}
```

---

### POST /logements
**Créer un nouveau logement** (Authentification requise)

#### Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Request Body
```json
{
  "titre": "Appartement moderne Centre-Ville",
  "description": "Bel appartement 3 pièces avec vue panoramique",
  "prix": 250000,
  "adresse": "Avenue Léopold Sédar Senghor",
  "ville": "Thiès",
  "superficie": 85,
  "nombrePieces": 3,
  "disponible": true,
  "caution": 500000,
  "administrateurId": 1,
  "typeLogementId": 3,
  "equipements": {
    "wifiHauteVitesse": true,
    "garagePrivé": false,
    "sécurité24h7": true,
    "climatisation": true
  },
  "images": [
    {
      "url": "https://example.com/photo1.jpg",
      "titre": "Salon",
      "lieu": "Séjour principal avec vue sur le jardin",
      "description": "Vue du salon principal",
      "ordreAffichage": 0
    }
  ],
  "images3D": [
    {
      "url": "https://tour.kaaydeuk.com/logement-1",
      "titre": "Salon",
      "lieu": "Visite 360° du salon",
      "description": "Visite 360° complète",
      "type": "360",
      "ordreAffichage": 0
    }
  ]
}
```

#### Success Response (201 Created)
```json
{
  "id": 10,
  "titre": "Appartement moderne Centre-Ville",
  "description": "Bel appartement 3 pièces avec vue panoramique",
  "prix": 250000,
  "adresse": "Avenue Léopold Sédar Senghor",
  "ville": "Thiès",
  "superficie": 85,
  "nombrePieces": 3,
  "disponible": true,
  "caution": 500000,
  "equipements": {
    "wifiHauteVitesse": true,
    "garagePrivé": false,
    "sécurité24h7": true,
    "climatisation": true
  },
  "images": [...],
  "images3D": [...],
  "dateCreation": "2026-04-16T14:00:00Z",
  "administrateurId": 1,
  "typeLogementId": 3,
  "typeLogement": { "id": 3, "libelle": "Villa" },
  "administrateur": { ... }
}
```

#### Error Response (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Non autorisé",
  "error": "Unauthorized"
}
```

---

### PUT /logements/:id
**Mettre à jour un logement** (Authentification requise)

#### Headers
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Oui | ID du logement à modifier |

#### Request Body
*(Mêmes champs que POST, tous optionnels)*

#### Success Response (200 OK)
```json
{
  "id": 1,
  "titre": "Appartement moderne Centre-Ville (Rénovéé)",
  ...
}
```

---

### DELETE /logements/:id
**Supprimer un logement** (Authentification requise)

#### Headers
```
Authorization: Bearer {JWT_TOKEN}
```

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number | Oui | ID du logement à supprimer |

#### Success Response (200 OK)
```json
{
  "message": "Logement supprimé avec succès",
  "id": 1
}
```

#### Error Response (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Logement introuvable",
  "error": "Not Found"
}
```

---

## 📦 Schema - Objects

### Image (Photographie standard)
```typescript
{
  url: string;                    // URL de l'image
  titre: string;                  // Titre (ex: "Salon", "Chambre", "Cour")
  lieu: string;                   // Localisation (ex: "Séjour principal avec vue sur le jardin")
  description?: string;           // Description optionnelle
  ordreAffichage: number;        // Ordre d'affichage (0, 1, 2, ...)
}
```

### Image3D (Visite 360° / Panorama)
```typescript
{
  url: string;                    // URL de la visite 3D
  titre: string;                  // Titre (ex: "Salon", "Chambre", "Cour")
  lieu: string;                   // Localisation (ex: "Visite 360° du salon")
  type: '360' | 'panorama' | 'matterport';  // Type de visite
  description?: string;           // Description optionnelle
  ordreAffichage: number;        // Ordre d'affichage
}
```

### Equipement (Propriétés du logement)
```typescript
{
  wifiHauteVitesse?: boolean;     // WiFi Haute Vitesse disponible
  garagePrivé?: boolean;          // Garage Privé disponible
  sécurité24h7?: boolean;         // Sécurité 24/7 disponible
  climatisation?: boolean;        // Climatisation disponible
}
```

---

## 🔒 Authentication

Certains endpoints requièrent une authentification JWT. Après login :

```bash
curl -X POST "http://localhost:3000/api/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@kaaydeuk.com",
    "motDePasse": "Admin@KaayDeuk2025!"
  }'
```

Réponse :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

Utiliser le token dans les headers :
```
Authorization: Bearer {accessToken}
```

---

## 🎯 Notes d'utilisation

- **Pagination** : Par défaut `page=1, limit=10`. Pour récupérer tous les logements, augmentez `limit`.
- **Filtres** : Combinez plusieurs filtres pour affiner les résultats.
- **Images optionnelles** : Vous pouvez créer un logement sans images et les ajouter plus tard avec PUT.
- **Équipements au logement** : Les équipements (WiFi, Garage, Sécurité, Climatisation) sont maintenant au niveau du logement, pas au niveau des images.
- **Ordre d'affichage** : Utilisez `ordreAffichage` pour contrôler la position des images dans le frontend.

---

## 📧 Support

Pour des questions ou bugs, contactez l'équipe de développement.
