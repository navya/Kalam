var db = new PouchDB('courses');
var remoteCouch = false;

var add_course = function(course) {
	db.put(course, function callback(err, result) {
		if (!err) {
			alertify.success('The course has been created')
		}
	});

}

function showcourse() {
	db.allDocs({
		include_docs: true,
		descending: true
	}, function(err, doc) {
		var rows = doc.rows;
		if (rows.length) {
			var str = ''
			for (var i = rows.length - 1; i >= 0; i--) {
				str += getstr(rows[i].doc)
			}
			document.getElementById('main').innerHTML = str;
		} else {
			alertify.success('No courses found.')
		}

	});
}

function updatecoursebyid(id, course) {

	db.get(id).then(function(doc) {
		course._rev = doc._rev;
		course._id = id;
		return db.put(course);
	}).then(function(response) {
		alertify.success('course updated.')
	}).catch(function(err) {
		console.log(JSON.stringify(err));
	});
}

var getstr = function(course) {
	return '<div class="demo-card-event mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing"><div class="mdl-card__title mdl-card--expand"><h2 class="mdl-card__title-text">' + (course.course_title) + '</h2> </div><div class="mdl-card__supporting-text mdl-color-text--white-600"><!--Upcoming Announcements--></div><div class="mdl-card__actions mdl-card--border" style="background-color: white;color: #46B6AC;"><a href="single.html#course/' + course._id + '"class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" style="color: #46B6AC;">Open</a><div class="mdl-layout-spacer"></div><i class="material-icons">open_in_browser</i></div></div>'
}

//Dangerous
function emptydatabase(){
	indexedDB.deleteDatabase('_pouch_courses')
}