# 🔧 GUIDE DE DÉPANNAGE

## ❌ Problèmes Backend (Spring Boot)

### Erreur: "Cannot connect to database"

**Symptômes**: Le backend ne démarre pas, erreur de connexion MySQL

**Solutions**:
1. Vérifiez que MySQL est démarré dans XAMPP
   ```
   Ouvrez XAMPP Control Panel → Start MySQL
   ```

2. Vérifiez que le port 3306 n'est pas bloqué
   ```powershell
   netstat -an | findstr :3306
   ```

3. Vérifiez le mot de passe MySQL dans `application.properties`
   ```properties
   spring.datasource.password=
   ```
   (Par défaut XAMPP: vide)

4. Créez manuellement la base de données
   - Ouvrez phpMyAdmin: http://localhost/phpmyadmin
   - Créez une base nommée: `worldcupdb`

---

### Erreur: "Port 8080 already in use"

**Symptômes**: Le backend ne démarre pas, port déjà utilisé

**Solutions**:
1. Trouvez le processus utilisant le port 8080
   ```powershell
   netstat -ano | findstr :8080
   ```

2. Tuez le processus
   ```powershell
   taskkill /PID [numéro_du_pid] /F
   ```

3. OU changez le port dans `application.properties`
   ```properties
   server.port=8081
   ```
   **IMPORTANT**: Si vous changez le port, mettez à jour aussi tous les services frontend!

---

### Erreur: "mvnw.cmd not found"

**Symptômes**: Le script ne trouve pas mvnw.cmd

**Solutions**:
1. Assurez-vous d'être dans le dossier backend
   ```powershell
   cd c:\Users\PC\Desktop\projet\worldcup\backend
   .\mvnw.cmd spring-boot:run
   ```

2. Si mvnw.cmd n'existe pas, utilisez Maven directement
   ```powershell
   mvn spring-boot:run
   ```

---

### Erreur: "Java version incompatible"

**Symptômes**: Erreur de version Java

**Solutions**:
1. Vérifiez votre version Java
   ```powershell
   java -version
   ```
   Vous avez besoin de Java 17 ou supérieur

2. Téléchargez Java 17+
   - Oracle JDK: https://www.oracle.com/java/technologies/downloads/
   - OpenJDK: https://adoptium.net/

3. Mettez à jour la variable d'environnement JAVA_HOME

---

## ❌ Problèmes Frontend (Angular)

### Erreur: "npm not recognized"

**Symptômes**: La commande npm n'est pas reconnue

**Solutions**:
1. Installez Node.js
   - Téléchargez: https://nodejs.org/
   - Version recommandée: LTS (Long Term Support)

2. Redémarrez le terminal après installation

3. Vérifiez l'installation
   ```powershell
   node --version
   npm --version
   ```

---

### Erreur: "Port 4200 already in use"

**Symptômes**: Angular ne démarre pas, port déjà utilisé

**Solutions**:
1. Trouvez et tuez le processus
   ```powershell
   netstat -ano | findstr :4200
   taskkill /PID [numéro_du_pid] /F
   ```

2. OU démarrez sur un autre port
   ```powershell
   ng serve --port 4201
   ```
   **IMPORTANT**: Mettez à jour `allowed.origins` dans application.properties!

---

### Erreur: "Cannot GET /api/..."

**Symptômes**: Erreur 404 ou CORS lors des appels API

**Solutions**:
1. Vérifiez que le backend est démarré
   - Accédez à: http://localhost:8080/api
   - Vous devriez voir une réponse ou une page Whitelabel Error

2. Vérifiez que le port est correct dans les services
   ```typescript
   private apiUrl = 'http://localhost:8080/api';
   ```

3. Vérifiez la configuration CORS dans application.properties
   ```properties
   allowed.origins=http://localhost:4200
   ```

---

### Erreur: "Module not found"

**Symptômes**: Erreur d'import de modules Angular

**Solutions**:
1. Réinstallez les dépendances
   ```powershell
   cd frontend
   rmdir /s /q node_modules
   del package-lock.json
   npm install
   ```

2. Nettoyez le cache Angular
   ```powershell
   rmdir /s /q .angular
   ```

3. Redémarrez le serveur
   ```powershell
   npm start
   ```

---

## ❌ Problèmes MySQL/XAMPP

### Erreur: "MySQL won't start"

**Symptômes**: MySQL ne démarre pas dans XAMPP

**Solutions**:
1. Le port 3306 est peut-être utilisé par un autre service
   ```powershell
   netstat -ano | findstr :3306
   ```

2. Vérifiez les logs XAMPP
   - Cliquez sur "Logs" dans XAMPP Control Panel
   - Regardez mysql_error.log

3. Essayez de changer le port MySQL dans XAMPP
   - Éditez my.ini
   - Changez le port
   - Mettez à jour application.properties

4. Redémarrez votre ordinateur

---

### Erreur: "Access denied for user 'root'"

**Symptômes**: Erreur d'authentification MySQL

**Solutions**:
1. Vérifiez le mot de passe dans application.properties
   ```properties
   spring.datasource.password=
   ```

2. Réinitialisez le mot de passe MySQL dans XAMPP
   - Ouvrez phpMyAdmin
   - Allez dans "User accounts"
   - Éditez l'utilisateur root

---

## ❌ Problèmes de Compilation

### Erreur: "Compilation failed"

**Symptômes**: Le backend ou frontend ne compile pas

**Solutions Backend**:
```powershell
cd backend
.\mvnw.cmd clean
.\mvnw.cmd clean install -DskipTests
```

**Solutions Frontend**:
```powershell
cd frontend
npm cache clean --force
rmdir /s /q node_modules .angular dist
npm install
npm start
```

---

## ❌ Problèmes JWT/Authentication

### Erreur: "Token expired" ou "Invalid token"

**Symptômes**: Déconnexion automatique, erreurs d'authentification

**Solutions**:
1. Effacez le localStorage du navigateur
   - F12 → Console
   ```javascript
   localStorage.clear()
   ```

2. Vérifiez que le JWT secret est configuré
   ```properties
   jwt.secret=worldcup2030SecretKeyForJWTTokenGenerationAndValidation123456789
   ```

3. Reconnectez-vous

---

## ❌ Problèmes d'Upload de Fichiers

### Erreur: "File upload failed"

**Symptômes**: Impossible d'uploader des images

**Solutions**:
1. Vérifiez que le dossier uploads existe
   ```
   backend/uploads/hotels/
   ```

2. Vérifiez la configuration dans application.properties
   ```properties
   spring.servlet.multipart.max-file-size=10MB
   file.upload-dir=uploads/hotels
   ```

3. Vérifiez les permissions du dossier

---

## 🔄 Réinitialisation Complète

Si rien ne fonctionne, essayez une réinitialisation complète:

### 1. Nettoyez le projet
```powershell
.\clean-project.bat
```

### 2. Supprimez la base de données
- Ouvrez phpMyAdmin
- Supprimez la base `worldcupdb`

### 3. Redémarrez XAMPP
- Arrêtez tous les services
- Fermez XAMPP
- Rouvrez XAMPP
- Démarrez MySQL

### 4. Redémarrez le projet
```powershell
.\start-all.bat
```

---

## 📞 Commandes Utiles

### Vérifier les services actifs
```powershell
# Vérifier Java
java -version

# Vérifier Node.js
node --version
npm --version

# Vérifier les ports utilisés
netstat -an | findstr "3306 4200 8080"

# Voir tous les processus Java
jps
```

### Nettoyer les caches
```powershell
# Backend
cd backend
.\mvnw.cmd clean

# Frontend
cd frontend
npm cache clean --force
rmdir /s /q .angular
```

### Logs
```powershell
# Backend - Regardez le terminal où mvnw.cmd spring-boot:run s'exécute

# Frontend - Regardez le terminal où npm start s'exécute

# MySQL - Dans XAMPP: Logs → mysql_error.log
```

---

## 🆘 Toujours Bloqué?

### Checklist Finale
- [ ] MySQL est démarré dans XAMPP
- [ ] La base `worldcupdb` existe
- [ ] Java 17+ est installé
- [ ] Node.js est installé
- [ ] Les ports 3306, 4200, 8080 sont libres
- [ ] application.properties existe et est correct
- [ ] node_modules est installé (`npm install`)
- [ ] Le backend compile sans erreur
- [ ] Le frontend compile sans erreur

### Encore des problèmes?
1. Lisez les messages d'erreur complets dans les terminaux
2. Cherchez l'erreur sur Google ou Stack Overflow
3. Vérifiez les logs de MySQL dans XAMPP
4. Essayez une réinitialisation complète (voir ci-dessus)

---

## 💡 Conseils de Prévention

1. **Toujours démarrer MySQL en premier** avant le backend
2. **Ne pas modifier application.properties** si le projet fonctionne
3. **Faire des commits Git réguliers** pour pouvoir revenir en arrière
4. **Documenter vos changements** de configuration
5. **Tester après chaque changement** important

---

Bonne chance! 🍀
