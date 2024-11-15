# Usa una imagen base de Node.js con Alpine
FROM node:20-alpine

# Configura la zona horaria y elimina el paquete tzdata después de usarlo
ENV TZ America/Bogota
RUN apk update && apk upgrade && \
    apk add --no-cache git tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

RUN npm install --global npm@10.9.0 &&  -g @angular/cli

WORKDIR /usr/app


COPY ./package.json /usr/app/

RUN npm install && npm cache clean --force

CMD [ "npm", "run","start" ]

