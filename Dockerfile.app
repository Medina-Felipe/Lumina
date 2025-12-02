# Imagen base de Node.js
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencia
COPY app/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente del Frontend
COPY app/ .

# Fase de Construcción (Build)
# Ejecuta el comando de compilación de Vite para generar los archivos estáticos
RUN npm run build

# Usamos una imagen más ligera (Nginx) para servir los archivos de forma eficiente.
FROM nginx:alpine

# Copiar los archivos estáticos generados por Vite
# La carpeta 'dist' es el output por defecto de 'npm run build'
COPY app/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# 9. Puerto del servidor web (Nginx)
EXPOSE 80