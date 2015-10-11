var editor = new MediumEditor('[data-toggle="pen"]');
var github = require('octonode');


var getelem = document.getElementById.bind(document),
  fs = require('fs'),
  path = require('path');
window.course = {};
window.keys = {};

function updatefield(type) {
  var id = getelem('formfield-' + type).dataset.value;
  var value = template[type](id, 'get')
  update_single_field(id, value)
  overlay(type)
}

function modify_field(str) {
  var tmp = str.split(',')
  type = tmp[1]
  id = tmp[0]
  overlay(type)
  getelem('formfield-' + type).dataset.value = id
  existing_value = (window.course[id] || "");
  template[type](id, null, existing_value);
  if (type == 'attachments') {
    getelem("formfield-attachments").innerHTML = "";
  }
}

function overlay(type) {
  type = "overlay-" + type;
  el = document.getElementById(type);
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

var template = {
  "text": function(id, get, set) {
    if (get) {
      return getelem('text_input').value
    }
    if (set) {
      return getelem('text_input').value = set || 'Click here to edit'
    }
  },
  "textarea": function(id, get, set) {
    if (get) {
      return getelem('textarea-input').value
    }
    if (set) {
      return editor.setContent(set || 'Click here to edit', 0)
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
  return a
}

function update_ui() {
  //Updates the UI currently only refreshes :P
  getcoursebyid(window.location.hash.slice(8))
  //overlay('attachments')
}

function bootstrapattachments(course) {
  var filename = path.join(__dirname, 'themes', 'settings.json');
  var jsonm = require(filename);
  var themename = jsonm.ActiveTheme;
  var themepath = path.join(__dirname, 'themes', themename, 'settings.json');
  var themefields = require(themepath).variables;
  localStorage.setItem('course', JSON.stringify(course));
  localStorage.setItem('id', course._id);
  window.course = course;
  var keys = Object.keys(themefields);
  window.keys = keys
  var str = '';
  var tmp = '';
  var tmpcourse = '';
  for (var i = keys.length - 1; i >= 0; i--) {
    if (keys[i] !== '_rev' && keys[i] !== '_id') {
      if (themefields[keys[i]] == 'attachments') {
        tmp = '';
        tmpcourse = course[keys[i]] || [];
        for (var k = tmpcourse.length - 1; k >= 0; k--) {
          tmp += '<div class="item_heading"> <b>' + tmpcourse[k]["name"] + ':</b> <span id="attach' + k + '" > ' + (tmpcourse[k]["size"]) + ' KB</span></div><br>'
        };
        str += '<div class="mdl-cell mdl-cell--3-col"><div class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect item_heading" onclick=modify_field("' + keys[i] + ',' + themefields[keys[i]] + '") > <b>' + keys[i] + ':</b> </div><br><br><span id="' + keys[i] + '" >' + (tmp || "") + '</span></div>'
      } else {
        str += '<div class="mdl-cell mdl-cell--3-col"><div class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect item_heading" onclick=modify_field("' + keys[i] + ',' + themefields[keys[i]] + '") > <b>' + keys[i] + ':</b> </div><br><br><span id="' + keys[i] + '" >' + (course[keys[i]] || "") + '</span></div>'
      }
    }
  }
  tmp = ''
  getelem("fields").innerHTML = str;
}

function getcoursebyid(id) {
  db.get(id).then(function(course) {
    bootstrapattachments(course);
  }).catch(function(err) {
    console.log(err);
  });
}
//This function sets up the page, adding inputs elements of the template
//TODO - Add input fields for course fields not in template but in course ( probably an interface t o choose any type)


function getcourse() {
  var obj = window.course;
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
  var down_folder = zip.folder("downloads");
  var downpath = path.join(localStorage.appData, course.number, 'downloads')
  var down_files = getFiles(downpath);
  for (var i = down_files.length - 1; i >= 0; i--) {
    tfile = fs.readFileSync(path.join(downpath, down_files[i]), "utf8");
    down_folder.file(down_files[i], tfile);
  }
  var content = zip.generate({
    type: "blob"
  });
  saveAs(content, "course.zip");
  toggle_loader();
}

function createfolder(course, compiledsource, files, themepath, method) {
  var fs = require('fs');
  var dir = path.join(localStorage.appData, course.number);
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
  toggle_modal(method)
  toggle_loader();
}



function generatecourse(method, source_type) {
  toggle_loader();
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
    createfolder(course, compiledsource, files, themepath, source_type)
  }
}

function uploadgit() {
  var course = getcourse()
  var dir = path.join(localStorage.appData, course.number);
  var host = getelem('host').value;
  var reponame = getelem('grepo').value;
  var username = getelem('gusername').value;
  var password = getelem('gpassword').value;
  var client = github.client({
    username: username,
    password: password
  });
  var ghrepo = client.repo(reponame);

  client.get('/user', {}, function(err, status, body, headers) {
    console.log('stage1')
    if (err) {
      console.log(err)
      alertify.error("Incorrect Credentials or check Connection")
    } else {
      console.log('stage2')
      ghrepo.collaborators(username, function(err2, result) {
        console.log(err2)
        console.log('stage3')
        if (err) {
          alertify.error("You Need to have push Access to the Repository.Please check the Repository Format")
        } else {
          ghrepo.ref('head', function(err3, res) {
            if (err) {
              alertify.error("Reference not found")
            } else {
              sha = res[0]['object']['sha']
              ghrepo.create_reference('gh-pages4', sha, function(err, res) {
                console.log(err, res)
              })
            }
          });
          // ghrepo.contents('', "gh-pages", function(err, result) {
          //   // if (err) { //Need to create the gh-pages branch
          //"c973eb2190ad08c4c3ed1e720814d6bb54f5a9a7"
          // {ref: "refs/heads/gh-pages2", sha: "c973eb2190ad08c4c3ed1e720814d6bb54f5a9a7"}
          //{ref: "refs/heads/gh-pages2", sha: "c973eb2190ad08c4c3ed1e720814d6bb54f5a9a7"}


          //   // } else {

          //   // }
          // });
        }
      });
    }
  });
}

function uploadsftp() {
  var client = require('scp2');
  var course = getcourse()
  var dir = path.join(localStorage.appData, course.number);
  var host = getelem('host').value;
  var directory = getelem('directory').value;
  var hostpath = path.join(directory, "course", course.number);

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
    client.scp(dir, url, function(err) {
      if (!err) {
        alertify.success('Upload has been successful');
        toggle_modal('sftp');
      }
    })
  }

}

//This function toggles the modal based to the id provided
function toggle_modal(id) {
  el = document.getElementById(id);
  el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
}

//This function toggles the modal based to the id provided
function toggle_loader() {
  var item = document.querySelector('#loader') // Using a class instead, see note below.
  item.classList.toggle('is-active');
}

function iitksettings() {
  if (document.getElementById('checkbox-iitk').checked) {
    getelem('host').value = "webhome.cc.iitk.ac.in";
    getelem('directory').value = "/www/user/www/";
    alertify.warning('Replace user with your username in directory')
  }
}

function Upload_attachments() {
  var files = getelem('file_modal').files;
  var attachment_id = getelem('formfield-attachments').dataset.value;
  var course = window.course;
  // var files = evt.target.files; // FileList object
  var dir = path.join(localStorage.appData, course.number);
  // files is a FileList of File objects. List some properties.
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  var dir_down = path.join(dir, 'downloads');
  if (!fs.existsSync(dir_down)) {
    fs.mkdirSync(dir_down);
  }
  var output = [];
  //write the files to output array and update the result at the end to db and update ui
  async.eachSeries(files, function(f, callback) {
    var reader = new FileReader();
    var tmpname = path.join(dir_down, f.name)
    output.push({
      'ename': escape(f.name),
      'type': f.type || 'n/a',
      'size': f.size,
      'name': f.name
    });
    reader.onload = (function(theFile) {
      return function(e) {
        var data_url = e.target.result.split('base64,')[1]
        var buffer = new Buffer(data_url, 'base64');
        fs.writeFileSync(tmpname, buffer);
        callback()
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }, function(err) {
    var course = JSON.parse(localStorage.course)
    updatefilebyid(localStorage.id, course, output, attachment_id)
    // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  });

}

update_ui()