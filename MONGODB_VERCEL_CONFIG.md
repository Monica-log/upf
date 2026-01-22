# Configuration MongoDB Atlas pour Vercel

## Étape 1: Autoriser les IP Vercel

1. Allez sur [MongoDB Atlas](https://cloud.mongodb.com)
2. Cliquez sur votre projet → **Clusters**
3. Allez à **Security** → **Network Access**
4. Cliquez sur **Add IP Address**
5. Sélectionnez **Allow access from anywhere** (ajouter `0.0.0.0/0`)
6. Cliquez **Confirm**

⚠️ Cela autorise toutes les IP. Pour plus de sécurité, vous pouvez:
- Ajouter une IP fixe de Vercel
- Utiliser une Private Link

## Étape 2: Vérifier les variables Vercel

1. Allez dans **Vercel Dashboard** → Votre projet
2. **Settings** → **Environment Variables**
3. Vérifiez que vous avez:
   - ✅ `MONGODB_URI`
   - ✅ `EMAIL_USER`
   - ✅ `EMAIL_PASSWORD`
   - ✅ `EMAIL_RECIPIENT`

## Étape 3: Redéployer

1. Dans Vercel, allez à **Deployments**
2. Cliquez sur le dernier deploiement
3. Cliquez **Redeploy**

## Étape 4: Vérifier les logs

1. Une fois redéployé, testez le formulaire
2. Allez dans **Functions** → Cliquez sur `/api/login`
3. Regardez les **Logs** pour voir les erreurs

## Variables d'environnement attendues

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-app
EMAIL_RECIPIENT=destinataire@gmail.com
```

Si MONGODB_URI contient des caractères spéciaux, échappez-les:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
