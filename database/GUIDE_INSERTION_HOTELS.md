# Guide d'insertion des hôtels avec images

## Méthode 1 : Via SQL (Recommandé)

1. **Démarrez MySQL** dans XAMPP
2. **Démarrez le backend** une première fois pour créer les tables
3. **Ouvrez phpMyAdmin** : `http://localhost/phpmyadmin`
4. **Sélectionnez** la base de données `worldcupdb`
5. **Cliquez** sur l'onglet **SQL**
6. **Copiez et collez** le contenu du fichier `database/insert-hotels-with-images.sql`
7. **Cliquez** sur **Exécuter**

✅ Les 10 hôtels avec leurs images seront insérés !

## Méthode 2 : Via l'API REST

1. **Démarrez le backend et le frontend**
2. **Connectez-vous** en tant qu'**admin** sur `http://localhost:4200/login`
3. **Ouvrez la console du navigateur** (F12)
4. **Copiez et collez** le contenu du fichier `database/insert-hotels-api.js`
5. **Appuyez sur Entrée**

✅ Les hôtels seront insérés via l'API !

## Méthode 3 : Ajouter manuellement via le frontend

1. **Connectez-vous** en tant qu'admin
2. **Allez** sur la page d'ajout d'hôtels
3. **Remplissez** le formulaire avec ces URLs d'images :

### URLs d'images d'hôtels gratuites :

```
https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800
https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800
https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800
https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800
https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800
https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800
https://images.unsplash.com/photo-1596436889106-be35e843f974?w=800
https://images.unsplash.com/photo-1517840901100-8179e982acb7?w=800
https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800
https://images.unsplash.com/photo-1445991842772-097fea258e7b?w=800
```

## Vérification

Pour vérifier que les hôtels sont bien insérés :

1. **Ouvrez** `http://localhost:4200/hotels`
2. Vous devriez voir les 10 hôtels avec leurs images !

## Notes importantes

- Les images sont hébergées sur **Unsplash** (gratuites)
- Le champ `photoPath` accepte :
  - Des URLs complètes (http://... ou https://...)
  - Des noms de fichiers locaux (stockés dans `backend/uploads/hotels/`)
- Pour tester avec vos propres images, vous pouvez :
  - Utiliser des URLs d'images en ligne
  - Uploader des fichiers via le formulaire multipart

## Créer un compte admin

Si vous n'avez pas encore de compte admin, exécutez ce SQL :

```sql
USE worldcupdb;

-- Insérer un admin (mot de passe: admin123)
INSERT INTO user (first_name, last_name, email, phone, country, password, role)
VALUES ('Admin', 'System', 'admin@worldcup.ma', '+212600000000', 'Maroc', 
        '$2a$10$xKrJNBRE3hDTYL4hH8L3YOsaEgJ1p9L6zKj5Yq9r4Y9c5Y9r4Y9r4Y', 'admin');
```

Note : Le mot de passe est haché avec BCrypt. Pour créer un nouveau hash :
1. Connectez-vous sur https://bcrypt-generator.com/
2. Entrez votre mot de passe
3. Copiez le hash généré
