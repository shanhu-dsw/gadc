#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd ./service

docker-compose up -d
docker-compose exec gadc redis-server --daemonize yes

cd ..