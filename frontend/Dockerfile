# Use Node.js LTS version
FROM node:18-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy app source
COPY . .

# Build the app
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy built assets from builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/public ./public

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"] 