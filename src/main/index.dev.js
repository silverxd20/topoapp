/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
const { app } = require('electron');
/* eslint-disable */

// Install `electron-debug` with `devtron`
 // NB: Don't open dev tools with this, it is causing the error
+ require('electron-debug')();


app.whenReady().then(() => {
  installExtension(VUEJS_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
});

// Install `vue-devtools`
/*require('electron').app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})*/

// Require `main` process to boot app
require('./index')