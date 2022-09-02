FROM node:16

RUN mkdir /app
COPY . /app

WORKDIR /app

EXPOSE 5000

RUN npm run setup
RUN npm run build

CMD [ "npm", "run", "start:prod" ]
