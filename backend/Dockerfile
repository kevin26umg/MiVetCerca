# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install


# COPY . .


# RUN chmod +x ./node_modules/.bin/prisma
# CMD ["sh", "-c", "./node_modules/.bin/prisma generate && node src/index.js"]
# RUN chmod +x ./node_modules/.bin/prisma
# RUN chmod +x ./node_modules/@prisma/engines/* || true


FROM node:18

WORKDIR /app

COPY package*.json ./


RUN npm install -g prisma
RUN npm install


RUN chmod +x ./node_modules/.bin/prisma && \
    chmod -R +x ./node_modules/@prisma/engines || true

COPY . .


RUN npx prisma generate

CMD ["node", "src/index.js"]
