FROM node:18.18.2
WORKDIR /app
# 将 package.json 和 package-lock.json 复制到 /app 目录下
COPY package*.json ./

#设置registry为淘宝镜像
RUN npm set registry https://registry.npmmirror.com

# 运行 npm install 安装依赖
RUN npm install

# 将源代码复制到 /app 目录下
COPY . .


EXPOSE 3013
CMD node bin/www
