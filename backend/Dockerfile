# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Build TypeScript to JS
RUN npm run build

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "dist/server.js"]
