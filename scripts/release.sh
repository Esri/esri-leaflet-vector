#!/bin/bash

# config
VERSION=$(node --eval "console.log(require('./package.json').version);")
NAME=$(node --eval "console.log(require('./package.json').name);")

# build and test
npm run lint || exit 1

# checkout temp branch for release
git checkout -b gh-release

# run prepublishOnly to build files
npm run prepublishOnly

# force add files
git add dist -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# push commit so it exists on GitHub when we run gh-release
git push https://github.com/Esri/esri-leaflet-vector gh-release

# create a ZIP archive of the dist files
zip -r $NAME-v$VERSION.zip dist

# run gh-release to create the tag and push release to github
# may need to run this instead on Windows: ./node_modules/.bin/gh-release --assets $NAME-v$VERSION.zip
gh-release --assets $NAME-v$VERSION.zip

# checkout master and delete release branch locally and on GitHub
git checkout master
git branch -D gh-release
git push https://github.com/Esri/esri-leaflet-vector :gh-release

# publish release on NPM
npm publish