#!/bin/bash

if [ "$EUID" -ne 0 ]
  then echo "Please run as root"
  exit
fi

# Load Docker Images
docker load < ./images/engine-capture.tar.gz