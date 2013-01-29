var db = require('../dbAccess');

function sendJson(res, next, err, obj) {
	if(!err) {
		res.json(obj);
	} else {
		next(new Error(err));
	}
}


module.exports = {

	getAccount: function(req, res, next) {
		res.render('account', { user: req.user });
	},
	getUsers: function(req, res, next){
		db.getUsers(function(err, users) {
			if(!err) {
				res.render('users', {user : req.user, users : users});
			} else {
				next(new Error(err));
			}
		});
	},
};


