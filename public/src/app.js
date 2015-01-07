angular.module('PMNoteApp', ['ngRoute', 'ngResource', 'ngMessages'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/notes', {
				controller: 'NoteController',
				templateUrl: 'views/note.html'
			})
			.when('/note/new' ,{
				controller: 'NewController',
				templateUrl: 'views/new.html'
			})
			.when('/note/:noteId', {
				controller: 'SingleController',
				templateUrl: 'views/single.html'							
			})
			.when('/note/update/:noteId', {
				controller: 'UpdateController',
				templateUrl: 'views/update.html'							
			})
			.otherwise({
				redirectTo: '/notes'
			});	

		$locationProvider.html5Mode(true);
	});
