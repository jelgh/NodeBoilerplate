// Module dependencies
var safe_datejs = require('safe_datejs');
var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/user');


passport.use(new LocalStrategy({
	usernameField: 'username'
}, function(username, password, done) {
	User.authenticate(username, password, function(err, user) {
		return done(err, user);
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = {

	startup: function(uri, options) {
		mongoose.connect(uri, options, function(err, a) {
			console.log(err);
		});
		mongoose.connection.on('open', function() {
			console.log('We have connected to mongodb');
		}); 

	},

	closeDB: function() {
		mongoose.disconnect();
	},





	/* USER STUFF*/

	saveUser: function(userInfo, callback) {
		var newUser = new User ({
			name: userInfo.name,
			username: userInfo.username,
			password: userInfo.password
		});

		newUser.save(function(err) {
			callback(err, userInfo);
		});
	},

	getUsersByUsername: function(info, callback) {
		User.find({'username': new RegExp('^' + info.username)}, function(err, users) {
			callback(err, users);
		});
	},

	getUsers: function(callback) {
		User.find({}, 'name username', function(err, users) {
			callback(err, users);
		});
	},








	/* PROJECT STUFF */

	getProjects: function(info, callback) {
		Project.find({ '_owner': info.uid }, function(err, projects) {
			callback(err, projects);
		});
	},

	saveProject: function(info, callback) {
		var project = new Project ({
			_owner : info.uid,
			name: info.name
		});

		project.save(function(err) {
			callback(err, project);
		});
	},
	
	getProject: function(info, callback) {
		Project.findById(info.pid)
		.populate('reports', null, null, {limit: 365})
		.exec(function(err, project) {
			callback(err, project);
		});
	},
	
	deleteProject: function(info, callback) {
		Project.findById(info.pid, function (err, project) {
			if(project) {
				project.remove();
			}
			callback(err);
		});
	},

	addReportToProject: function(info, callback) {

		Project.findById(info.pid, function (err, project) {
			if(!err) {
				var report = new Report ({
					amount : info.amount,
					regard: info.regard
				});
				report.save(function(err) {
					if(!err) {
						project.reports.push(report._id);
						project.save(function(err) {
							callback(err, project);
						});
					} else {
						callback(err, null);
					}
				});
			}
		});
	}


};







