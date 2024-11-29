#!/bin/bash
set -e

# Check if required arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <server_user> <server_ip>"
    exit 1
fi

# Parameters
SERVER_USER="$1"  # SSH user for the server (passed as the first argument)
SERVER_IP="$2"    # Server IP or hostname (passed as the second argument)
SERVER_DIR="~/"  # Target directory on the server
TAR_FILE="deployment_bundle.tar"  # Tar file name

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

# Step 3: Transfer tarball to the server
echo "Transferring tarball to the server..."
scp "$TAR_FILE" "$SERVER_USER@$SERVER_IP:$SERVER_DIR"



# Step 4: SSH into the server and handle deployment
echo "Deploying on the server..."
ssh "$SERVER_USER@$SERVER_IP" << EOF
    # Go to the deployment directory
    cd $SERVER_DIR

    # Untar the new deployment bundle
    echo "Extracting deployment bundle..."
    tar -xf "$TAR_FILE"

    # # Load Docker images
    echo "Loading Docker images..."
    for IMAGE_TAR in *.tar; do
        docker load -i "\$IMAGE_TAR"
    done

    # # # Start the application with Docker Compose
    # echo "Starting the application..."
    docker compose down --rmi all

    docker compose up -d

    # # Clean up tar files
    echo "Cleaning up tar files..."
    rm -f *.tar

    # Clean up previous deployment
    # echo "Cleaning up old deployment..."
    # rm -rf docker-compose.yml *.tar
EOF

# Step 5: Clean up local tar files
echo "Cleaning up local files..."
rm -f *.tar "$TAR_FILE"

echo "Deployment complete!"
