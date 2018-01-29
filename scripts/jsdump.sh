#!/bin/bash

grep -oE 'js/.*\.js' src/index.html | sed 's/^/src\//' | xargs cat
