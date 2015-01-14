var express	= require('express'),
	api 	= require('./api'),
	path	= require('path'),
	settings = require('./settings')
	app		= express();

var publicFolderRoot = "{root: path.join(__dirname, '/public'}";

app
	.use(express.static('./public'))
	.use('/api', api)
	.use('/settings', settings)
	.get('*', function  (req,res) {
		res.sendFile('main.html', {root: path.join(__dirname, '/public')});
	})
	.listen(3000, function(){
		console.log("Listening on Port 3000");
	});