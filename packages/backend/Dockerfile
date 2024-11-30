# Use a lightweight Node.js image
FROM node:20-slim

# Set the working directory
WORKDIR /app

# sqlite3 gotta be installed in the context of the arch....
RUN npm install sqlite3

# in synch with .env.production VITE_PATH_TO_WORDS
COPY ./storage/words.txt ./data/words.txt

# Copy the already-built `dist` folder
COPY ./dist ./dist


EXPOSE 4000

# Run the backend server
CMD ["node", "dist/main.cjs"]
