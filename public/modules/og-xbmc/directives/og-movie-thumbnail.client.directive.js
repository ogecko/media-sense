'use strict';

angular.module('og-xbmc').directive('ogMovieThumbnail', [
	function() {
	    return {
	        restrict:'C',
	        scope:{
	            details:'='
	        },
	        link:function (scope, element, attrs) {
	            scope.$watch('details.thumbnail', function(n,o) {
		            element.attr('src', 'http://Raven-PC/image/' + encodeURIComponent(n));

	            });

	        }
	    };
	}
]);

angular.module('og-xbmc').filter('ogRowFilter', [
	function () {
        return function (data, columnCount) {
            var rows = [];
	        var colCount = columnCount || 2;
	        var columns = [];
	        for (var i = 0; i< data.length; i++) {
		        columns.push(data[i]);
		        if (columns.length === colCount) {
			        rows.push(columns);
			        columns = [];
		        }
	        }
	        if (columns.length > 0) {
		        rows.push(columns);
	        }
	        return rows;
        };
    }
]);
