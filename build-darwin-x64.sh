#!/bin/bash
# Works on Mac x64 only

brew install wget
wget https://github.com/atom/electron/releases/download/v0.31.2/electron-v0.31.2-darwin-x64.zip
mkdir app
unzip electron-v0.31.2-darwin-x64.zip -d app
rm electron-v0.31.2-darwin-x64.zip
mv app/Electron.app app/Kalam.app 
rm -r app/Kalam.app/Contents/Resources/default_app/*
cp -r source/* app/Kalam.app/Contents/Resources/default_app/