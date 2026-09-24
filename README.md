# CampusRate

CampusRate est une API REST développée avec NestJS permettant de consulter des endroits et services d'un campus et de publier des appréciations accompagnées d'une note.

L'API permet de gérer les informations des endroits, leurs appréciations et leurs évaluations. Les données sont conservées localement dans un fichier JSON afin de rester disponibles après le redémarrage de l'application.

## Fonctionnalités

CampusRate permet de :

- créer, consulter, modifier et supprimer des endroits;
- publier des appréciations associées à un endroit;
- consulter, modifier et supprimer des appréciations;
- calculer automatiquement la note moyenne et le nombre d'appréciations d'un endroit;
- filtrer les endroits par catégorie;
- paginer la liste des endroits;
- valider les données reçues par l'API;
- retourner les erreurs dans un format uniforme;
- conserver les données dans un fichier JSON local;
- consulter la documentation de l'API avec Swagger UI et tester ses opérations avec Postman.

## Technologies utilisées

- Node.js
- TypeScript
- NestJS
- `class-validator`
- Swagger / OpenAPI
- JSON avec `node:fs/promises`
- Jest
- OXLint
- Prettier

## Prérequis

Avant d'installer CampusRate, il faut disposer de :

- Node.js;
- npm;
- Git.

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

CampusRate utilise des variables d'environnement pour configurer le port de l'application et l'emplacement du fichier de données.

Un fichier `.env.example` est fourni :

```env
PORT=3000
DATA_FILE_PATH=data/campus-rate.json
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

Variables disponibles :

| Variable | Description | Valeur d'exemple |
| --- | --- | --- |
| `PORT` | Port utilisé par l'application | `3000` |
| `DATA_FILE_PATH` | Chemin du fichier JSON utilisé pour la persistance | `data/campus-rate.json` |

Si ces variables ne sont pas définies, l'application utilise respectivement `3000` et `data/campus-rate.json` comme valeurs par défaut.

Le fichier `.env` contient la configuration locale et ne doit pas être versionné.

## Démarrage

Démarrer l'application :

```bash
npm run start
```

Pour démarrer l'application en mode développement avec rechargement automatique :

```bash
npm run start:dev
```

Avec la configuration par défaut, l'application démarre sur le port `3000`.

## Documentation Swagger / OpenAPI

CampusRate fournit une documentation interactive avec Swagger UI.

Après le démarrage de l'application, elle est disponible à l'adresse :

```text
http://localhost:3000/docs
```

Swagger documente les ressources, les opérations disponibles, les paramètres, les corps de requête et les principales réponses de l'API.

## Contrat général de l'API

L'API utilise le préfixe `/v1` afin d'inclure la version majeure dans ses URI.

Elle repose sur deux ressources principales :

- `places` : les endroits et services du campus;
- `reviews` : les appréciations associées aux endroits.

### Endpoints principaux

| Méthode | URI | Description |
| --- | --- | --- |
| `POST` | `/v1/places` | Créer un endroit |
| `GET` | `/v1/places` | Lister les endroits |
| `GET` | `/v1/places/:id` | Consulter un endroit |
| `PATCH` | `/v1/places/:id` | Modifier partiellement un endroit |
| `DELETE` | `/v1/places/:id` | Supprimer un endroit |
| `POST` | `/v1/places/:placeId/reviews` | Publier une appréciation pour un endroit |
| `GET` | `/v1/places/:placeId/reviews` | Lister les appréciations d'un endroit |
| `GET` | `/v1/reviews/:id` | Consulter une appréciation |
| `PATCH` | `/v1/reviews/:id` | Modifier partiellement une appréciation |
| `DELETE` | `/v1/reviews/:id` | Supprimer une appréciation |

Les détails du contrat de chaque opération sont disponibles dans Swagger UI.

### Filtrage et pagination

`GET /v1/places` prend en charge le filtrage par catégorie et la pagination.

| Paramètre | Description | Valeur par défaut |
| --- | --- | --- |
| `category` | Filtre les endroits selon leur catégorie | Aucun filtre |
| `page` | Numéro de la page | `1` |
| `limit` | Nombre d'endroits par page | `10` |

Exemple :

```http
GET /v1/places?category=LIBRARY&page=1&limit=10
```

La réponse sépare les données des informations de pagination :

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

## Choix de conception de l'API

Les principaux choix du contrat HTTP sont résumés ci-dessous.

| Élément | Choix | Justification |
| --- | --- | --- |
| Noms des ressources | `places` et `reviews` | Les noms représentent les deux concepts principaux du domaine. Ils sont en anglais, au pluriel, en minuscules et sans verbe d'action. |
| Versionnement | Préfixe `/v1` | La version majeure est incluse dans le chemin afin d'identifier clairement la version du contrat utilisée et de permettre de futures évolutions de l'API. |
| Imbrication | `/places/:placeId/reviews` pour créer et lister les appréciations | Une appréciation appartient à un endroit. L'imbrication représente cette relation lorsque le contexte de l'endroit est nécessaire. Une appréciation existante peut ensuite être adressée directement avec `/reviews/:id`. |
| `201 Created` | Création | Une nouvelle ressource a été créée avec succès et l'en-tête `Location` indique l'URI de la ressource créée. |
| `200 OK` | Consultation et modification | La requête a réussi et une représentation de la ressource ou de la collection est retournée. |
| `204 No Content` | Suppression | La suppression a réussi et aucun corps de réponse n'est retourné. |
| `400 Bad Request` | Données invalides | Les données reçues ne respectent pas les règles de validation de l'API. |
| `404 Not Found` | Ressource inexistante | L'endroit ou l'appréciation demandé n'existe pas. |
| `409 Conflict` | Suppression d'un endroit possédant des appréciations | L'endroit existe, mais son état actuel empêche sa suppression. |

## Validation et règles métier

Les données reçues sont validées avec des DTO et `class-validator`.

Un `ValidationPipe` global est configuré avec `whitelist` et `forbidNonWhitelisted`, ce qui permet de refuser les propriétés qui ne font pas partie des DTO.

Parmi les principales règles appliquées :

- une note doit être un entier compris entre `1` et `5`;
- un commentaire doit respecter les longueurs définies par l'API;
- les catégories et les états des endroits sont limités aux valeurs prévues par l'API;
- la liste des services d'un endroit ne peut pas contenir de doublons lors de sa création;
- une appréciation ne peut être créée que pour un endroit existant;
- un endroit possédant des appréciations ne peut pas être supprimé;
- `averageRating` et `reviewCount` sont calculés par le serveur et ne peuvent pas être imposés par le client.

Lorsqu'une appréciation est créée, modifiée ou supprimée, `averageRating` et `reviewCount` de l'endroit concerné sont recalculés.

## Gestion des erreurs

Un filtre global est utilisé afin d'uniformiser les réponses d'erreur de l'API.

Les principales situations prises en charge comprennent :

- `400 Bad Request` pour les données invalides;
- `404 Not Found` lorsqu'un endroit ou une appréciation n'existe pas;
- `409 Conflict` lorsqu'une suppression entre en conflit avec l'état actuel d'une ressource;
- `500 Internal Server Error` pour une erreur technique inattendue.

Les erreurs sont retournées avec le type de contenu `application/problem+json` et utilisent le format Problem Details avec les propriétés `type`, `title`, `status`, `detail` et `instance`.

## Persistance JSON

Les données de CampusRate sont conservées dans un fichier JSON local.

Par défaut, le fichier utilisé est :

```text
data/campus-rate.json
```

Le chemin peut être modifié avec la variable d'environnement `DATA_FILE_PATH`.

Le fichier contient deux collections principales :

```json
{
  "places": [],
  "reviews": []
}
```

La lecture et l'écriture du fichier sont centralisées dans `JsonStorageService`, qui utilise les opérations asynchrones de `node:fs/promises`.

Cette organisation permet de séparer l'accès aux données de la logique métier présente dans `PlacesService` et `ReviewsService`.

Si le fichier n'existe pas, le service de persistance crée le répertoire nécessaire et initialise automatiquement le fichier avec les collections `places` et `reviews`.

Si le contenu du fichier ne peut pas être interprété comme du JSON valide, l'application produit une erreur interne contrôlée.

## Structure du projet

```text
CampusRate/
├── data/
│   └── campus-rate.json
│
├── src/
│   ├── common/
│   │   ├── dto/
│   │   │   └── problem-details.dto.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   │
│   ├── persistence/
│   │   ├── json-storage.service.ts
│   │   └── persistence.module.ts
│   │
│   ├── places/
│   │   ├── dto/
│   │   │   ├── create-place.dto.ts
│   │   │   ├── response-place.dto.ts
│   │   │   └── update-place.dto.ts
│   │   ├── entities/
│   │   │   └── place.entity.ts
│   │   ├── places.controller.ts
│   │   ├── places.module.ts
│   │   └── places.service.ts
│   │
│   ├── reviews/
│   │   ├── dto/
│   │   │   ├── create-review.dto.ts
│   │   │   ├── response-review.dto.ts
│   │   │   └── update-review.dto.ts
│   │   ├── entities/
│   │   │   └── review.entity.ts
│   │   ├── reviews.controller.ts
│   │   ├── reviews.module.ts
│   │   └── reviews.service.ts
│   │
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── configure-swagger.ts
│   └── main.ts
│
├── test/
├── .env.example
├── .gitignore
├── .prettierrc
├── jest.config.ts
├── nest-cli.json
├── oxlint.json
├── package.json
└── package-lock.json
```

Le projet est organisé principalement par fonctionnalités :

- `places` regroupe le contrôleur, le service, les DTO et l'entité liés aux endroits;
- `reviews` regroupe le contrôleur, le service, les DTO et l'entité liés aux appréciations;
- `persistence` isole la lecture et l'écriture des données dans le fichier JSON;
- `common` contient les composants partagés, notamment le DTO Problem Details et le filtre HTTP global;
- les dossiers `dto` définissent les données acceptées ou retournées par l'API;
- les dossiers `entities` représentent les ressources manipulées par l'application;
- `configure-swagger.ts` centralise la configuration Swagger/OpenAPI;
- `main.ts` configure et démarre l'application.

## Vérification de l'API

L'API peut être vérifiée manuellement à partir de Swagger UI ou avec les scénarios Postman fournis avec le projet.

Les scénarios de vérification couvrent notamment :

- la création des endroits;
- la consultation des endroits;
- la création des appréciations;
- la consultation des appréciations;
- les modifications;
- les suppressions;
- une note invalide et la réponse Problem Details;
- une ressource inexistante;
- un conflit lors de la suppression d'un endroit possédant des appréciations;
- le filtrage;
- la pagination;
- la persistance des données après redémarrage.

## Commandes utiles

### Lint

Vérifier le code avec OXLint :

```bash
npm run lint
```

### Compilation

Compiler le projet :

```bash
npm run build
```

### Tests

Exécuter les tests :

```bash
npm run test
```

Exécuter les tests avec couverture :

```bash
npm run test:cov
```

### Formatage

Formater le code avec Prettier :

```bash
npm run format
```

### Vérification avant la remise

Avant la remise, exécuter :

```bash
npm ci
npm run lint
npm run build
```

## Limites connues

- La persistance repose sur un fichier JSON local plutôt que sur une base de données.
- L'API ne possède pas de système d'authentification ou de gestion des utilisateurs.