#!/bin/bash
set -euo pipefail

DATABASES=(alarm bank batch business chatbot)

for DB in "${DATABASES[@]}"; do
  mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "
    CREATE DATABASE IF NOT EXISTS \`${DB}\`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;"
done

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "
  CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';"

for DB in "${DATABASES[@]}"; do
  mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "
    GRANT ALL PRIVILEGES ON \`${DB}\`.*
    TO '${MYSQL_USER}'@'%';"
done

mysql -u root -p"${MYSQL_ROOT_PASSWORD}" -e "FLUSH PRIVILEGES;"

for DB in "${DATABASES[@]}"; do
  for FILE in /docker-entrypoint-initdb.d/${DB}*.sql; do
    if [ -f "$FILE" ]; then
      echo "▶ 실행 중: $FILE → $DB"
      mysql -u root -p"${MYSQL_ROOT_PASSWORD}" "$DB" < "$FILE"
    else
      echo "❌ 파일 없음: $FILE"
    fi
  done
done
