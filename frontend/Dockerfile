# Etapa 1: build de React
FROM node:18 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: nginx sirve el contenido
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

