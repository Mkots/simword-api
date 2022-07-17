FROM node:16-alpine

RUN apk add bash

WORKDIR /api
COPY package.json .
COPY yarn.lock .
COPY ./prisma ./prisma/

ENV DATABASE_URL ${DATABASE_URL}

RUN yarn
RUN yarn run prisma:generate

COPY . .

RUN yarn build
EXPOSE 5000

COPY wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh

ENTRYPOINT [ "/bin/bash", "-c" ]
CMD ["yarn", "start"]

