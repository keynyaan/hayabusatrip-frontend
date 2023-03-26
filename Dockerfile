# 2023年3月時点の推奨版のNode
FROM node:18.15.0

WORKDIR /frontend

CMD [ "yarn", "build" ]
