FROM node:alpine

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install 

COPY . .

EXPOSE 4000

CMD [ "node", "app.js" ]

