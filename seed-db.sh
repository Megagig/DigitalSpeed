#!/bin/bash

echo "Running database seed script..."
npx prisma db push
npx prisma generate
npx ts-node --compiler-options "{\"module\":\"CommonJS\"}" prisma/seed.ts

echo "Database seeded successfully!"
