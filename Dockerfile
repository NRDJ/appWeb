# Stage 1: Install development dependencies
FROM node:20.5.0 AS dev-deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Stage 2: Build the application
FROM node:20.5.0 AS builder

WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Serve the application with Nginx
FROM nginx:1.21.3 AS prod

EXPOSE 80

COPY --from=builder /app/dist/app-web /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]