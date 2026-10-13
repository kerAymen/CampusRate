TP2 — Scénarios de vérification

Les tests ont été réalisés avec Swagger UI (http://localhost:3000/docs) et MongoDB Compass pour vérifier les données enregistrées.

1. Création d'un endroit

POST /v1/places

{
  "name": "Bibliothèque principale",
  "description": "Espace calme avec prises",
  "category": "STUDY_SPACE",
  "address": "Pavillon A, local A-210"
}

Résultat: 201 Created. L'endroit est créé avec un identifiant.

2. Vérification dans MongoDB

Dans MongoDB Compass, ouvrir la base campusrate, la collection places.

Résultat: l'endroit créé est présent avec ses informations.

3. Vérification après redémarrage

Arrêter l'API, ensuite la redémarrer avec npm run start:dev.

Faire un GET /v1/places/{id} avec l'identifiant de l'endroit créé.

Résultat: 200 OK. L'endroit existe toujours après le redémarrage.

4. Propriété obligatoire manquante

POST /v1/places

Envoyer une requête sans name :

{
  "description": "Espace calme avec prises",
  "category": "STUDY_SPACE",
  "address": "Pavillon A, local A-210"
}

Résultat: 400 Bad Request. Le nom est obligatoire.

5. Valeur invalide

POST /v1/places

{
  "name": "Bibliothèque Test",
  "description": "Espace de travail",
  "category": "CATEGORY_INVALIDE",
  "address": "Pavillon A"
}

Résultat: 400 Bad Request. La catégorie n'est pas valide.

6. Propriété inconnue

POST /v1/places

Ajouter une propriété qui n'existe pas:

{
  "name": "Salle informatique Test",
  "description": "Salle équipée d'ordinateurs",
  "category": "COMPUTER_LAB",
  "address": "Pavillon B",
  "couleur": "vert"
}

Résultat: 400 Bad Request. La propriété couleur est refusée.

7. Modification valide

PATCH /v1/places/{id}

{
  "name": "Bibliothèque bien"
}

Résultat: 200 OK. Le nom est modifié

8. Modification d'un champ serveur

PATCH /v1/places/{id}

{
  "averageRating": 4
}

Résultat: 400 Bad Request. Le champ averageRating ne peut pas être modifié directement car il est géré par le serveur.