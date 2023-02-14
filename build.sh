#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

rm gadc.tar.gz

# Start Docker Service
docker-compose build

docker save gadc | gzip > gadc.tar.gz