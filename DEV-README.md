# Quick start
The only development dependency of this project is [Node.js](https://nodejs.org) and bower(globally). So just make sure you have it installed.
Then type few commands known to every Node developer...
```
git clone https://github.com/navya/Kalam.git
cd Kalam/app && bower install && cd ../
npm install
npm start
```
... and boom! You have running desktop application on your screen.

# Structure of the project

There are **two** `package.json` files & a Bower.json file:  

#### 1. For development
Sits on path: `package.json`. Here you declare dependencies for your development environment and build scripts. **This file is not distributed with real application!**

Also here you declare the version of Electron runtime you want to use:
```json
"devDependencies": {
  "electron-prebuilt": "^0.24.0"
}

Bower stores most of the front-end components of the project and all the dependencies are stored in /app/bower
```

#### 2. For your application
Sits on path: `/app/package.json`. This is **real** manifest of your application. Declare your app dependencies here.

### Project's folders

- `app` - code of your application goes here.
- `config` - place for you to declare environment specific stuff.
- `build` - in this folder lands built, runnable application.
- `releases` - ready for distribution installers will land here.
- `resources` - resources for particular operating system.
- `tasks` - build and development environment scripts.


# Development

#### Installation

```
npm install
```
It will also download Electron runtime, and install dependencies for second `package.json` file inside `app` folder.

#### Starting the app

```
npm start
```

#### Adding pure-js npm modules to your app

Remember to add your dependency to `app/package.json` file, so do:
```
cd app
npm install name_of_npm_module --save
```

#### Adding native npm modules to your app

If you want to install native module you need to compile it agains Electron, not Node.js you are firing in command line by typing `npm install` [(Read more)](https://github.com/atom/electron/blob/master/docs/tutorial/using-native-node-modules.md).
```
npm run app-install -- name_of_npm_module
```
Of course this method works also for pure-js modules, so you can use it all the time if you're able to remember such an ugly command.

#### Working with modules

Electron ecosystem (because it's a merge of node.js and browser) gives you a little trouble with work with modules. ES6 modules have nice syntax and are the future, so they're utilized in this project (thanks to [rollup](https://github.com/rollup/rollup)). But at the same time node.js and npm still rely on the CommonJS syntax. So in this project you need to use both:
```js
// Modules which you authored in this project are intended to be
// imported through new ES6 syntax.
import { myStuff } from './my_lib/my_stuff';

// Node.js modules are loaded the old way with require().
var os = require('fs');

// And all modules which you installed from npm
// also need to be required.
var moment = require('moment');
```

#### Unit tests

electron-boilerplate has preconfigured [jasmine](http://jasmine.github.io/2.0/introduction.html) unit test runner. To run it go with standard:
```
npm test
```
You don't have to declare paths to spec files in any particular place. The runner will search through the project for all `*.spec.js` files and include them automatically.


# Making a release

**Note:** There are various icon and bitmap files in `resources` directory. Those are used in installers and are intended to be replaced by your own graphics.

To make ready for distribution installer use command:
```
npm run release
```
It will start the packaging process for operating system you are running this command on. Ready for distribution file will be outputted to `releases` directory.

You can create Windows installer only when running on Windows, the same is true for Linux and OSX. So to generate all three installers you need all three operating systems.


## Instructions for Windows
As installer [NSIS](http://nsis.sourceforge.net/Main_Page) is used. You have to install it (version 3.0), and add NSIS folder to PATH in Environment Variables, so it is reachable to scripts in this project (path should look something like `C:/Program Files (x86)/NSIS`).

#Dev Workflow Based on electron-boilerplate

The MIT License (MIT)

Original work Copyright (c) 2015 Jakub Szwacz
Modified work Copyright 2015 Bhanu P Chaudhary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
