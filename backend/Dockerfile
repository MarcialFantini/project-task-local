# --- Etapa 1: Build ---
# Usamos una imagen completa de Node para instalar dependencias y compilar
FROM node:18 AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de manifiesto del paquete
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código fuente
COPY . .

# Compilar el código TypeScript a JavaScript
RUN npm run build


# --- Etapa 2: Producción ---
# --- CAMBIO CLAVE: Se especifica una versión de Alpine compatible ---
# Usamos una imagen ligera de Node con Alpine 3.18 para asegurar la compatibilidad de OpenSSL
FROM node:18-alpine3.18

WORKDIR /app

# Se instala la dependencia de OpenSSL que Prisma necesita en Alpine Linux
RUN apk add --no-cache openssl1.1-compat

# Copiar las dependencias de producción desde la etapa 'builder'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copiar el cliente de Prisma generado
COPY --from=builder /app/prisma ./prisma/

# Copiar el código JavaScript compilado
COPY --from=builder /app/dist ./dist

# Exponer el puerto en el que corre el servidor
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD [ "npm", "run", "start" ]
