#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "📂 Navigating to studio..."
cd studio

echo "🔍 Extracting Sanity schema..."
npx sanity@latest schema extract

echo "🛠️ Generating TypeScript types..."
# We use the --output flag to save it directly to the src folder
npx sanity@latest typegen generate --output ../src/sanity.types.ts

echo "✅ Success! Types updated in src/sanity.types.ts"