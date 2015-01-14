angular.module('PMNoteApp')
    .filter('labelCase', function () {
        return function (input) {
            input = input.replace(/([A-Z])/g, ' $1');
            return input[0].toUpperCase() + input.slice(1);
        };
    })
	.filter('keyFilter', function(){
		return function(obj,query){
			var result = {};
			angular.forEach(obj, function(val, key){
				if (key !== query){
					result[key] = val;
				}
			});
			return result;
		};
	})
	.filter('camelCase', function(){
		return function(input){
			return input.toLowerCase().replace(/ (\w)/g, function(match,letter){
				return letter.toUpperCase();
			});
		};
	})
	.filter('themeName', function (){
		return function (input) {
			var cut =  input.search(".bootstrap");
 			var tmp = input.substr(0,1);
			input =   input.substr(0,cut);
			return input[0].toUpperCase() + input.slice(1);
		};
	})
	.filter('selectThemeName', function (){
		return function (input) {
			if(input){
				console.log ("In COnsideration :" + input);
				var searchString = "__select_";
				console.log ("Found Cut :" + searchString.length);
				input = input.slice(searchString.length);
				return input[0].toUpperCase() + input.slice(1);
			}
		};
	});