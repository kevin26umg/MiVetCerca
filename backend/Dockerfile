# FROM node:18

# WORKDIR /app


# COPY package*.json ./

# RUN npm install -g nodemon && npm install


# COPY prisma ./prisma


# COPY . .


# CMD ["sh", "-c", "npx prisma generate && nodemon src/index.js"]


FROM node:18

WORKDIR /app


COPY package*.json ./


RUN npm install -g prisma nodemon && npm install


COPY . .


RUN npx prisma generate


CMD ["nodemon", "src/index.js"]

