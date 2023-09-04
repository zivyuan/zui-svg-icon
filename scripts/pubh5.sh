#!/bin/bash

proj=$(cat package.json| grep '"name":' | cut -d "\"" -f 4)
path=/www/wwwroot/uni.imgozi.cn/$proj

BASE=$(cd "$(dirname "$0")"; pwd)

echo $BASE

npm run build:h5

cd $BASE/../dist/build/

rm -f dist.tar.gz
tar --no-xattrs --exclude=._* --exclude=.DS_Store -czvf dist.tar.gz h5

ssh ubuntu@lighthouse.ip.imgozi.cn "rm -rf ${path}; mkdir ${path};"
scp dist.tar.gz "ubuntu@lighthouse.ip.imgozi.cn:${path}"
ssh ubuntu@lighthouse.ip.imgozi.cn "cd ${path}; tar --exclude=._* --exclude=.DS_Store --strip-components 1 -xzvf dist.tar.gz"

