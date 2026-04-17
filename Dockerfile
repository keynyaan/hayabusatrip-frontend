FROM node:20.19.1-alpine

WORKDIR /frontend

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

# CMD [ "yarn", "dev" ]
# 本番用
CMD [ "sh", "-c", "yarn build && yarn start" ]
