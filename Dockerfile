# Base image
FROM node:20

# Tạo thư mục app
WORKDIR /app

# Copy package
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY . .

# Build TS
RUN npm run build

# Expose port
EXPOSE 8888

# Run app
CMD ["npm", "run", "start"]
