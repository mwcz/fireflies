#!/bin/bash

grep -oE 'lib/.*\.js' src/index.html | sed 's/^/src\//' | xargs cat
