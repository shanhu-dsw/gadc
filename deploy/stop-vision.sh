#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

docker stop $(docker ps -q --filter ancestor="engine-vision")