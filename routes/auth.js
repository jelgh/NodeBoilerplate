var db = require('../dbAccess');


module.exports = {



	getRegister: function(req, res, next) {
		res.render('register', {user : req.user});
	},

	getLogin: function(req, res, next) {
		res.render('login', {user : req.user});
	},

	postUser: function(req, res, next) {
		db.saveUser({
			username : req.body.username,
			password : req.body.password
		}, function(err, docs) {
			
			if(!err) {
				res.redirect('/account');
			} else {
				next(new Error(err));
			}
		});
	},
	logout: function(req, res){
		req.logout();
		res.redirect('/');
	},
	
	user: function(req, res, next) {
		db.getUsersByUsername({username: req.query.q}, function(err, users) {
			if(!err) {
				res.json(users);
			} else {
				next(new Error(err));
			}
		});
	},

};


