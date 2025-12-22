-- =============================================
-- Script de création de la base de données
-- WorldCup 2030 - Morocco
-- =============================================

-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS worldcupdb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE worldcupdb;

-- =============================================
-- NOTE: Les tables seront créées automatiquement
-- par Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- =============================================

-- Vérifier que la base est bien créée
SELECT 'Base de données worldcupdb créée avec succès!' AS message;

-- Afficher les informations de la base
SHOW DATABASES LIKE 'worldcupdb';
