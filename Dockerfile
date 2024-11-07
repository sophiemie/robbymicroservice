# Basis-Image für Node.js
FROM node:16

# Erstelle ein Verzeichnis für die App
WORKDIR /app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den restlichen Code in den Container
COPY . .

# Exponiere den Port (Anpassen an den Port, den die App verwendet)
EXPOSE 4000

# Starte die App
CMD ["npm", "start"]
