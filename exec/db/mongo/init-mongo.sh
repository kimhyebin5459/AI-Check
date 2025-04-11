#!/bin/bash

set -e
set -x

echo "📦 Running MongoDB init-mongo.sh..."
echo "🔑 USERNAME=${MONGO_USERNAME}"
echo "📁 DB=${MONGO_INITDB_DATABASE}"

mongosh -- "$MONGO_INITDB_DATABASE" <<EOF
db.createUser({
  user: "${MONGO_USERNAME}",
  pwd: "${MONGO_PASSWORD}",
  roles: [
    { role: "readWrite", db: "${MONGO_INITDB_DATABASE}" },
    { role: "readWrite", db: "config" }
  ]
})
EOF

echo "✅ MongoDB user created"