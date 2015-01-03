angular.module('PMNoteApp', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/notes', {
				controller: 'NoteController',
				templateUrl: 'views/note.html'
			});	

		$locationProvider.html5Mode(true);
	});
