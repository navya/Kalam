#!/bin/bash
# syncs changes in app and updates source

rm -r source/*
cp -r app/Kalam.app/Contents/Resources/default_app/* source/