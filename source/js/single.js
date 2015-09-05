 tinymce.init({
   selector: "textarea",
   plugins: [
     "advlist autolink lists link image charmap print preview anchor",
     "searchreplace visualblocks code fullscreen",
     "insertdatetime media table contextmenu paste"
   ],
   toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
 });

 var getelem = document.getElementById.bind(document),
   fs = require('fs'),
   path = require('path');
 window.course = {};
 window.keys = {};

 function updatefield(type) {
  var type1 = 'formfield-' + type;
   var id = getelem(type1).innerHTML;
   // getelem(id).innerHTML = tinyMCE.activeEditor.getContent();
   getelem(id).innerHTML = template[type](id, 'get')
   overlay(type)

 }

 function modify_field(str) {
   var tmp = str.split(',')
   type = tmp[1]
   id = tmp[0]
   overlay(type)
   getelem('formfield-' + type).innerHTML = id
   existing_value = (window.course[id] || "");
   template[type](id, null, existing_value)
   // getelem('modalinput').value = window.course[id];
   // getelem('formfield').innerHTML = id;
   //tinyMCE.activeEditor.setContent(window.course[id])
 }

 function overlay(type) {
   type = "overlay-" + type;
   el = document.getElementById(type);
   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
 }
 function notes_modal(){
   el = document.getElementById("notes_modal");
   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
 }

 var template = {
   "text": function(id, get, set) {
     if (get) {
       return getelem('text_input').value
     }
     if (set) {
       return getelem('text_input').value = set
     }
   },
   "textarea": function(id, get, set) {
     if (get) {
       return tinyMCE.activeEditor.getContent()
     }
     if (set) {
       return tinyMCE.activeEditor.setContent(set)
     }
   },
   "incri_mtext": function(id, get, set) {
     if (get) {
       return tinyMCE.activeEditor.getContent()
     }
     if (set) {
       return inyMCE.activeEditor.setContent(window.course[id])
     }
   }
 }

 function arrayUnique(array) {
   var a = array.concat();
   for (var i = 0; i < a.length; ++i) {
     for (var j = i + 1; j < a.length; ++j) {
       if (a[i] === a[j])
         a.splice(j--, 1);
     }
   }
   return a;
 };

 function getcoursebyid(id) {
   var filename = path.join(__dirname, 'themes', 'settings.json');
   var jsonm = require(filename);
   var themename = jsonm.ActiveTheme;
   var themepath = path.join(__dirname, 'themes', themename, 'settings.json');
   var themefields = require(themepath).variables;
   db.get(id).then(function(course) {
     localStorage.setItem('course', JSON.stringify(course));
     localStorage.setItem('id', course._id);
     window.course = course;
     var keys = Object.keys(themefields);
     window.keys = keys
     var str = '';
     for (var i = keys.length - 1; i >= 0; i--) {
       if (keys[i] !== '_rev' && keys[i] !== '_id') {
         str += '<div class="mdl-card__supporting-text" onclick=modify_field("' + keys[i] + ',' + themefields[keys[i]] + '") > <b>' + keys[i] + ':</b> <span id="' + keys[i] + '" >' + (course[keys[i]] || "") + '</span></div>'
       }
     };
     getelem("fields").innerHTML = str;
   }).catch(function(err) {
     console.log(err);
   });
 }
 //This function sets up the page, adding inputs elements of the template
 //TODO - Add input fields for course fields not in template but in course ( probably an interface to choose any type)


 function getcourse() {
   var keys = window.keys;
   var obj = {}
   for (var i = keys.length - 1; i >= 0; i--) {
     if (keys[i] !== '_rev' && keys[i] !== '_id') {
       obj[keys[i]] = getelem(keys[i]).innerHTML
     }
   };
   return obj
 }

 function gruntcourse() {
   var course = getcourse()
   updatecoursebyid(localStorage.id, course)
   // generatecourse(course)
 }

 function getFiles(srcpath) {
   return fs.readdirSync(srcpath).filter(function(file) {
     return fs.statSync(path.join(srcpath, file)).isFile();
   });
 }

 function generatezip(course, compiledsource, files, themepath) {
   var zip = new JSZip();
   var keys = Object.keys(compiledsource)
   for (var i = keys.length - 1; i >= 0; i--) {
     var name = keys[i].substr(0, keys[i].lastIndexOf(".")) + ".html";
     zip.file(name, compiledsource[keys[i]](course));
   }
   var tfile;
   for (var i = files.length - 1; i >= 0; i--) {
     if (files[i].split('.').pop() !== 'hbs') {
       tfile = fs.readFileSync(path.join(themepath, files[i]), "utf8");
       zip.file(files[i], tfile);
     }
   }
   var content = zip.generate({
     type: "blob"
   });
   saveAs(content, "course.zip");
 }

 function createfolder(course, compiledsource, files, themepath) {
   var fs = require('fs');
   var dir = path.join(__dirname, 'courses', course.course_number);
   if (!fs.existsSync(dir)) {
     fs.mkdirSync(dir);
   }
   var keys = Object.keys(compiledsource)
   for (var i = keys.length - 1; i >= 0; i--) {
     var name = keys[i].substr(0, keys[i].lastIndexOf(".")) + ".html";
     fs.writeFileSync(path.join(dir, name), compiledsource[keys[i]](course));
     // zip.file(name, compiledsource[keys[i]](course));
   }
   var tfile;
   //TODO implement stream to copy 
   for (var i = files.length - 1; i >= 0; i--) {
     if (files[i].split('.').pop() !== 'hbs') {
       tfile = fs.readFileSync(path.join(themepath, files[i]), "utf8");
       fs.writeFileSync(path.join(dir, files[i]), tfile);
       // zip.file(files[i], tfile);
     }
   }
   alertify.success("Folder has Been Created")
   // uploadsftp()
   sftp()
 }

 function generatecourse(method) {
   var course = getcourse()
   var compiledsource = {};
   var filename = path.join(__dirname, 'themes', 'settings.json');
   var jsonm = require(filename);
   var themename = jsonm.ActiveTheme;
   var themepath = path.join(__dirname, 'themes', themename);
   var files = getFiles(themepath);
   course = course ? course : JSON.parse(localStorage.course);
   for (var i = files.length - 1; i >= 0; i--) {
     if (files[i].split('.').pop() === 'hbs') {
       var source = fs.readFileSync(path.join(themepath, files[i]), "utf8");
       compiledsource[files[i]] = handlebars.compile(source);
     }
   }
   if (method == 'zip') {
     generatezip(course, compiledsource, files, themepath)
   } else {
     createfolder(course, compiledsource, files, themepath)
   }
 }

 function uploadsftp() {
   var client = require('scp2');
   var course = getcourse()
   var dir = path.join(__dirname, 'courses', course.course_number);
   var host = getelem('host').value;
   var directory = getelem('directory').value;
   var hostpath = path.join(directory, "course", course.course_number);

   var username = getelem('username').value;
   var password = getelem('password').value;

   var url = username + ':' + password + '@' + host + ':' + hostpath;
   var checker = 1;
   if (!username) {
     alertify.warning('username cannot be empty')
     checker = 0
   }
   if (!password) {
     alertify.warning('password cannot be empty')
     checker = 0
   }
   if (!dir) {
     alertify.warning('dir cannot be empty')
     checker = 0
   }
   if (!host) {
     alertify.warning('host cannot be empty')
     checker = 0
   }
   if (checker) {
     console.log(url)
     console.log(dir)
     client.scp(dir, url, function(err) {
       if (!err) {
         alertify.success('Upload has been successful');
         sftp();
       }
     })
   }

 }

 function sftp() {
   el = document.getElementById("sftp");
   el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
 }

 function iitksettings() {
   if (document.getElementById('checkbox-iitk').checked) {
     getelem('host').value = "webhome.cc.iitk.ac.in";
     getelem('directory').value = "/www/user/www/";
     alertify.warning('Replace user with your username in directory')
   }
 }

 routie('course/:id', function(id) {
   getcoursebyid(id);
 });