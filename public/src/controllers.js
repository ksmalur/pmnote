function updateNoteType($scope){
	if ($scope.note.noteTitle !== "") {
				var riskString = "@risk";
				var issueString = "@issue";
				var aiString = "@ai";	
				var titleString = $scope.note.noteTitle;
				
				titleString = titleString.toLowerCase();
				var selectedType = $scope.note.noteType;

				riskOcc = titleString.indexOf(riskString);
				issueOcc = titleString.indexOf(issueString);		
				aiOcc = titleString.indexOf(aiString);

		
				if (riskOcc == -1) riskOcc = 9999;
				if (issueOcc == -1) issueOcc = 9999;
				if (aiOcc == -1) aiOcc = 9999;

				if (riskOcc < issueOcc && riskOcc < aiOcc){
					selectedType = "Risk";
				} else if (issueOcc < riskOcc && issueOcc < aiOcc){
					selectedType = "Issue";
				}else if (aiOcc < riskOcc && aiOcc < issueOcc){
					selectedType = "Action Item";
				}

				$scope.note.noteType = selectedType;
			} 
			else {
				$scope.note.noteType = "";
			}
}


angular.module('PMNoteApp')
	.controller('NoteController', function($scope, NoteResource, $location, $rootScope, filterFilter, $filter){
		$scope.notes = NoteResource.query();

		$scope.noteStatusList = [ 'All', 'Open', 'In Progress', 'Blocked', 'Closed'];
		$scope.noteTypeList = ['All' , 'Risk', 'Issue', 'Action Item'];
		
		$rootScope.PAGE = "all";
		$scope.query = "";
		
		$scope.sortCriteria = {sortField: "noteLastUpdatedOn", sortOrder: true, fieldDisplay: "Last Updated Time", orderDisplay: "Descending"}
		
		$scope.filterCriteria =   {
		 		"noteStatus": "All",
  				"noteType": "All"
		}; 
		$scope.filteredNotes = NoteResource.query();

		$scope.fields = ['noteTitle', 'noteDesc', 'noteType', 'noteStatus', 'noteOwner'];

		
		$scope.selectedStatus = $scope.filterCriteria.noteStatus;
		$scope.selectedType =  $scope.filterCriteria.noteType;

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



		$scope.updateFilter = function(fieldName, filterValue) {

			console.log("Field Name: " + fieldName);
			console.log("Filter Value: " + filterValue);
			// $scope.filterCriteria[fieldNme] = filterValue;	
			
			$scope.filterCriteria[fieldName] = filterValue;
			// if (filterValue == "All") {
			// 	delete $scope.filterCriteria[fieldName];

			// }

			if(fieldName == "noteStatus"){
				$scope.selectedStatus = filterValue;
			} else if (fieldName == "noteType"){
				$scope.selectedType = filterValue;
			}


			if($scope.selectedStatus == "All"){
				delete $scope.filterCriteria["noteStatus"];
			} 

			if ($scope.selectedType == "All") {
				delete $scope.filterCriteria["noteType"];
			}

			$scope.filteredNotes = $filter('filter')($scope.notes, $scope.filterCriteria);
			
		};



		$scope.setSortCriteria = function(input, display){
			$scope.sortCriteria.sortField = input;
			$scope.sortCriteria.fieldDisplay = display;
		};

		$scope.setSortOrder = function(input){
			if (input == "Ascending"){
				$scope.sortCriteria.sortOrder = false;
				$scope.sortCriteria.orderDisplay = "Ascending";

			} else if (input == "Descending") {
				$scope.sortCriteria.sortOrder = true;
				$scope.sortCriteria.orderDisplay = "Descending";
			}
		};

		$scope.statusFilter = function(status){
			return filterFilter($scope.notes, status);
		};

		$scope.typeFilter = function(type){
			//queryStr = "{noteType: '" + type + "'}"
			// console.log(queryStr)
			return filterFilter($scope.notes, type);
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