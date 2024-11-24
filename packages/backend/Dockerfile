# Use a lightweight Node.js image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy the already-built `dist` folder
COPY ./dist ./dist

# Copy other runtime files (if needed)
COPY ./package.json ./

# Install only production dependencies (if any runtime dependencies are needed)
# RUN npm install --production

# Expose the port the backend will run on
EXPOSE 3000

# Run the backend server
CMD ["node", "dist/main.es.js"]
