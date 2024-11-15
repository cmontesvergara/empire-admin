# Usa una imagen base de Node.js con Alpine
FROM node:18-alpine

# Configura la zona horaria y elimina el paquete tzdata después de usarlo
ENV TZ America/Bogota
RUN apk update && apk upgrade && \
    apk add --no-cache git tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

# Instala una versión específica de npm globalmente
RUN npm install --global npm@9.8.0

# Crea y configura el directorio de trabajo
WORKDIR /usr/pre-app

# Copia el package.json antes de instalar dependencias
COPY ./package.json /usr/pre-app/
RUN npm install && npm cache clean --force

# Copia el resto de los archivos de la aplicación y construye el proyecto
COPY ./ /usr/pre-app
RUN npm run build
ENV NODE_ENV production
WORKDIR /usr/app
COPY /usr/pre-app/dist /usr/app

