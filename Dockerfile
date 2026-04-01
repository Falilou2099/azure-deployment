# Image de base légère
FROM node:20-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# On copie d'abord package.json seul (optimisation du cache Docker)
# Si le code change mais pas les dépendances, Docker réutilise ce layer
COPY package*.json ./

# Installation des dépendances de production uniquement
RUN npm install --omit=dev

# On copie le reste du code
COPY app.js .

# On expose le port utilisé par l'app
EXPOSE 3000

# Commande de démarrage
CMD ["node", "app.js"]
