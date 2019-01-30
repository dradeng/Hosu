FROM node:10.3.0 as builder
COPY . /app
WORKDIR /app
RUN npm run heroku-postbuild

FROM nginx:1.15.2-alpine
COPY --from=builder /app/client/build /app/build
COPY ./client/nginx etc/nginx
EXPOSE 80
