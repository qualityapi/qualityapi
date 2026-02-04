@echo off

if exist tsconfig.tsbuildinfo del tsconfig.tsbuildinfo
call npm run build
call npm pack . --pack-destination ./test

cd test
call npm uninstall qualityapi
call npm i ./qualityapi-%VER%.tgz
call npm i
cd ..