#!/bin/bash
set -e

echo "Petora Deployment - Starting..."

command -v vercel >/dev/null 2>&1 || { echo "Vercel CLI required"; exit 1; }

npm run build

BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  vercel --prod=false
else
  vercel --prod
fi

if command -v supabase >/dev/null 2>&1; then
  supabase db push
fi

echo "Deployment complete!"
