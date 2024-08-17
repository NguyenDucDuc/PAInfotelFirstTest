FROM node:20-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333

CMD [ "npm", "start" ]
# CMD nx serve gateway-service --configuration=production
