# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY frontend/src ./src
COPY frontend/public ./public

# Build the frontend app
# RUN npm run build

# Expose port 8080 for the frontend
EXPOSE 8080

# Start the React app
CMD ["npm", "start"]
