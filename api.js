var express		= require('express'),
	mongoose 	= require('mongoose'),
	bodyParser	= require('body-parser'),
	uuid		= require('node-uuid'),
	router		= express.Router();

	//Mongoose Connection
	mongoose.connect('mongodb://localhost:27017/pmnotedb');
	var db		= mongoose.connection;

	//Schema Definition
	var updateSchema	= new mongoose.Schema({
			updateId: String,
			updateText: String,
			updateOwner: String,
			updateCreatedOn: {type: String, default: Date.now},
	});

	var noteSchema	= new mongoose.Schema({
		noteId: String,
		noteTitle: String,
		noteDesc: String, 
		noteOwner: String,
		noteCreatedOn: {type: String, default: Date.now},
		noteCreatedBy: String,
		noteType: {type: String, enum: ['Action Item', 'Issue', 'Risk', 'Others']},
		noteStatus:  {type: String, enum: ['Open', 'In Progress', 'Blocked', 'Closed']},
		noteLastUpdatedOn: {type: String, default: Date.now},
		noteUpdates: [updateSchema]
	},
	{
			collection: 'Notes'
	});

	db.on('error', function(err) {
		console.log("Hello " + err);
	});
	db.on('open', function() {
		NoteModel	= mongoose.model('Note', noteSchema);
		UpdateModel = mongoose.model('Update', updateSchema);
	});	


router
	.use(bodyParser.json())
	.route('/note')
		.get(function( req, res) {
			console.log("I AM HERE: " + req.user);
			NoteModel.find({noteOwner : req.user.username}, function(err, data){
				console.log("Found " + data.length + " note(s).");
				res.json(data);
			});
		})
		.post(function(req, res) {
			var note = new NoteModel(req.body);
			note.noteId	= uuid.v1();
			note.noteOwner = req.user.username;
			note.noteCreatedBy	= req.user.username;
			note.noteStatus = "Open";
			note.save(function(err, data) {
				if (err){
					console.log("Error while trying to save a document");
					console.log(err);
				} else {
					res.json(data);
				}
			});
			
		});

router 
	.param('noteId', function(req, res, next) {
		//console.log('Received Param -' + req.params.noteId);
		req.query = NoteModel.where({noteId: req.params.noteId});	
		//console.log(req.query);
		console.log("HO 3");
		next();
	})
	.route('/note/:noteId')
		.get(function (req, res, next){
			req.query.findOne(function(err, data){
				if(err) {
					console.log('Failed to get the note id -' + req.params.noteId );
					console.log(err);
				} else {
					console.log("HO 99 ID Found " + data.noteId + " note(s).");
					res.json(data);
				}
			});
		})
		.put(function(req, res) {
			var conditions = {noteId: req.params.noteId};
			var note = req.body;
			delete note.$promise;
			delete note.$resolved;
			delete note._id;
			note.noteLastUpdatedOn = Date.now().toString();
			NoteModel.findOneAndUpdate(conditions, note, function (err, data){
				if (err) {
					console.log('Error while trying to update the note -' + req.params.noteId);
					console.log(err);
				} else {
					res.json(data);
				}
			});
		})
		.delete(function  (req, res) {
			// body...
			req.query.findOne(function (err, data){
				data.remove(function (err){
					if (err) {
						console.log("Error while trying to delete the note - " + req.params.noteId);
						console.log(err);
					} else {
						res.json(null);
					}
				});
			});
		});


router
	.route("/note/update/:noteId")
		.get(function (req, res, next){
				var query = NoteModel.where({noteId: req.params.noteId});	
					query.findOne(function(err, data){
						if(err) {
							console.log('Failed to get the note id -' + req.params.noteId );
							console.log(err);
						} else {
							//console.log("Found the Note HO 5: " + data) ;
							res.json(data);
						}
					});
				})
		.put(function(req, res) {
			var conditions = {noteId: req.params.noteId};
			var note = req.body;
			console.log(req.body);

			delete note.$promise;
			delete note.$resolved;
			delete note._id;
			note.noteLastUpdatedOn = Date.now().toString();
			NoteModel.findOneAndUpdate(conditions, note, function (err, data){
				if (err) {
					console.log('Error while trying to update the note -' + req.params.noteId);
					console.log(err);
				} else {
					console.log("PUT Successfull\n***************" + data );
					res.json(data);
				}
			});
		});

router
	
module.exports = router;