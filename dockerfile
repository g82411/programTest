FROM node:10

RUN mkdir /app
WORKDIR /app

RUN npm install -g mocha yarn

ADD ./package.json .
ADD ./yarn.lock .
RUN yarn