var express = require('express'),
passport = require('passport'),
util = require('util'), 
LocalStrategy = require('passport-local').Strategy,
routes = require('./routes/routes'),
db = require('./dbAccess'),
error = require('./error');


//var app = express();
var app = module.exports = express.createServer();


var dburi =  process.env.MONGODB_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/HelloMongoose';
var dboptions = { db: { safe: true }};

db.startup(dburi, dboptions);

//db.startup(dburi, dboptions);

// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/../../public'));
});

app.configure('development', function(){
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	app.use(error({ showMessage: true, dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  //app.use(express.errorHandler()); 
	app.use(error());
});

/*
app.configure('development', function(){
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});
*/


/*
app.configure('production', function(){
	app.use(express.errorHandler()); 
});
*/


routes.setup(app);


var port = process.env.PORT || 9000;
app.listen(port);
