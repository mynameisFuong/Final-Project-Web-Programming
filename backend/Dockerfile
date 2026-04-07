# Vẫn sử dụng môi trường Node.js
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Mở cổng 4000 cho Backend
EXPOSE 4000

# Lệnh chạy server
CMD ["npm", "run", "dev"]