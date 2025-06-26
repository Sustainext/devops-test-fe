# Use official Node.js image
FROM node:18

WORKDIR /app

COPY package*.json ./

ENV NODE_OPTIONS=--max-old-space-size=3072

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
