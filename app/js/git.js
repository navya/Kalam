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
						console.log(res, results.children)
						results.children[dir] = res;
						if (!--pending) {
							done(null, results);
						}
					});
				} else {
					var s = fs.ReadStream(filepath);
					var shasum = crypto.createHash(algo);
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