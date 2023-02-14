#!/bin/bash

docker run --gpus all -p 7998:8001 -v "$PWD/service/vision_licenses":/app/licenses -e SERVER_ADDRESS=XX.XX.XX.XX -e SECRET=XXXXX -d engine-vision