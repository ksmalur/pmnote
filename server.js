var express	= require('express'),
	path	= require('path'),
	users   = require('./accounts'),
	api 	= require('./api'),
	// settings = require('./settings')
	app		= express();

var publicFolderRoot = "{root: path.join(__dirname, '/public'}";

app
	.use(express.static('./public'))
	.use(users)
	.use('/api', api)
	// .use('/settings', settings)
	.get('*', function  (req,res) {
		console.log("Stage 1: Entered Server JS: " + req.user);
		if (!req.user){
			console.log("Stage 1.1: There is no req.user element");
			res.redirect('/login');
		} else {
			res.sendFile('main.html', {root: path.join(__dirname, '/public')});
		}
	})
	.listen(3000, function(){
		console.log("Listening on Port 3000");
	});