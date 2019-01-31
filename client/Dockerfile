FROM node:11.8.0 as builder
COPY . /app
WORKDIR /app
RUN npm install && npm install --prefix client && npm run build --prefix client

FROM nginx:1.15.2-alpine
COPY --from=builder /app/client/build /app/build
COPY ./client/nginx etc/nginx
EXPOSE 80
