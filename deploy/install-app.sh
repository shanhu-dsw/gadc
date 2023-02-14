#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

if [ "$1" == '' ]
  then echo "Please provide IP address."
  exit
fi

# Load Docker Images
docker load < ./images/gadc.tar.gz
docker load < ./images/postgres.tar.gz

cd ./service

# Install Compose File
sed -i "14s/.*/      HOST: $1/" docker-compose.yml

# Start Docker Service
docker-compose up -d

sleep 30

docker-compose exec gadc rake db:create
docker-compose exec gadc rake db:migrate
docker-compose exec gadc rake db:seed
docker-compose exec gadc redis-server --daemonize yes

cd ..