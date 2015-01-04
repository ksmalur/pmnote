var express	= require('express'),
	api 	= require('./api'),
	path	= require('path'),
	app		= express();

var publicFolderRoot = "{root: path.join(__dirname, '/public'}";

app
	.use(express.static('./public'))
	.use('/api', api)
	.get('*', function  (req,res) {
		res.sendFile('main.html', {root: path.join(__dirname, '/public')});
	})
	.listen(3000, function(){
		console.log("Listening on Port 3000");
	});