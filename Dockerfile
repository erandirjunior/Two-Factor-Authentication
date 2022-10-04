FROM node:lts

RUN mkdir /app

WORKDIR /app

COPY --chown=node:node . .

CMD /bin/sh