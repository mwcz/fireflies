#!/bin/bash

cat src/index.html | \
    sed 's/<script.*\.js.*$//' | \
    sed 's/.*third party.*//' | \
    sed 's/.*first party.*/        <script src="js\/bundle.min.js"><\/script>/'
