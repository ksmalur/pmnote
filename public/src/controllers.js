function updateNoteType($scope){
	if ($scope.note.noteTitle !== "") {
			//	console.log("Printing on BlurUpdate - " + $scope.note.noteTitle);
				var riskString = "@risk";
				var issueString = "@issue";
				var aiString = "@ai";	
				var titleString = $scope.note.noteTitle;
				
				titleString = titleString.toLowerCase();
				var selectedType = "";

				riskOcc = titleString.indexOf(riskString);
				issueOcc = titleString.indexOf(issueString);		
				aiOcc = titleString.indexOf(aiString);

				// console.log("Risk Occ = " + riskOcc);
				// console.log("Issue Occ = " + issueOcc);
				// console.log("AI Occ = " + aiOcc);
				
				// console.log("*****************");

				if (riskOcc == -1) riskOcc = 9999;
				if (issueOcc == -1) issueOcc = 9999;
				if (aiOcc == -1) aiOcc = 9999;

				// console.log("Risk Occ = " + riskOcc);
				// console.log("Issue Occ = " + issueOcc);
				// console.log("AI Occ = " + aiOcc);

				if (riskOcc < issueOcc && riskOcc < aiOcc){
					// console.log("Risk Occurence");
					selectedType = "Risk";
				} else if (issueOcc < riskOcc && issueOcc < aiOcc){
					//console.log("Issue Occurence");
					selectedType = "Issue";
				}else if (aiOcc < riskOcc && aiOcc < issueOcc){
					// console.log("AI Occurence");
					selectedType = "Action Item";
				}

				$scope.note.noteType = selectedType;
			} 
			else {
				$scope.note.noteType = "";
			}
}


angular.module('PMNoteApp')
	.controller('NoteController', function($scope, NoteResource, $location){
		$scope.notes = NoteResource.query();
		$scope.query = "";
		$scope.fields = ['noteTitle', 'noteDesc', 'noteType', 'noteStatus', 'noteOwner'];
		$scope.pop = function  (noteId, context) {
			// body...
			var prefix = "";
			if (context == "edit"){
				prefix = "/note/";
			} else if (context == "update"){
				console.log("HO 1");
				prefix = "/note/update/";
			}

			var myUrl = prefix + noteId;
			console.log("Trying to " + context + '<--->' + myUrl);
			$location.url(myUrl);

		};
	})
	.controller('NewController', function($scope, NoteResource, $location, $timeout){

		$scope.note = new NoteResource();
		$scope.note.noteTitle="";

		$scope.save = function() {
			if ($scope.newNote.$invalid){
				console.log("Error in Save");
				$scope.$broadcast('record:invalid');
			} else {
				console.log("Saving Document");
				$scope.note.$save();
				$location.url('/notes');
			}	
		};

		$scope.blurUpdateType = function() {
			updateNoteType($scope);
		};
		var saveTimeOut;
		$scope.updateType = function() {
			$timeout.cancel(saveTimeOut);
			saveTimeOut = $timeout($scope.blurUpdateType, 500);
		};

	})
	.controller('SingleController', function($scope, $document, NoteResource, $routeParams, $location, $timeout){
		$scope.note= NoteResource.get({noteId: $routeParams.noteId});

		$scope.update = function(){
				console.log('Update in Progress');
				$scope.note.$update({noteId: $routeParams.noteId});
				$location.url('/notes');

		};

		$scope.blurUpdateType = function() {
			updateNoteType($scope);
		};
		var saveTimeOut;
		$scope.updateType = function() {
			$timeout.cancel(saveTimeOut);
			saveTimeOut = $timeout($scope.blurUpdateType, 500);
		};

		$scope.delete = function () {
			// body...
			$scope.note.$delete();
			$location.url('/notes');
		};
	})
	.controller('UpdateController', function($scope,UpdateResource,$location, $timeout, $routeParams){
		$scope.myUpdate = [{updateId: ""}];
		$scope.newUpdateIndex = -1;
		console.log("HO 2");
		$scope.note = UpdateResource.get({noteId: $routeParams.noteId});
		


		$scope.postUpdate = function(){
			//console.log("1");

			$scope.newUpdateIndex = $scope.note.noteUpdates.length;
			// console.log("2: Note uPdate Length " + $scope.note.noteUpdates.length);
			

			$scope.myUpdate[0].updateId = $scope.newUpdateIndex;
			// console.log("3: my Update ID Updated: " + $scope.myUpdate);

		//	$scope.myUpdate[0].updateText = "";
			// console.log("4: my Update Text Updated: " + $scope.myUpdate[0].updateText);

			
			// console.log("5: Printing my Update: " + JSON.stringify($scope.myUpdate[0]));

			$scope.note.noteUpdates.push($scope.myUpdate);
			
			$scope.newUpdateIndex = $scope.note.noteUpdates.length;
			// console.log("6 :" + $scope.note.noteUpdates.length);
			// console.log("6 :" + $scope.newUpdateIndex);

			// console.log("7: " + $scope.note.noteUpdates[$scope.myUpdate[0].updateId].updateId);
			// console.log("8:" + $scope.note.noteUpdates[$scope.myUpdate[0].updateId].updateText);
			// console.log("9:POST: " + JSON.stringify($scope.note.noteUpdates[$scope.myUpdate[0].updateId]));

			console.log("Object Pushing ********************");
			console.log(JSON.stringify($scope.note));
			console.log("Object Pushing ********************");
			$scope.note.$update({noteId: $routeParams.noteId});
			$location.url('/notes');
		};

		$scope.see = function(){

		};
	});