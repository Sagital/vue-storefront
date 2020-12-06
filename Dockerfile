FROM node:10-alpine

ENV VS_ENV prod


WORKDIR /var/www

COPY package.json ./
COPY yarn.lock ./

#COPY .babelrc ./
COPY src ./src
COPY tsconfig.json ./
COPY shims.d.ts ./
COPY tsconfig-build.json ./
COPY core ./core
COPY .eslintignore ./
COPY .eslintrc.js ./
COPY ecosystem.json ./
COPY lerna.json ./
COPY config ./config
COPY packages ./packages

RUN apk add --no-cache --virtual .build-deps ca-certificates wget python make g++ \
  && apk add --no-cache git \
  && yarn install --no-cache \
  && apk del .build-deps




#COPY var ./var

RUN yarn build

EXPOSE 3000

CMD ["yarn", "docker"]

