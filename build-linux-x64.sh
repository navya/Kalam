#!/bin/bash
# Works on linux x64 only

wget https://github.com/atom/electron/releases/download/v0.31.2/electron-v0.31.2-linux-x64.zip
mkdir app
unzip electron-v0.31.2-linux-x64.zip -d app
rm electron-v0.31.2-linux-x64.zip
mv app/electron app/kalam 
rm -r app/resources/default_app/*
cp -r source/* app/resources/default_app