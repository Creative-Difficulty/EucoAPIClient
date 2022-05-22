#! /bin/bash
curl https://github.com/creative-difficulty/eucoapiclient/releases/latest &&
unzip EucoAPIClient.zip &&
cd EucoAPIClient &&
npm i &&
sudo npm link