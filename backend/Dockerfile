FROM node:18

WORKDIR /app

# Instala solo dependencias necesarias
COPY package*.json ./
RUN npm install

# Copia todo el código
COPY . .

# Genera Prisma Client (en runtime, donde sí hay acceso a DATABASE_URL)
CMD ["sh", "-c", "npx prisma generate && node src/index.js"]
