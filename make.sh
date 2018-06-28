#!/bin/sh
jsonFile=./dist/berlin-running-tracks.json
mkdir -p dist
node index.js $(cat AIRTABLE_API_KEY) > $jsonFile
echo "→ $jsonFile"