var express = require('express'),
	bodyParser = require('body-parser'),
	fsextra	= require('fs-extra'),
	fs 		= require('fs'),
	router 	= express.Router();

var themesFolder = "./public/lib/bootstrap/dist/css/themes";
var destFolder = "./public/lib/bootstrap/dist/css/";
router 
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .all(function(req, res){
    	console.log("Heelo All");
    	next();
    })
	.get('/themes', function (req, res, next){
		fs.readdir(themesFolder, function (err, files){
			var data = {
				themes: []
			};
			var fndSel = false;
			if(err){
				console.log (err);
			} else {

				for (var i=0 ; i< files.length ; i++){
					var tmp = {};
					if (!fndSel){
						var selCnt = files[i].search(".selected");
						if (selCnt > 0) {
							tmp.selected = true;
							fndSel = true;
						}
					} else {
						tmp.selected = false;
					}
					var selCut = files[i].search(".bootstrap");
					var inp  = files[i].substr(0, selCut);
					tmp.displayname = inp[0].toUpperCase() + inp.slice(1);
					tmp.filename = files[i];
					data.themes.push(tmp);
				}
			}
			res.json(data);
			
		})
	})
	.post('/themes', function (req, res, next) {
		
		//  Copy the New File to the staging location as bootstrap.min.css
		var src = themesFolder + "/" + req.body.filename;
		var dest = destFolder + "bootstrap.min.css";
		console.log(src);
		console.log(dest);

		fsextra.copy(src, dest, {replace: true}, function (err) {
			if (err) {
				console.log("Error while trying to save theme: 1");
				console.log(err);
			} else {

				// rename the previously selected.theme.bootstrap.css to theme.bootstrap.css
				var oldPath = themesFolder + "/" + req.body.currentSelFile;
				var cut = req.body.currentSelFile.search(".selected");
				newPath = req.body.currentSelFile.substr(0,cut);
				newPath = themesFolder + "/" + newPath;

				console.log(oldPath);
				console.log(newPath);
				fs.rename(oldPath, newPath, function (err) {
					if (err) {
						console.log("Error while trying to save theme : 2");
						console.log(err);
					} else {

						//rename new file to selected.theme.bootstrap.ccc

						oldPath = themesFolder + "/" + req.body.filename;
						newPath = oldPath + ".selected";

						console.log(oldPath);
						console.log(newPath);
						fs.rename(oldPath, newPath, function (err) {
							if (err) {
								console.log("Error while trying to save theme : 3");
								console.log(err);
							} else {
								console.log ("Theme Changed Successfully ");
								res.redirect("/");
							}	
						 });
					}
				});
			}
		});

		



	});

module.exports = router;