#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Load Docker Images
docker load < ./images/gadc.tar.gz

# Start Docker Service
docker-compose up -d

sleep 30

docker-compose exec smart-school rake db:migrate
docker-compose exec smart-school redis-server --daemonize yes

cd ..