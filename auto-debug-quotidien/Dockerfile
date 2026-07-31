FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

# Copy package info
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application files
COPY index.js .

# Expose the server port
EXPOSE 8080

# Start the application
CMD ["node", "index.js"]
