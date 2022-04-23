FROM node:lts

WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY ./src ./src
RUN npm run build


FROM node:lts

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production

COPY --from=0 /usr/src/app/build ./build
EXPOSE 8080
CMD npm run serve