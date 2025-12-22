# 🚀 GUIDE RAPIDE DE DÉMARRAGE

## 📌 EN 3 ÉTAPES SIMPLES

### Étape 1: Vérifier les prérequis ✅
Double-cliquez sur: **`check-requirements.bat`**

Cela va vérifier:
- ✅ Java 17+
- ✅ Node.js
- ✅ MySQL (XAMPP)

### Étape 2: Démarrer XAMPP 🚀
1. Ouvrez **XAMPP Control Panel**
2. Cliquez sur **Start** pour **MySQL**
3. (Optionnel) Cliquez sur **Start** pour **Apache**

### Étape 3: Lancer l'application 🎯
Double-cliquez sur: **`start-all.bat`**

Cela va:
1. ✅ Démarrer le backend Spring Boot (port 8080)
2. ✅ Démarrer le frontend Angular (port 4200)
3. ✅ Ouvrir automatiquement dans votre navigateur

---

## 🌐 URLs d'accès

Une fois démarré, accédez à:

- **Frontend (Application)**: http://localhost:4200
- **Backend (API)**: http://localhost:8080/api
- **phpMyAdmin**: http://localhost/phpmyadmin

---

## 🔑 Configuration de la Base de Données

### Informations de connexion (par défaut XAMPP):
- **Nom de la base**: `worldcupdb`
- **Utilisateur**: `root`
- **Mot de passe**: _(vide)_
- **Host**: `localhost`
- **Port**: `3306`

### La base de données sera créée automatiquement au premier démarrage!

---

## 🛑 Arrêter l'application

Pour arrêter les serveurs:
1. Fermez les fenêtres de terminal du backend et frontend
2. Ou appuyez sur `Ctrl+C` dans chaque terminal

---

## 📂 Structure des Fichiers

```
worldcup/
├── start-all.bat              ← Double-cliquez ici pour tout démarrer
├── start-backend.bat          ← Démarrer seulement le backend
├── start-frontend.bat         ← Démarrer seulement le frontend
├── check-requirements.bat     ← Vérifier les prérequis
├── GUIDE_DEMARRAGE.md        ← Guide détaillé
├── README.md                  ← Documentation complète
│
├── backend/                   ← API Spring Boot
│   ├── src/main/resources/
│   │   └── application.properties  ← Configuration (créé automatiquement)
│   └── pom.xml
│
├── frontend/                  ← Application Angular
│   ├── src/
│   └── package.json
│
└── database/                  ← Scripts SQL
    └── create-database.sql
```

---

## ❓ Problèmes Courants

### ❌ "Port 8080 already in use"
**Solution**: Un autre programme utilise le port 8080
- Fermez les autres applications Java
- Ou changez le port dans `backend/src/main/resources/application.properties`:
  ```properties
  server.port=8081
  ```

### ❌ "Cannot connect to database"
**Solution**: MySQL n'est pas démarré
1. Ouvrez XAMPP Control Panel
2. Cliquez sur "Start" pour MySQL
3. Redémarrez le backend

### ❌ "mvnw.cmd not found"
**Solution**: Vous n'êtes pas dans le bon dossier
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### ❌ "npm not recognized"
**Solution**: Node.js n'est pas installé ou pas dans le PATH
- Téléchargez et installez Node.js: https://nodejs.org/
- Redémarrez votre terminal après l'installation

---

## 🔐 Comptes par Défaut

### Admin (à créer via l'inscription)
- **Email**: admin@worldcup.ma
- **Password**: Admin123!

### Utilisateur Test
- **Email**: user@example.com
- **Password**: User123!

---

## 📞 Besoin d'aide?

1. Lisez le **[GUIDE_DEMARRAGE.md](GUIDE_DEMARRAGE.md)** pour plus de détails
2. Consultez les logs dans les terminaux backend/frontend
3. Vérifiez que tous les prérequis sont installés

---

## ✅ Checklist de Démarrage

- [ ] Java 17+ installé
- [ ] Node.js installé
- [ ] XAMPP installé
- [ ] MySQL démarré dans XAMPP
- [ ] Base de données `worldcupdb` créée (ou sera créée auto)
- [ ] Exécuté `check-requirements.bat` ✓
- [ ] Exécuté `start-all.bat` ✓
- [ ] Accédé à http://localhost:4200 ✓

---

## 🎉 C'est Parti!

Votre application WorldCup 2030 est maintenant prête à l'emploi!

Bon développement! 🚀
