#!/bin/bash

# Simple start script without file watching
cd /home/ubuntu/nautilus-trader-admin

# Build the project first
echo "Building project..."
pnpm run build

# Start the server
echo "Starting server..."
NODE_ENV=production node dist/index.js

