# FlowTask

Application web fullstack de gestion de tâches organisées par périodes temporelles.

## 📋 Présentation

**FlowTask** est un projet personnel développé pour m'entraîner au développement web fullstack. L'application permet de gérer des tâches organisées dans des périodes temporelles, avec un système de priorités et de statuts.

## ✨ Fonctionnalités

### Authentification
- Inscription et connexion sécurisées
- Authentification via JWT (JSON Web Token)
- Protection des routes côté frontend et backend

### Gestion des tâches
- **Création** : Créer des tâches avec titre, description, statut et priorité
- **Lecture** : Visualiser toutes ses tâches organisées par période
- **Modification** : Éditer une tâche existante
- **Suppression** : Supprimer une tâche avec confirmation

### Gestion des périodes
- Créer jusqu'à 4 périodes par utilisateur
- Chaque période a un titre, une date de début et une date de fin
- Les tâches sont organisées visuellement par colonnes (une colonne = une période)
- Suppression d'une période (uniquement si elle ne contient pas de tâches)

### Organisation visuelle
- Affichage en colonnes par période
- Tri automatique des tâches par priorité (Haute → Moyenne → Basse)
- Séparation visuelle des tâches terminées (en bas de chaque colonne)
- Style visuel distinct pour les tâches terminées (opacité réduite)

### Sécurité
- Isolation des données : chaque utilisateur ne voit que ses propres tâches et périodes
- Mots de passe hashés avec bcrypt
- Tokens JWT avec expiration
- Validation des données côté serveur

## 🛠️ Stack technique

### Frontend
- **React** 19.2.3 - Bibliothèque UI
- **React Router** 7.11.0 - Gestion du routing
- **Fetch API** - Appels HTTP vers le backend
- **Context API** - Gestion de l'état d'authentification

### Backend
- **Node.js** - Runtime JavaScript
- **Express** 5.2.1 - Framework web
- **MySQL** - Base de données relationnelle
- **mysql2** 3.16.0 - Driver MySQL pour Node.js
- **JWT** (jsonwebtoken 9.0.3) - Authentification
- **bcrypt** 6.0.0 - Hashage des mots de passe
- **CORS** 2.8.5 - Gestion des requêtes cross-origin

## 📁 Architecture

### Structure du projet

```
FlowTask/
├── backend/              # API Node.js/Express
│   ├── src/
│   │   ├── config/       # Configuration (DB)
│   │   ├── controllers/  # Logique métier
│   │   ├── middleware/   # Middlewares (auth)
│   │   ├── routes/       # Définition des routes
│   │   ├── app.js        # Configuration Express
│   │   └── server.js     # Point d'entrée
│   ├── database/
│   │   └── schema.sql    # Script de création des tables
│   └── package.json
│
├── frontend/             # Application React
│   ├── src/
│   │   ├── components/   # Composants réutilisables
│   │   ├── contexts/     # Contextes React (Auth)
│   │   ├── pages/        # Pages de l'application
│   │   ├── services/     # Services API
│   │   └── styles/       # Styles globaux
│   └── package.json
│
└── README.md
```

### Architecture backend

- **Séparation des responsabilités** : routes → controllers → base de données
- **Middleware d'authentification** : vérification JWT sur toutes les routes protégées
- **Pool de connexions MySQL** : gestion optimisée des connexions à la base de données
- **Gestion d'erreurs centralisée** : réponses JSON cohérentes avec codes HTTP appropriés

### Architecture frontend

- **Composants fonctionnels** : utilisation de React Hooks
- **Context API** : gestion de l'état d'authentification global
- **Services API** : séparation de la logique HTTP de la logique UI
- **Routes protégées** : redirection automatique si non authentifié

## 🔒 Sécurité

- **Hashage des mots de passe** : bcrypt avec 10 rounds de salage
- **Authentification JWT** : tokens avec expiration (1h)
- **Protection des routes** : middleware vérifiant le token sur chaque requête
- **Isolation des données** : toutes les requêtes SQL filtrent par `user_id`
- **Validation des données** : vérification côté serveur avant insertion/modification
- **CORS configuré** : autorisation uniquement depuis le frontend

## 🚀 Installation

### Prérequis

- Node.js (v14 ou supérieur)
- MySQL (WAMP/XAMPP ou serveur MySQL)
- npm ou yarn

### Backend

1. **Aller dans le dossier backend**
```bash
cd backend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` à la racine du dossier `backend` :

```env
PORT=8080

# Configuration MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow

# Secret JWT (à changer en production)
JWT_SECRET=votre_secret_jwt_tres_securise
```

4. **Créer la base de données**

Exécuter le script SQL dans MySQL :
```bash
# Via MySQL Workbench ou ligne de commande
mysql -u root -p taskflow < database/schema.sql
```

Ou créer manuellement les tables en suivant le fichier `backend/database/schema.sql`.

5. **Lancer le serveur**

Mode développement (avec rechargement automatique) :
```bash
npm run dev
```

Mode production :
```bash
npm start
```

Le serveur démarre sur `http://localhost:8080`

### Frontend

1. **Aller dans le dossier frontend**
```bash
cd frontend
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'URL de l'API** (optionnel)

Créer un fichier `.env` à la racine du dossier `frontend` :

```env
REACT_APP_API_URL=http://localhost:8080
```

Par défaut, l'application utilise `http://localhost:8080`.

4. **Lancer l'application**
```bash
npm start
```

L'application s'ouvre sur `http://localhost:3000`

## 📡 API

### Routes d'authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Routes des périodes

- `GET /api/periods` - Liste des périodes de l'utilisateur
- `POST /api/periods` - Créer une période (max 4)
- `GET /api/periods/:id` - Détails d'une période
- `DELETE /api/periods/:id` - Supprimer une période

### Routes des tâches

- `GET /api/tasks` - Liste des tâches de l'utilisateur
- `POST /api/tasks` - Créer une tâche
- `GET /api/tasks/:id` - Détails d'une tâche
- `PUT /api/tasks/:id` - Modifier une tâche
- `DELETE /api/tasks/:id` - Supprimer une tâche

**Note** : Toutes les routes (sauf `/api/auth/*`) nécessitent un token JWT dans le header `Authorization: Bearer <token>`

## 🎯 Améliorations futures

- **Drag & drop** : Déplacer les tâches entre périodes par glisser-déposer
- **Vue calendrier** : Visualisation des tâches sur un calendrier mensuel
- **Filtres et recherche** : Filtrer les tâches par statut, priorité ou période
- **Statistiques** : Dashboard avec graphiques de productivité
- **Notifications** : Rappels pour les tâches importantes
- **Export** : Exporter les tâches en PDF ou CSV
- **Rôles avancés** : Partage de périodes entre utilisateurs

## 📝 Notes de développement

- Les `console.log` et `console.error` sont conservés pour le débogage en développement
- Le projet utilise des fonctionnalités ES6+ (async/await, destructuring, etc.)
- Pas de framework CSS externe : styles personnalisés avec CSS pur
- Architecture simple et lisible, prête à être étendue

## 👤 Auteur

Projet personnel développé dans le cadre de l'apprentissage du développement web fullstack.

---

**FlowTask** - Organisez vos projets efficacement
