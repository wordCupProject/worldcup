# Guide de Démarrage - WorldCup 2030

## Prérequis

1. **Java 17** ou supérieur installé
2. **Node.js** (version 18+) et npm installés
3. **XAMPP** avec MySQL démarré
4. **Maven** (ou utiliser mvnw fourni)

## Configuration de la Base de Données

### 1. Démarrer XAMPP
- Lancez XAMPP Control Panel
- Démarrez **Apache** et **MySQL**

### 2. Créer la Base de Données
- Ouvrez phpMyAdmin: http://localhost/phpmyadmin
- Créez une nouvelle base de données nommée: `worldcupdb`
- Ou la base sera créée automatiquement au démarrage du backend

## Démarrage du Backend (Spring Boot)

### Option 1: Avec Maven Wrapper (Recommandé)
```powershell
cd backend
.\mvnw.cmd clean install
.\mvnw.cmd spring-boot:run
```

### Option 2: Avec Maven installé
```powershell
cd backend
mvn clean install
mvn spring-boot:run
```

Le backend sera accessible sur: **http://localhost:8080/api**

## Démarrage du Frontend (Angular)

### 1. Installer les dépendances
```powershell
cd frontend
npm install
```

### 2. Démarrer le serveur de développement
```powershell
npm start
```

Le frontend sera accessible sur: **http://localhost:4200**

## Configuration OAuth2 Google (Optionnel)

Si vous voulez activer la connexion Google:

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet et activez Google+ API
3. Créez des identifiants OAuth 2.0
4. Modifiez `backend/src/main/resources/application.properties`:
   ```properties
   spring.security.oauth2.client.registration.google.client-id=VOTRE_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=VOTRE_CLIENT_SECRET
   ```

## Ports Utilisés

- **Backend**: 8080
- **Frontend**: 4200
- **MySQL**: 3306

## Structure du Projet

```
worldcup/
├── backend/           # API Spring Boot
│   ├── src/
│   └── pom.xml
├── frontend/          # Application Angular
│   ├── src/
│   └── package.json
└── docker-compose.yml # Configuration Docker (optionnel)
```

## Résolution des Problèmes

### Erreur de connexion à MySQL
- Vérifiez que MySQL est démarré dans XAMPP
- Vérifiez que le port 3306 n'est pas utilisé par un autre service
- Mot de passe par défaut dans XAMPP: (vide)

### Port 8080 déjà utilisé
Modifiez dans `application.properties`:
```properties
server.port=8081
```

### Port 4200 déjà utilisé
Démarrez Angular sur un autre port:
```powershell
ng serve --port 4201
```

## Commandes Utiles

### Backend
```powershell
# Nettoyer et compiler
.\mvnw.cmd clean install

# Lancer les tests
.\mvnw.cmd test

# Créer un package JAR
.\mvnw.cmd package
```

### Frontend
```powershell
# Installer les dépendances
npm install

# Démarrer en mode développement
npm start

# Builder pour la production
npm run build

# Lancer les tests
npm test
```

## Informations de Configuration

### Base de Données
- **URL**: jdbc:mysql://localhost:3306/worldcupdb
- **Utilisateur**: root
- **Mot de passe**: (vide par défaut)

### JWT
- **Secret**: Configuré dans application.properties
- **Expiration**: 24 heures (86400000 ms)

### Upload de Fichiers
- **Taille max**: 10MB
- **Dossier**: backend/uploads/hotels/

## Contact & Support

Pour toute question ou problème, consultez la documentation ou créez une issue.
