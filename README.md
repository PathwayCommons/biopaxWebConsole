# Overview
Modified version of Groovy Web Console hosted on Google App Engine that makes use of Bootstrap and tries to emulate the JSFiddle layout

http://pk0iye.appspot.com

# Run locally on port 1234
dev_appserver.sh -p 1234 war/

# Deploy to Google App Engine
appcfg.sh update war/
