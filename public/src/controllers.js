angular.module('PMNoteApp')
	.controller('NoteController', function($scope){
		$scope.notes = [
			{name: 'Om Gan Gannapathaye Namaha'},
			{name: 'Om Namo Venkateshaya'},
			{name: 'Om Sri Gurubhyo Namaha'},
			{name: "Srimadanandathirtha Bhagavatpadachaya  Gurbhyo Namaha"},
			{name: 'Om Namo Vadirajaya'},
			{name: 'Om Sri Raghavendraya Namaha'}
			];	
	});