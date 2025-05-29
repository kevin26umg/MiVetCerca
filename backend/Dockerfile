FROM node:18

WORKDIR /app

COPY package*.json ./


RUN npm install -g prisma
RUN npm install


RUN chmod +x ./node_modules/.bin/prisma && \
    chmod -R +x ./node_modules/@prisma/engines || true

COPY . .


RUN npx prisma generate
RUN npx prisma migrate deploy
CMD ["node", "src/index.js"]
