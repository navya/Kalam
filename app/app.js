// Here is the starting point for code of the application.
// Modules which you authored in this project are intended to be
// imported through new ES6 syntax.
// import { greet } from './tests/demo';

// Node.js modules and those from npm
// are required the same way as always.
var os = require('os');
var jetpack = require('fs-jetpack');

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files like it is node.js! Welcome to Electron world :)
var manifest = jetpack.read('package.json', 'json');

// window.env contains data from config/env_XXX.json file.
var envName = window.env.name;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('greet').innerHTML = greet();
    document.getElementById('platform-info').innerHTML = os.platform();
    document.getElementById('env-name').innerHTML = envName;
});
