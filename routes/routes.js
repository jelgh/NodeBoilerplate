var passport = require('passport');
var auth = require('./auth');
var social = require('./social');

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { 
		return next(); 
	}
	res.redirect('/');
}

module.exports = {

	setup: function (app) {
		app.get('/', function(req, res){
			res.render('index', { user: req.user });
		});
		
		app.get('/register', auth.getRegister);
		app.post('/register', auth.postUser);
		app.get('/login', auth.getLogin);
		app.post('/login', passport.authenticate('local',  { 
			successRedirect: '/account', 
			failureRedirect: '/login'
		}));
		app.get('/logout', auth.logout);


		//might want to remove this one
		app.get('/users', ensureAuthenticated, social.getUsers);

		app.get('/account', ensureAuthenticated, social.getAccount);
		
	}
}