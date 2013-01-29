
exports = module.exports = function errorHandler(options){
	options = options || {};
	// defaults
	var showStack = options.showStack
	, showMessage = options.showMessage
	, dumpExceptions = options.dumpExceptions
	, logErrors = options.logErrors
	, logErrorsStream = false;

	return function errorHandler(err, req, res, next){
		res.statusCode = 500;

		if(dumpExceptions) console.error(err.stack);

		if(logErrors){
			var now = new Date();
			logErrorsStream.write(now.toJSON() + ' - Error Happened: \n' + err.stack + "\n");
		}

		var accept = req.headers.accept || '';
		if(showStack) {
			// html
			if (~accept.indexOf('html')) {
				res.render('error', {
					stack: err.stack || '', 
					error: err.toString(),
					user: req.user
				});
			// json
		} else if (~accept.indexOf('json')) {
			var json = JSON.stringify({ error: err });
			res.setHeader('Content-Type', 'application/json');
			res.end(json);
			// plain text
		} else {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end(err.stack);
		}
	}else{
			// public error page render
			// html
			if (~accept.indexOf('html')) {
				res.render('error', {});
			// json
		} else if (~accept.indexOf('json')) {
			var json = JSON.stringify({ error: "There was a server error generating the content." });
			res.setHeader('Content-Type', 'application/json');
			res.end(json);
			// plain text
		} else {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end("500 - Server Error");
		}
	}
};
};
