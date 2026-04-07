# Sử dụng môi trường Node.js (phiên bản 18-alpine cho nhẹ)
FROM node:18-alpine

# Tạo thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json và package-lock.json vào trước
COPY package*.json ./

# Cài đặt các thư viện (node_modules)
RUN npm install

# Copy toàn bộ source code còn lại vào container
COPY . .

# Mở cổng 5173
EXPOSE 5173

# Lệnh chạy app (Đảm bảo trong package.json lệnh dev đã có --host 0.0.0.0 nhé)
CMD ["npm", "run", "dev"]