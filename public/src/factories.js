angular.module('PMNoteApp')
	.factory('NoteResource', function($resource){
		return $resource('/api/note/:noteId', {noteId: '@noteId'}, {
			'update' : {method: 'PUT'}	
		});
	})
	.factory('UpdateResource', function ($resource){
		return $resource('/api/note/update/:noteId', {noteId: '@noteId'}, {
			'update': {method: 'PUT'}
		});
	});