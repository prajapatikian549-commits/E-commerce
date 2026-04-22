#!/bin/bash
set -e
# Creates extra databases on first container init (POSTGRES_DB already creates usersdb).
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE productsdb;
    CREATE DATABASE ordersdb;
EOSQL
