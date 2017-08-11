var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	path = require('path'),
	zlib = require('zlib'),
	mime = require('./mime').types,
	config = require('./config'),
	utils = require('./utils'),
	cfg = JSON.parse(fs.readFileSync('./servercfg.json'));

var serverFun = function(port, root) {
	var PORT = port;
	//var rootDir = 'D:/projects/xin_html/b2c/trunk/xin-wap';
	var rootDir = root;

	http.createServer(function(request, response) {

		response.setHeader("Server", "B1/Node");

		var pathname = decodeURI(url.parse(request.url).pathname);

		//if (pathname.slice(-1) === "/") {
		//	pathname += config.Welcome.file;
		//}

		var _rp = rootDir + pathname;
		var pathHandle = function(realpath) {
			fs.stat(realpath, function(err, stat) {
				if (err) {
					response.writeHead(404, "Not Found", {
						'Content-Type': 'text/plain'
					});
					response.write("This request URL " + pathname + " was not found on this server.");
					console.log('This request URL ' + realpath + ' was not found on this server.');
					response.end();
					return;
				}

				if (stat.isDirectory()) {
					//realpath = path.join(realpath, "/", config.Welcome.file);
					//pathHandle(realpath);
				    response.setHeader('Content-Type', "text/html; charset=utf-8");
		            pathname = pathname == '/' ? "" : pathname;
					var tmp = "<a style='display:block' href='" + pathname + "/$name$'>$name$</a>";
					var files = fs.readdirSync(realpath);
					for(var f in files)
					{
						response.write(tmp.replace(/\$name\$/g,files[f]));
					}
					response.end();
					return;
				}
				var ext = path.extname(realpath);
				ext = ext ? ext.slice(1) : 'unkown';
				var contentType = mime[ext] || 'text/plain';
				response.setHeader('Content-Type', contentType);

				var lastModified = stat.mtime.toUTCString();
				var ifModifiedSince = "If-modified-Since".toLowerCase();
				response.setHeader("Last-Modified", lastModified);

				if (ext.match(config.Expires.fileMatch)) {
					var expires = new Date();
					expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
					response.setHeader("Expires", expires.toUTCString());
					response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
				}
				// if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
				// response.writeHead(304, "Not Modified");
				// response.end();
				// return;
				// }

				var compressHandle = function(raw, statusCode, reasonPhrase) {
					var stream = raw;
					var acceptEncoding = request.headers['accept-encoding'] || '';
					var matched = ext.match(config.Compress.match);
					if (matched && acceptEncoding.match(/\bgzip\b/)) {
						response.setHeader("Content-Encoding", "gzip");
						stream = raw.pipe(zlib.createGzip());
					} else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
						response.setHeader("Content-Encoding", "deflate");
						stream = raw.pipe(zlib.createDeflate());
					}

					response.writeHead(statusCode, reasonPhrase);
					stream.pipe(response);
				};

				if (request.headers["range"]) {
					var range = utils.parseRange(request.headers["range"], stat.size);

					if (range) {
						response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "-" + stat.size);
						response.setHeader("Content-length", (range.end - range.start + 1));
						var raw = fs.createReadStream(realpath, {
							"start": range.start,
							"end": range.end
						});
						compressHandle(raw, 206, "Partial Content");
					} else {
						response.removeHeader("Content-Length");
						response.writeHead(416, "Request Range Not Satisfiable");
						response.end();
					}
				} else {
					var raw = fs.createReadStream(realpath);
					compressHandle(raw, '200', 'OK');
				}
			});
		};
		pathHandle(_rp);
	}).listen(PORT);

	console.log("server running at port:" + PORT + " url:" + root + ".");
};

if(cfg.statices && cfg.statices.port && cfg.statices.port && cfg.statices.isrun)
{
	(function(p, r) {
		serverFun(p, r);
	})(cfg.statices.port, cfg.statices.root);
}

cfg.servers = cfg.servers ? cfg.servers : [];

for (var i = 0; i < cfg.servers.length; i++) {
	
	if(!cfg.servers[i].isrun || cfg.servers[i].isrun != true) continue;

	(function(p, r) {
		serverFun(p, r);
	})(cfg.servers[i].port, cfg.servers[i].root);
}