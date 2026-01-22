# Déploiement sur Vercel

## Prérequis

1. Compte GitHub avec votre code poussé
2. Compte Vercel (gratuit)
3. MongoDB Atlas configuré
4. Gmail configuré avec mot de passe d'application

## Étapes de déploiement

### 1. Préparer le dépôt GitHub

```bash
git add .
git commit -m "Prêt pour Vercel"
git push origin main
```

### 2. Créer un compte Vercel

- Allez sur [vercel.com](https://vercel.com)
- Inscrivez-vous avec GitHub
- Autorisez Vercel à accéder à vos dépôts

### 3. Importer le projet

1. Cliquez sur "Add New..." → "Project"
2. Sélectionnez votre dépôt GitHub
3. Configurez le projet:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4. Configurer les variables d'environnement

Dans les paramètres du projet Vercel, ajoutez sous "Environment Variables":

- `MONGODB_URI`: Votre connection string MongoDB Atlas
- `EMAIL_USER`: kpodjedojosue@gmail.com
- `EMAIL_PASSWORD`: Votre mot de passe d'application Gmail
- `EMAIL_RECIPIENT`: beckermonica83@gmail.com

### 5. Déployer

Cliquez sur "Deploy" et attendez que Vercel construise et déploie votre projet.

## Après le déploiement

Une fois déployé, vous aurez une URL Vercel (ex: `https://votre-projet.vercel.app`)

### Mettre à jour l'API frontend

Mettez à jour l'URL de l'API dans [LoginPage.tsx](src/pages/LoginPage.tsx):

Changez:
```typescript
const response = await fetch('http://localhost:5000/api/login', {
```

En:
```typescript
const response = await fetch('https://votre-projet.vercel.app/api/login', {
```

Puis poussez le changement:
```bash
git add .
git commit -m "Mise à jour URL API pour Vercel"
git push origin main
```

Vercel redéploiera automatiquement !

## Dépannage

- **Erreur 500**: Vérifiez les logs Vercel (Dashboard → Deployments → View Logs)
- **Erreur d'authentification MongoDB**: Vérifiez que votre IP est autorisée dans MongoDB Atlas
- **Emails non reçus**: Vérifiez le mot de passe d'application Gmail

## Structure du déploiement

```
Frontend (React/Vite)
    ↓
Vercel (Static + API Routes)
    ↓
Backend (Node.js/Express)
    ↓
MongoDB Atlas
    ↓
Gmail (Notifications)
```
