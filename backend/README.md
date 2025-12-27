# Backend FlowTask

Backend Node.js avec Express - Architecture simple et claire.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à la racine du dossier `backend` avec :

```
PORT=8080

# Configuration MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow
```

**Note :** Ajustez les valeurs selon votre configuration MySQL (WAMP).

## Lancement

### Mode développement (avec nodemon)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

## Structure

```
backend/
├── src/
│   ├── app.js              # Configuration Express
│   ├── server.js           # Lancement du serveur
│   ├── routes/
│   │   └── index.js        # Routes principales
│   ├── controllers/
│   │   └── health.controller.js
│   └── config/
│       └── db.js           # Configuration DB
├── .env                    # Variables d'environnement
├── package.json
└── README.md
```

## Routes

- `GET /health` - Retourne `{ status: "ok" }`
- `GET /db/test` - Teste la connexion MySQL et exécute une requête simple

