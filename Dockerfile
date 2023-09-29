# syntax=docker/dockerfile:1

# Use the official Node.js image as the base image
FROM node:18.18.0-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your application code to the container
COPY . .

# Build your Vue.js application for production (or use 'npm run build' if you have a custom script)
RUN npm run build

# Expose the port that your Vue.js application will run on (usually 8080)
EXPOSE 8080

# Command to start your Vue.js application
CMD ["npm", "run", "serve"]
