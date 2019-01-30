FROM node:10.3.0 as builder
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 5000
ENTRYPOINT ["npm", "run", "start"]
