FROM node:18.18.2
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3013
CMD node bin/www
