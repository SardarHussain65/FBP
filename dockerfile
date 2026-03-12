# Use Node.js official image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application code
COPY . .

# Expose the port
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]