#! /bin/bash

set -e

pnpm i 

pnpm vite build

docker build -t word-games-nginx .