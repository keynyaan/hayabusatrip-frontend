# 2023年3月時点の推奨版のNode
FROM node:18.15.0-alpine

WORKDIR /frontend

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD [ "yarn", "dev" ]
# 本番用
# CMD [ "yarn", "build" ]
