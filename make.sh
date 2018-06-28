#!/bin/sh

csvFile=./berlin-running-tracks.csv
jsonFile=./dist/berlin-running-tracks.json
curl https://s3.amazonaws.com/airtable-csv-exports-production/b32376aaeb8651977355b330aaad2e37/data-Grid%20view.csv > $csvFile
mkdir -p dist
node index.js $csvFile > $jsonFile
rm $csvFile

echo "→ $jsonFile"
