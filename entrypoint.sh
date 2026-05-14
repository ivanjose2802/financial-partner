#!/bin/sh
set -e

echo "Running migrations..."
node -e "
const { DataSource } = require('typeorm');
const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  migrations: ['dist/migrations/*.js'],
});
ds.initialize()
  .then(() => ds.runMigrations())
  .then(() => { console.log('Migrations complete'); process.exit(0); })
  .catch(e => { console.error('Migration failed:', e.message); process.exit(1); });
"

echo "Starting server..."
exec node dist/main
