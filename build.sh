#!/bin/bash
set -e

pnpm build && docker-compose build

PROJECT_NAME="word-games"
TAR_FILE="$PROJECT_NAME-bundle.tar"  # Tar file name

# Paths to files
DOCKER_COMPOSE_FILE="docker-compose.yml"  # Path to docker-compose.yml
IMAGES=("word-games-nginx:latest" "word-games-backend:latest")  # List of Docker images to save (provide name:tag)

# Step 1: Save Docker images to a tar file
echo "Saving Docker images..."
for IMAGE in "${IMAGES[@]}"; do
    docker save "$IMAGE" -o "$(basename "$IMAGE").tar"
done

# Step 2: Bundle docker-compose.yml and images into a tar archive
echo "Creating deployment tarball..."
tar -cf "$TAR_FILE" "$DOCKER_COMPOSE_FILE" *.tar

echo "Cleanup!"
for IMAGE in "${IMAGES[@]}"; do
    rm "$(basename "$IMAGE").tar"
done

echo "Produced $TAR_FILE"