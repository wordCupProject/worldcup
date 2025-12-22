# Configuration du Projet WorldCup 2030

## 📋 Fichiers de Configuration Créés

### ✅ Backend (Spring Boot)

#### 1. application.properties
**Emplacement**: `backend/src/main/resources/application.properties`

**Configuration de base**:
- Base de données: `worldcupdb` sur localhost:3306
- Utilisateur MySQL: `root` (pas de mot de passe par défaut XAMPP)
- Port du serveur: `8080`
- Context path: `/api`
- JWT secret: configuré
- Upload de fichiers: 10MB max

**⚠️ Important**: Ce fichier est dans `.gitignore` pour protéger vos secrets!

#### 2. application.properties.example
**Emplacement**: `backend/src/main/resources/application.properties.example`

Fichier d'exemple qui peut être commité dans Git. Contient la structure sans les valeurs sensibles.

---

### ✅ Frontend (Angular)

#### 1. environment.ts
**Emplacement**: `frontend/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

#### 2. environment.prod.ts
**Emplacement**: `frontend/src/environments/environment.prod.ts`

Configuration pour la production.

---

## 🔑 Variables d'Environnement

### Backend (application.properties)

| Variable | Valeur par défaut | Description |
|----------|-------------------|-------------|
| `spring.datasource.url` | jdbc:mysql://localhost:3306/worldcupdb | URL de connexion MySQL |
| `spring.datasource.username` | root | Utilisateur MySQL |
| `spring.datasource.password` | _(vide)_ | Mot de passe MySQL |
| `server.port` | 8080 | Port du serveur backend |
| `jwt.secret` | _(auto-généré)_ | Clé secrète pour JWT |
| `jwt.expiration` | 86400000 | Durée du token (24h en ms) |
| `allowed.origins` | http://localhost:4200 | URL CORS autorisée |

### Frontend (environment.ts)

| Variable | Valeur | Description |
|----------|--------|-------------|
| `apiUrl` | http://localhost:8080/api | URL de l'API backend |

---

## 🔐 Configuration OAuth2 Google (Optionnel)

### Obtenir les identifiants Google OAuth2

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez-en un existant
3. Activez **Google+ API**
4. Allez dans **Identifiants** → **Créer des identifiants** → **ID client OAuth 2.0**
5. Configurez l'écran de consentement
6. Ajoutez les URI de redirection autorisées:
   - `http://localhost:8080/api/login/oauth2/code/google`
   - `http://localhost:8080/api/oauth2/callback/google`

7. Copiez le **Client ID** et **Client Secret**

### Mettre à jour application.properties

```properties
spring.security.oauth2.client.registration.google.client-id=VOTRE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=VOTRE_CLIENT_SECRET
```

---

## 🗄️ Configuration MySQL/XAMPP

### Par défaut dans XAMPP:
- **Host**: localhost
- **Port**: 3306
- **Username**: root
- **Password**: _(vide)_

### Si vous avez changé le mot de passe MySQL:

Modifiez dans `application.properties`:
```properties
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

---

## 🔄 Personnalisation

### Changer le port du backend

Dans `application.properties`:
```properties
server.port=8081
```

Puis mettez à jour dans `frontend/src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:8081/api'
```

### Changer le port du frontend

```powershell
cd frontend
ng serve --port 4201
```

Puis mettez à jour dans `application.properties`:
```properties
allowed.origins=http://localhost:4201
```

---

## 📁 Dossier d'Upload

Les fichiers uploadés (images d'hôtels, etc.) sont stockés dans:
```
backend/uploads/hotels/
```

Ce dossier est créé automatiquement et est dans `.gitignore`.

---

## 🔒 Sécurité

### ⚠️ Fichiers à NE JAMAIS commiter dans Git:

- ✅ `application.properties` (déjà dans .gitignore)
- ✅ `uploads/` (déjà dans .gitignore)
- ✅ `.env` files (déjà dans .gitignore)
- ✅ `node_modules/` (déjà dans .gitignore)

### ✅ Fichiers à commiter:

- ✅ `application.properties.example`
- ✅ `environment.ts` (si pas de secrets)
- ✅ Tous les scripts `.bat`
- ✅ Documentation (README, guides, etc.)

---

## 🚀 Variables pour Production

Pour un déploiement en production, modifiez:

### Backend
```properties
spring.datasource.url=jdbc:mysql://PRODUCTION_HOST:3306/worldcupdb
spring.datasource.username=PRODUCTION_USER
spring.datasource.password=STRONG_PASSWORD
jwt.secret=VERY_STRONG_SECRET_KEY_HERE
allowed.origins=https://your-domain.com
```

### Frontend
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.your-domain.com/api'
};
```

---

## 📞 Support

Pour toute question sur la configuration, consultez:
- [LIRE_MOI.md](LIRE_MOI.md) - Guide rapide
- [GUIDE_DEMARRAGE.md](GUIDE_DEMARRAGE.md) - Guide détaillé
- [README.md](README.md) - Documentation complète
