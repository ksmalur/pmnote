var express = require('express'),
	bodyParser = require('body-parser'),
	session = require ('express-session'),
	crypto	= require('crypto'),
	uuid	= require('node-uuid'),
	mongoose = require('mongoose');


var acRouter 	= express.Router();



	var userSchema	= new mongoose.Schema({
			userId: String,
			userName: String,
			password: String
	},{
			collection: 'Users'
	});

var UserModel	= mongoose.model('User', userSchema);

function hash(password){
	return crypto.createHash('sha256').update(password).digest('hex');
}

acRouter
    .use(bodyParser.urlencoded())
    .use(bodyParser.json())
    .use(session({ secret: 'adshlqr3kqwefsadjklqrwefdsbzcjxcq4rewfadshj'}))	
    .get('/login', function (req, res){
		res.sendFile('public/login.html');
	})
	.post('/login', function (req, res){
			var loginUser = {
				userName: req.body.username,
				password: hash(req.body.password) 
			};
			var query = UserModel.where(loginUser);
			query.findOne(function (err, data){
				if(data){
					res.session.userId = data.userId;
					res.redirect('/');
				} else {
					res.redirect('/login');
				}
			});
	})
	.post('/register', function (req, res){
		var user = new UserModel(req.body);
		user.userId	= uuid.v1();
		user.options = {};
		var query = UserModel.where({userName: user.userName});
 
		query.find( function (err, data){
			if (!data.length){
				user.save(function (err, data){
					if (err) {
						console.log("Error while trying to register a user");
						console.log(err);
					} else {
						req.session.userId = data.userId;
						res.redirect('/');
					}
				});

			} else {
				res.redirect('/login');
			}
		});
	})
	.get('/logout', function (req, res){
		req.session.userId = null;
		res.redirect('/');
	})
	.use(function (req, res, next){
		if (req.session.userId){
			UserModel.findOne({userId: req.session.userId}, function(err, data){
				req.user = data;
			});
		}
		next();
	});

module.exports = acRouter;