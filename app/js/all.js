   var appData = app.getPath("appData");


   function toggleabout() {
   	el = document.getElementById("about");
   	el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
   }
   //Should be called everytime the app opens
   function bootstrapFolder() {
   	var dir = path.join(appData, 'courses')
   	if (!fs.existsSync(dir)) {
   		fs.mkdirSync(dir);
   	}
   }
