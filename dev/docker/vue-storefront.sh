#!/bin/sh
set -e

if [ "$VS_ENV" = 'dev' ]; then
  yarn start:saleor
else
  yarn start:saleor
fi
