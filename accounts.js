var express = require('express'),
	bodyParser = require('body-parser'),
	session = require ('express-session'),
	crypto	= require('crypto'),
	path    = require('path'),
	uuid	= require('node-uuid')
	mongoose = require('mongoose');


var router 	= express.Router();

var publicFolderRoot = "{root: path.join(__dirname, '/public'}";


	var userSchema	= new mongoose.Schema({
			userid: Number,
			username: String,
			password: String
	},{
			collection: 'Users'
	});

var UserModel	= mongoose.model('User', userSchema);

function hash(password){
	return crypto.createHash('sha256').update(password).digest('hex');
}

router
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(session({ secret: 'adshlqr3kqwefsadjklqrwefdsbzcjxcq4rewfadshj', saveUninitialized: true, resave: true}))	
    .get('/login', function (req, res){
    		console.log("Stage 2: Sending Login HTML");
			res.sendFile('login.html', {root: path.join(__dirname, '/public')});
	})
	.post('/login', function (req, res){
			var loginUser = {};
				loginUser.username =  req.body.username;
				loginUser.password = hash(req.body.password); 
			console.log("Stage 3: Entered POST LOGIN");
			var query = UserModel.where(loginUser);
			query.findOne(function (err, data){
				if(err) {
					console.log(err);
				} else {

					if(data){
						req.session.userid = data.userid;
						req.session.user = data;
						console.log(" Stage 4: Login Successs redirecting.. to /");
						console.log(" Stage 4.5: Just after redirect.");
						res.redirect("/");
					} else {
						res.redirect('/login');
					}
				}
			});
	})
	.post('/register', function (req, res){
		var user = new UserModel();
		user.userid	= 2; //will be uuid.v1();
		user.username = req.body.username;
		user.password = hash(req.body.password);
		user.options = {};
		var query = UserModel.where({userName: user.username});
 		console.log(user);
		query.find( function (err, data){
			if (!data.length){
				user.save(function (err, data){
					if (err) {
						console.log("Error while trying to register a user");
						console.log(err);
					} else {
						req.session.userid = data.userid;
						res.redirect('/');
					}
				});

			} else {
				res.redirect('/login');
			}
		});
	})
	.get('/logout', function (req, res){
		req.session.userid = null;
		res.redirect('/');
	})
	.use(function (req, res, next){
		console.log("Stage 6: Loading User Accounts Data");
		console.log(req.user);
		// if (req.session.userid){
		// 	var query = UserModel.where({userid: req.session.userid});
		// 	console.log("Stage 6.5" );
		// 	query.findOne (function(err, data){
		// 		if(err) {
		// 			console.log("Stage 6.6: May be an eeror here");
		// 			console.log(err);	
		// 		} else {
		// 			if (data){
		// 				req.user = data;
		// 				console.log(" Stage 7: Data is stored:" + req.user);
		// 			} else {
		// 				console.log("Stage 8")
		// 			}
		// 		}
		// 	});
		// } 
		next();
	});

module.exports = router;