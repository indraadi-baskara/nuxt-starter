#!/bin/sh
set -e
[ -f .env ] || { cp .env.example .env; echo "→ Fill .env DATABASE_URL + BETTER_AUTH_SECRET"; }
corepack enable
corepack prepare pnpm@11.20.0 --activate
pnpm install
pnpm db:setup
echo "✓ Ready — pnpm dev → http://localhost:3002"
