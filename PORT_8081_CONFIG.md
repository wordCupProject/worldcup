# ⚙️ CONFIGURATION PORT 8081

## 🔄 Changements Effectués

### ✅ Backend configuré sur le port 8081

Le backend Spring Boot utilisera maintenant le port **8081** au lieu de 8080.

**Fichier modifié**: `backend/src/main/resources/application.properties`
```properties
server.port=8081
```

### ✅ Tous les services frontend mis à jour

Tous les services Angular pointent maintenant vers **http://localhost:8081/api**

**Fichiers modifiés**:
- ✅ `frontend/src/environments/environment.ts`
- ✅ `frontend/src/environments/environment.prod.ts`
- ✅ `frontend/src/app/services/auth.service.ts`
- ✅ `frontend/src/app/services/hotel.service.ts`
- ✅ `frontend/src/app/services/user.service.ts`
- ✅ `frontend/src/app/services/payment.service.ts`
- ✅ `frontend/src/app/services/transport.service.ts`
- ✅ `frontend/src/app/services/hotel.reservation.service.ts`

---

## 🚀 Comment Démarrer Maintenant

### Option 1: Utiliser les scripts (Recommandé)

Les scripts ont été mis à jour automatiquement pour utiliser le port 8081.

```powershell
# Démarrer tout
.\start-all.bat

# OU séparément:
.\start-backend.bat    # Backend sur port 8081
.\start-frontend.bat   # Frontend sur port 4200
```

### Option 2: Démarrage Manuel

#### 1. Démarrer le Backend (port 8081)
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Le backend sera accessible sur: **http://localhost:8081/api**

#### 2. Démarrer le Frontend (port 4200)
```powershell
cd frontend
npm install    # Déjà fait si vous avez exécuté la commande
npm start
```

Le frontend sera accessible sur: **http://localhost:4200**

---

## 🌐 Nouvelles URLs

| Service | Ancienne URL | Nouvelle URL |
|---------|--------------|--------------|
| Backend API | http://localhost:8080/api | **http://localhost:8081/api** |
| Frontend | http://localhost:4200 | http://localhost:4200 (inchangé) |
| MySQL | localhost:3306 | localhost:3306 (inchangé) |

---

## ✅ Vérification

Pour vérifier que le backend est bien sur le port 8081:

1. Démarrez le backend
2. Ouvrez votre navigateur
3. Allez sur: **http://localhost:8081/api**
4. Vous devriez voir une page (même une erreur Whitelabel Error Page confirme que le serveur fonctionne)

---

## 📝 Notes Importantes

### ⚠️ Si vous changez à nouveau le port

Si vous devez changer le port backend à l'avenir, vous devez mettre à jour:

1. **Backend**: `backend/src/main/resources/application.properties`
   ```properties
   server.port=NOUVEAU_PORT
   ```

2. **Frontend - Environnements**:
   - `frontend/src/environments/environment.ts`
   - `frontend/src/environments/environment.prod.ts`

3. **Frontend - Services** (si vous n'utilisez pas les fichiers d'environnement):
   - `auth.service.ts`
   - `hotel.service.ts`
   - `user.service.ts`
   - `payment.service.ts`
   - `transport.service.ts`
   - `hotel.reservation.service.ts`

---

## 🎯 Prochaines Étapes

1. ✅ Les dépendances npm sont en cours d'installation
2. ⏳ Attendez la fin de l'installation (peut prendre quelques minutes)
3. 🚀 Démarrez MySQL dans XAMPP
4. 🚀 Lancez `start-all.bat` ou démarrez manuellement

---

## ✅ Checklist de Démarrage

- [ ] MySQL démarré dans XAMPP
- [ ] npm install terminé (en cours...)
- [ ] Backend démarré sur port 8081
- [ ] Frontend démarré sur port 4200
- [ ] Accessible sur http://localhost:4200

---

Date de configuration: 21 décembre 2025
Port Backend: **8081**
Port Frontend: **4200**
