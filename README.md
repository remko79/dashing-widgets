# Introduction

A configurable dashboard framework with widgets for 
[OpsGenie](https://www.opsgenie.com),
[GitLab](https://gitlab.com) and
[Katalon](https://www.katalon.com). 

## Prerequisites
* node 10+
* yarn
* redis

## Installation
Make sure you have redis running, just on a default port.

Clone or fork this project and , make sure redis runs:
```js
$ yarn
$ yarn dev:server
// (separate terminal window)
$ yarn dev:frontend
```
Open your browser at http://localhost:3000

## Build for production
You can build your environment for production using `yarn build`

Then you can deploy the `dist` folder to a server and run `node backend/app.js` from there.

## Configuration
See the config folder for an example configuration.

## Docs
Visit the [wiki](https://github.com/remko79/dashing-widgets/wiki) for detailed documentation.
