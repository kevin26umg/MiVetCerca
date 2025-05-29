FROM node:18

WORKDIR /app

# Instala solo dependencias necesarias
COPY package*.json ./
RUN npm install

# Copia todo el código
COPY . .

# Genera Prisma Client (en runtime, donde sí hay acceso a DATABASE_URL)
RUN chmod +x ./node_modules/.bin/prisma
CMD ["sh", "-c", "./node_modules/.bin/prisma generate && node src/index.js"]
RUN chmod +x ./node_modules/.bin/prisma
RUN chmod +x ./node_modules/@prisma/engines/* || true
