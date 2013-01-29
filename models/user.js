var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passport = require('passport');
var crypto = require('crypto');

var UserSchema = new Schema({
	username: 	{ type: String, required: true },
	salt: 		{ type: String, required: true },
	hash: 		{ type: String, required: true }
});

function hash(pass, salt) {
	var h = crypto.createHash('sha512');
	h.update(pass);
	h.update(salt);
	return h.digest('base64');
}

function makeSalt() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
}

UserSchema.virtual('password').get(function () {
	return this._password;
}).set(function (password) {
	this._password = password;
	var salt = this.salt  = makeSalt();
	this.hash = hash(password, salt);
});

UserSchema.method('verifyPassword', function(password, callback) {
	if(hash(password, this.salt) === this.hash) {
		callback(null, true);
	} else {
		callback(null, false);
	}
});

UserSchema.static('authenticate', function(username, password, callback) {
	this.findOne({ username: username }, function(err, user) {
		
		if (err) { 
			return callback(err); 
		} else if (!user) { 
			return callback(null, false); 
		}

		console.log(user);

		user.verifyPassword(password, function(err, passwordCorrect) {
			if (err) { 
				return callback(err); 
			}
			if (!passwordCorrect) { 
				return callback(null, false); 
			}
			return callback(null, user);
		});
	});
});

module.exports = mongoose.model('User', UserSchema);

