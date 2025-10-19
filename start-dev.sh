#!/bin/bash
# Start in development mode without file watching
cd /home/ubuntu/nautilus-trader-admin

echo "Building client..."
pnpm run build

echo "Starting server in development mode..."
NODE_ENV=development node dist/index.js

