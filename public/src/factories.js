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
	})
	.factory("ThemeResource", function ($resource){
		return $resource('/settings/themes/:selected', {selected: '@selected'}, {
    				query: { method: "GET", isArray: false }, 
    				update: {method: "PUT"}
		});
	});