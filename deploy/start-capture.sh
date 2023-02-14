#!/bin/bash

docker run -v "$PWD/service/tmp":/app/tmp -v "$PWD/service/capture_licenses":/app/licenses -p 8998:8998 -e SERVER_ADDRESS=XX.XX.XX.XX -e SECRET=XXXXX -d engine-capture