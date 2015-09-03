#!/bin/bash
# syncs changes in app and updates source

rm -r source/*
cp -r app/resources/default_app source/*
