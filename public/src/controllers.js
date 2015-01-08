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
	.controller('NoteController', function($scope, NoteResource, $location, $rootScope){
		$scope.notes = NoteResource.query();
		$rootScope.PAGE = "all";
		$scope.query = "";

		$scope.fields = ['noteTitle', 'noteDesc', 'noteType', 'noteStatus', 'noteOwner'];
		$scope.pop = function  (noteId, context) {
			// body...
			var prefix = "";
			if (context == "edit"){
				prefix = "/note/";
			} else if (context == "update"){
				prefix = "/note/update/";
			}

			var myUrl = prefix + noteId;
			$location.url(myUrl);

		};

	})
	.controller('NewController', function($scope, NoteResource, $location, $timeout, $rootScope){

		$scope.note = new NoteResource();
		$scope.note.noteTitle="";
		$rootScope.PAGE= "new";

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
	.controller('SingleController', function($scope, $rootScope, NoteResource, $routeParams, $location, $timeout){
		$scope.note= NoteResource.get({noteId: $routeParams.noteId});
		$rootScope.PAGE = "edit";
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
	.controller('UpdateController', function($scope, $rootScope, UpdateResource,$location, $timeout, $routeParams){
		$scope.myUpdate = [{updateId: ""}];
		$scope.newUpdateIndex = -1;
		$rootScope.PAGE = "update";
		console.log("HO 2");
		$scope.note = UpdateResource.get({noteId: $routeParams.noteId});
		//$scope.updatesList = $scope.noteUpdates;


		$scope.postUpdate = function(){

			$scope.newUpdateIndex = $scope.note.noteUpdates.length;
			$scope.myUpdate[0].updateId = $scope.newUpdateIndex;
			$scope.myUpdate[0].updateOwner = "kmalur";
			$scope.note.noteUpdates.push($scope.myUpdate[0]);
			$scope.newUpdateIndex = $scope.note.noteUpdates.length;
			$scope.note.$update({noteId: $routeParams.noteId});
			$location.url('/notes');
		};

		$scope.see = function(){

		};
	});