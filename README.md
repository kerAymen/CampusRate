# CampusRate

CampusRate est une API REST développée avec NestJS permettant de consulter des endroits et services d'un campus et de publier des appréciations accompagnées d'une note.

L'API permet de gérer les endroits, leurs appréciations et leurs évaluations. Les données sont conservées dans MongoDB à l'aide de Mongoose afin de rester disponibles après le redémarrage de l'application.

Le TP2 fait évoluer l'API du TP1 en remplaçant la persistance JSON par MongoDB, en renforçant la validation et la sécurité HTTP, tout en conservant autant que possible le contrat REST existant.

## Fonctionnalités

CampusRate permet de :

- créer, consulter, modifier et supprimer des endroits;
- publier des appréciations associées à un endroit;
- consulter, modifier et supprimer des appréciations;
- calculer automatiquement la note moyenne et le nombre      d'appréciations d'un endroit;
- filtrer les endroits par catégorie et paginer les résultats;
- obtenir le nombre d'endroits par catégorie à l'aide d'une agrégation MongoDB;
- valider les données reçues et refuser les propriétés inconnues;
- protéger les propriétés contrôlées par le serveur;
- retourner les erreurs;
- conserver les données dans MongoDB;
- appliquer des mécanismes de sécurité HTTP avec CORS et Helmet;
- consulter la documentation avec Swagger UI et tester les opérations.

## Technologies utilisées

- Node.js
- TypeScript
- NestJS
- MongoDB et Mongoose
- `class-validator` et `class-transformer`
- `@nestjs/config` et Joi
- Helmet et `@nestjs/throttler`
- Swagger / OpenAPI
- Postman
- Jest
- OXLint
- Prettier

## Prérequis

Avant d'installer CampusRate, il faut disposer de :

- Node.js et npm;
- Git;
- MongoDB installé localement ou une instance MongoDB accessible.

L'instance MongoDB doit être accessible avant le démarrage de l'application.

## Installation

Cloner le dépôt :

```bash
git clone https://github.com/kerAymen/CampusRate.git
```

Accéder au dossier du projet :

```bash
cd CampusRate
```

Installer les dépendances :

```bash
npm ci
```

## Configuration

CampusRate utilise des variables d'environnement pour configurer le port de l'application et la connexion à MongoDB.

Le fichier `.env.example` contient :

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/campusrate
```

Créer un fichier `.env` à partir de `.env.example`.

Sous macOS ou Linux :

```bash
cp .env.example .env
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

| Variable | Description | Valeur d'exemple |
|---|---|---|
| `PORT` | Port de l'application | `3000` |
| `MONGO_URI` | URI de connexion à MongoDB | `mongodb://127.0.0.1:27017/campusrate` |

La variable `MONGO_URI` est obligatoire. Les variables sont validées au démarrage avec Joi. Le port par défaut est `3000`.

L'exemple utilise MongoDB en local sur le port `27017`, avec la base de données `campusrate`. Pour utiliser une instance distante, adapter `MONGO_URI`.

Le fichier `.env` ne doit pas être versionné. Aucun mot de passe MongoDB, jeton, secret ou chaîne de connexion sensible ne doit être publié dans le dépôt.

## Démarrage

Démarrer l'application :

```bash
npm run start
```

Pour démarrer en mode développement avec rechargement automatique :

```bash
npm run start:dev
```

Avec la configuration d'exemple, l'application écoute sur le port `3000` et se connecte à la base MongoDB configurée.

## Documentation Swagger / OpenAPI

Après le démarrage, la documentation Swagger UI est accessible à l'adresse :

```text
http://localhost:3000/docs
```

Le document OpenAPI JSON est configuré à l'adresse :

```text
http://localhost:3000/docs/openapi.json
```

Swagger décrit les ressources, les paramètres, les corps de requête, les principales contraintes de validation et les réponses HTTP. Les opérations peuvent également être testées avec Postman.

## Contrat général de l'API

L'API conserve le préfixe `/v1`. Le passage de JSON à MongoDB est un changement interne qui ne nécessite pas, à lui seul, une nouvelle version du contrat HTTP.

Les ressources principales sont :

- `places` : les endroits et services du campus;
- `reviews` : les appréciations associées aux endroits.

### Endpoints principaux

| Méthode | URI | Description |
|---|---|---|
| `POST` | `/v1/places` | Créer un endroit |
| `GET` | `/v1/places` | Lister les endroits |
| `GET` | `/v1/places/stats/categories` | Compter les endroits par catégorie |
| `GET` | `/v1/places/:id` | Consulter un endroit |
| `PATCH` | `/v1/places/:id` | Modifier partiellement un endroit |
| `DELETE` | `/v1/places/:id` | Supprimer un endroit |
| `POST` | `/v1/places/:placeId/reviews` | Publier une appréciation |
| `GET` | `/v1/places/:placeId/reviews` | Lister les appréciations d'un endroit |
| `GET` | `/v1/reviews/:id` | Consulter une appréciation |
| `PATCH` | `/v1/reviews/:id` | Modifier partiellement une appréciation |
| `DELETE` | `/v1/reviews/:id` | Supprimer une appréciation |

### Filtrage et pagination

`GET /v1/places` permet de filtrer les endroits par catégorie et de paginer les résultats.

| Paramètre | Description | Valeur par défaut |
|---|---|---|
| `category` | Catégorie à filtrer | Aucun filtre |
| `page` | Numéro de page | `1` |
| `limit` | Nombre d'endroits par page | `10` |

Exemple :

```http
GET /v1/places?category=LIBRARY&page=1&limit=10
```

Structure de réponse (exemple sans résultat) :

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 0,
    "totalPages": 0
  }
}
```

Le filtrage est effectué avec une condition explicite sur `category`, et la pagination utilise les opérations MongoDB `skip` et `limit`.

### Statistiques par catégorie

```http
GET /v1/places/stats/categories
```

Cette route utilise une agrégation MongoDB avec `$group` et `$sum` pour compter les endroits de chaque catégorie.

Exemple de réponse :

```json
[
  { "_id": "LIBRARY", "total": 3 },
  { "_id": "STUDY_SPACE", "total": 5 }
]
```

## Choix de conception de l'API

| Élément | Choix | Justification |
|---|---|---|
| Noms des ressources | `places` et `reviews` | Noms anglais, au pluriel, en minuscules et sans verbe d'action. |
| Versionnement | `/v1` | Le changement de persistance ne justifie pas une nouvelle version HTTP. |
| Imbrication | `/places/:placeId/reviews` | Une appréciation est liée à un endroit; elle peut ensuite être consultée directement par `/reviews/:id`. |
| `201 Created` | Création | L'en-tête `Location` indique l'URI de la ressource créée. |
| `200 OK` | Consultation et modification | Une représentation de la ressource ou de la collection est retournée. |
| `204 No Content` | Suppression | Aucun corps de réponse n'est retourné. |
| `400 Bad Request` | Données invalides | Les données ne respectent pas les validations. |
| `404 Not Found` | Ressource inexistante | L'endroit ou l'appréciation demandé n'existe pas. |
| `409 Conflict` | Conflit | Une règle métier interdit la suppression ou une valeur unique existe déjà. |
| `413 Payload Too Large` | Corps JSON trop volumineux | La limite configurée est dépassée. |
| `429 Too Many Requests` | Trop de requêtes | La limite de trafic est dépassée. |

## Validation et règles métier

Les données reçues sont validées avec des DTO et `class-validator`. Le `ValidationPipe` global utilise `whitelist: true` et `forbidNonWhitelisted: true` pour refuser les propriétés inconnues.

### Endroits

Pour créer un endroit :

- `name`, `description`, `category` et `address` sont obligatoires;
- le nom, la description et l'adresse doivent être des chaînes non vides;
- `category` doit appartenir aux catégories autorisées;
- `services` est facultatif et doit être un tableau de chaînes sans doublons;
- `status` est facultatif et doit appartenir aux états autorisés.

Catégories autorisées : `STUDY_SPACE`, `LIBRARY`, `FOOD_SERVICE`, `SPORTS`, `STUDENT_SERVICE`, `COMPUTER_LAB`, `OTHER`.

États autorisés : `ACTIVE`, `TEMPORARILY_CLOSED`, `INACTIVE`.

### Appréciations

- `authorName` est obligatoire et doit être une chaîne non vide;
- `rating` doit être un entier de `1` à `5`;
- `comment` est obligatoire et doit contenir de `1` à `500` caractères;
- une appréciation ne peut être créée que pour un endroit existant.

### Champs contrôlés par le serveur

Les champs `id`, `createdAt`, `updatedAt`, `averageRating` et `reviewCount` sont contrôlés par l'application. Ils ne font pas partie des DTO acceptés pour la création ou la modification.

Les identifiants sont générés par le serveur et les dates sont gérées automatiquement par Mongoose. Les services sélectionnent explicitement les propriétés envoyées aux opérations MongoDB plutôt que de transmettre directement les objets reçus du client.

### Règles métier

- Un endroit possédant des appréciations ne peut pas être supprimé.
- Les champs `averageRating` et `reviewCount` sont recalculés lorsqu'une appréciation est créée, modifiée ou supprimée.
- Sans appréciation, `averageRating` vaut `null` et `reviewCount` vaut `0`.

## Sécurité HTTP

### CORS

CORS est configuré explicitement. En environnement de développement, l'origine autorisée est `http://localhost:3000`. Dans la configuration actuelle, l'autorisation CORS pour les origines externes est désactivée en production.

Les méthodes déclarées sont `GET`, `POST`, `PATCH` et `DELETE`. CORS encadre certaines requêtes effectuées par les navigateurs, mais ne constitue pas une authentification.

### Helmet

Helmet ajoute des en-têtes HTTP de sécurité pour renforcer la protection de l'application face à certains risques liés aux navigateurs.

### Protection des entrées

La validation globale refuse les propriétés inconnues. Les filtres MongoDB et les propriétés utilisées lors des mises à jour sont construits explicitement dans les services.

## Gestion des erreurs

Un filtre global uniformise les erreurs HTTP et les erreurs techniques inattendues.

Les situations prises en charge comprennent notamment :

- `400 Bad Request` : données invalides;
- `404 Not Found` : ressource inexistante;
- `409 Conflict` : conflit métier ou duplication d'une valeur unique MongoDB;
- `413 Payload Too Large` : corps JSON dépassant `50 Ko`;
- `429 Too Many Requests` : dépassement du seuil de requêtes;
- `500 Internal Server Error` : erreur technique inattendue.

Les réponses d'erreur utilisent le type de contenu `application/problem+json` et le format Problem Details, avec `type`, `title`, `status`, `detail` et `instance`. Le filtre peut également inclure un champ `errors` lorsque des détails de validation sont disponibles.

Les détails techniques internes des erreurs inattendues ne sont pas renvoyés au client.

## Persistance MongoDB et Mongoose

Les données sont stockées dans MongoDB et accessibles au moyen de Mongoose. La connexion utilise `MongooseModule` et la variable d'environnement `MONGO_URI`, chargée par `database.config.ts`.

### Modèles et relations

- `PlaceSchema` définit les endroits, leurs informations, leur état et les évaluations calculées.
- `ReviewSchema` définit les appréciations, leur note, leur commentaire et leur association à un endroit par `placeId`.

Les endroits et les appréciations sont enregistrés dans des collections distinctes. Chaque schéma utilise les timestamps automatiques de Mongoose pour `createdAt` et `updatedAt`.

### Opérations MongoDB

Les services utilisent notamment :

- `find` et `findOne` pour les consultations;
- `create` pour les créations;
- `findOneAndUpdate` pour les modifications;
- `deleteOne` pour les suppressions;
- `countDocuments` pour la pagination;
- `aggregate` pour les statistiques par catégorie.

Les contrôleurs gèrent les routes HTTP, les services appliquent les règles métier et les modèles Mongoose effectuent les opérations sur la base de données. Le stockage JSON du TP1 n'est plus utilisé.

### Index et agrégation

Un index est défini sur `category` pour les endroits. Un index unique sur `id` est défini dans chacun des deux schémas. Les erreurs de duplication MongoDB (`11000`) sont converties en réponses `409 Conflict`.

La méthode `countByCategory()` utilise une agrégation MongoDB pour compter les endroits par catégorie.

## Structure du projet

```text
CampusRate/
├── src/
│   ├── common/
│   │   ├── dto/
│   │   │   └── problem-details.dto.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── middleware/
│   │       └── request-logger.middleware.ts
│   ├── config/
│   │   └── database.config.ts
│   ├── places/
│   │   ├── dto/
│   │   │   ├── create-place.dto.ts
│   │   │   ├── response-place.dto.ts
│   │   │   └── update-place.dto.ts
│   │   ├── entities/
│   │   │   └── place.entity.ts
│   │   ├── schemas/
│   │   │   └── place.schema.ts
│   │   ├── places.controller.ts
│   │   ├── places.module.ts
│   │   └── places.service.ts
│   ├── reviews/
│   │   ├── dto/
│   │   │   ├── create-review.dto.ts
│   │   │   ├── response-review.dto.ts
│   │   │   └── update-review.dto.ts
│   │   ├── entities/
│   │   │   └── review.entity.ts
│   │   ├── schemas/
│   │   │   └── review.schema.ts
│   │   ├── reviews.controller.ts
│   │   ├── reviews.module.ts
│   │   └── reviews.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── configure-swagger.ts
│   └── main.ts
├── test/
├── .env.example
├── .gitignore
├── .prettierrc
├── jest.config.ts
├── nest-cli.json
├── oxlint.json
├── package.json
├── package-lock.json
├── README.md
└── scenarios-verification-tp2.md
```

Le projet est organisé par fonctionnalités : `places` et `reviews` contiennent leurs contrôleurs, services, DTO et schémas Mongoose; `config` contient la configuration MongoDB; `common` regroupe les éléments partagés, notamment le filtre d'exceptions et le middleware de journalisation. `configure-swagger.ts` centralise Swagger et `main.ts` initialise l'application.

## Vérification de l'API

Les opérations peuvent être vérifiées avec Swagger UI ou Postman. Les huit scénarios obligatoires du TP2 sont :

1. Créer une ressource valide.
2. Consulter une ressource persistée dans MongoDB.
3. Vérifier la persistance après redémarrage de l'API.
4. Tenter une création avec une propriété obligatoire absente.
5. Envoyer une valeur invalide pour une propriété contrôlée.
6. Envoyer une propriété inconnue ou interdite.
7. Effectuer une modification valide.
8. Tenter de modifier un champ contrôlé par le serveur.


## Commandes utiles

### Lint

```bash
npm run lint
```

### Compilation

```bash
npm run build
```

### Tests

```bash
npm run test
```

Avec couverture :

```bash
npm run test:cov
```


### Vérification avant la remise

```bash
npm ci
npm run lint
npm run build
```


## Limites connues

- L'API ne possède pas de système d'authentification ou de gestion des utilisateurs.
- La configuration CORS actuelle doit être adaptée pour autoriser un client Web externe en production.
- L'application nécessite une instance MongoDB accessible pour fonctionner.


## Fonctionnalités optionnelles


## Fonctionnalités optionnelles réalisées

| Profil | Options réalisées | Total indicatif |
|---|---|---|
| MongoDB | M1 (+6) + M2 (+4) + M3 (+2) | **+12** |
| Sécurité HTTP | H1 (+4) + H2 (+2) + H4 (+2) + H5 (+1) | **+9** |
| Protection des données | P1 (+2) + P2 (+2) | **+4** |
| Journalisation | L1 (+3) + L2 (+3) | **+6** |
| **Total des fonctionnalités optionnelles** | **11 fonctionnalités** | **+31 points(maximum de 30 points comptabilisés)** |



### M1 — Index MongoDB

Un index a été ajouté

Un index unique sur id permet d'éviter les doublons

Les erreurs de duplication MongoDB sont gérées

### M2 — Agrégation MongoDB

Une agrégation MongoDB permet de compter le nombre d'endroits par catégorie 

### M3 — Choix entre référence et imbrication

Pour CampusRate, j'ai choisi de stocker les endroits et les avis dans deux collections séparées: places et reviews.

Chaque avis contient un placeId qui permet de retrouver l'endroit associé.

J'ai choisi cela car un endroit peut avoir plusieurs avis. Cela permet de gérer les avis séparément, même si certaines informations de l'endroit doivent être mises à jour.

L'imbrication aurait aussi été possible, mais les documents des endroits auraient pu devenir plus gros avec l'ajout des avis.


### H1 Ajouter du rate limiting
Une limite de 100 requêtes par minute a été ajoutée avec Throttler.

### H2 Limiter la taille du corps HTTP et gérer 413
La taille des requêtes JSON est limitée à 50 Ko. Une erreur 413 est retournée si la limite est dépassée.

### H4 Restreindre davantage CORS selon l’environnement
CORS est configuré selon l'environnement

### H5 Restreindre explicitement les méthodes HTTP autorisées
Les méthodes GET, POST, PATCH et DELETE sont définies dans la configuration CORS.

### P1 Utiliser une allowlist explicite de filtres
Le filtrage MongoDB utilise  le champ category.

### P2 Sélection explicite des propriétés modifiables
Les propriétés modifiables sont sélectionnées explicitement.

### L1 Ajouter une journalisation des opérations normales de l’API avec un middleware
Un middleware journalise les requêtes HTTP avec la méthode, le path, le statut et la durée.

### L2 ajout de la journalisation des erreurs 
Les erreurs sont journalisées 
