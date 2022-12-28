FROM node:16

RUN mkdir /app
COPY . /app

WORKDIR /app

EXPOSE 5000

RUN npm run setup
RUN npm run build

RUN mv ./client/build/ .
RUN rm -rf ./client
RUN mkdir client && mv build ./client/

CMD [ "npm", "run", "start:prod" ]
