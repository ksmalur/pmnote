angular.module('PMNoteApp')
	.controller('NoteController', function($scope, NoteResource, $location){
		$scope.notes = NoteResource.query();
		$scope.query = "";
		$scope.fields = ['noteTitle', 'noteDesc', 'noteType', 'noteStatus', 'noteOwner'];
		$scope.pop = function  (noteId) {
			// body...
			var myUrl = '/note/' + noteId;
			console.log("Trying to Edit " + myUrl);
			$location.url(myUrl);

		};
	})
	.controller('NewController', function($scope, NoteResource, $location){

		$scope.note = new NoteResource();

		$scope.save = function() {
			if ($scope.newNote.$invalid){
				console.log("Error in Save");
				$scope.$broadcast('record:invalid');
			} else {
				console.log("Saving DOcument");
				$scope.note.$save();
				$location.url('/notes');
			}	
		};

	})
	.controller('SingleController', function($scope, $document, NoteResource, $routeParams, $location){
		$scope.note= NoteResource.get({noteId: $routeParams.noteId});

		$scope.update = function(){
				console.log('Update in Progress');
				$scope.note.$update({noteId: $routeParams.noteId});
				$location.url('/notes');

		};

		$scope.delete = function () {
			// body...
			$scope.note.$delete();
			$location.url('/notes');
		};
	});