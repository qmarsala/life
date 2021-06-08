# build environment
FROM node as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY ./src ./src
COPY ./src/index.html ./dist/index.html

RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]