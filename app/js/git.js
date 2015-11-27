var diff = require('deep-diff').diff;
var Crypto = require('crypto');
var tree = function(dir, done) {
	var results = {
		"path": dir,
		"children": {}
	};
	fs.readdir(dir, function(err, list) {
		if (err) {
			return done(err);
		}
		var pending = list.length;
		if (!pending) {
			return done(null, results);
		}
		list.forEach(function(file) {
			var filepath = path.join(dir, file);
			fs.stat(filepath, function(err, stat) {
				if (stat && stat.isDirectory()) {
					tree(filepath, function(err, res) {
						results.children[dir] = res;
						if (!--pending) {
							done(null, results);
						}
					});
				} else {
					var s = fs.ReadStream(filepath);
					var shasum = Crypto.createHash('sha1');
					s.on('data', function(d) {
						shasum.update(d);
					});
					s.on('error', function(err) {
						console.log(err)
					});
					s.on('end', function() {
						var d = shasum.digest('hex');
						results.children[d] = filepath
						if (!--pending) {
							done(null, results);
						}

					})
				};
			});
		});
	})
}

var actionDiff = function(dir, old_tree, done) {
	var results = {
		"path": dir,
		"children": {}
	};
	fs.readdir(dir, function(err, list) {
		if (err) {
			return done(err);
		}
		var pending = list.length;
		if (!pending) {
			return done(null, []);
		}
		list.forEach(function(file) {
			var filepath = path.join(dir, file);
			fs.stat(filepath, function(err, stat) {
				if (stat && stat.isDirectory()) {
					tree(filepath, function(err, res) {
						results.children[dir] = res;
						if (!--pending) {
							var tmptree = JSON.parse(old_tree);
							var differences = diff(tmptree, results);
							done(null, differences);
						}
					});
				} else {
					var s = fs.ReadStream(filepath);
					var shasum = Crypto.createHash('sha1');
					s.on('data', function(d) {
						shasum.update(d);
					});
					s.on('error', function(err) {
						console.log(err)
					});
					s.on('end', function() {
						var d = shasum.digest('hex');
						results.children[d] = filepath
						if (!--pending) {
							var tmptree = JSON.parse(old_tree);
							var differences = diff(tmptree, results);
							done(null, differences);
						}

					})
				};
			});
		});
	})
}

var actionTree = function(dir, action, done) {
	var results = {
		"path": dir,
		"children": {}
	};
	fs.readdir(dir, function(err, list) {
		if (err) {
			return done(err);
		}
		var pending = list.length;
		if (!pending) {
			return done(null, results);
		}
		list.forEach(function(file) {
			var filepath = path.join(dir, file);
			fs.stat(filepath, function(err, stat) {
				if (stat && stat.isDirectory()) {
					tree(filepath, function(err, res) {
						results.children[dir] = res;
						if (!--pending) {
							done(null, results);
						}
					});
				} else {
					var s = fs.ReadStream(filepath);
					var shasum = Crypto.createHash('sha1');
					var FileData = '';
					s.on('data', function(d) {
						shasum.update(d);
						FileData += d;
					});
					s.on('error', function(err) {
						console.log(err)
					});
					s.on('end', function() {
						var d = shasum.digest('hex');
						action(filepath, FileData);
						results.children[d] = filepath
						if (!--pending) {
							done(null, results);
						}

					})
				};
			});
		});
	})
}