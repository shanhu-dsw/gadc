#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

cd ./service

# Start Docker Service
sudo docker-compose down

cd ..