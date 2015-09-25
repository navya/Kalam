var remote = require('remote')
var app = remote.require('app')
var appData = app.getPath("appData");
var path = require('path');
var fs = require('fs');


function toggleabout() {
	el = document.getElementById("about");
	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}
//Should be called everytime the app opens
function bootstrapFolder() {
	var dir = path.join(appData, 'kalam')
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
	var dir2 = path.join(dir, 'courses')
	if (!fs.existsSync(dir2)) {
		fs.mkdirSync(dir2);
	}
}