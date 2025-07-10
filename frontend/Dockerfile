# --- Etapa 1: Build ---
# Usamos una imagen de Node para construir la aplicación de React
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copiar los archivos de manifiesto del paquete
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build


# --- Etapa 2: Producción ---
# Usamos un servidor Nginx súper ligero para servir los archivos estáticos
FROM nginx:stable-alpine

# Copiar los archivos de la aplicación construidos desde la etapa anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
