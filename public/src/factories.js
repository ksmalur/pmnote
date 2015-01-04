angular.module('PMNoteApp')
	.factory('NoteResource', function($resource){
		return $resource('/api/note/:noteId', {id: '@id'}, {
			'update' : {method: 'PUT'}	
		});
	});