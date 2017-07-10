'use strict';

//Setting up route
angular.module('og-xbmc').config(['$stateProvider',
	function($stateProvider) {
		// Og xbmc state routing
		$stateProvider.
		state('movieSummary', {
			url: '/movieSummary?genres?recent?playlist&end',
			templateUrl: 'modules/og-xbmc/views/movieSummary.client.view.html'
		}).
		state('movieDetails', {
			url: '/movie/:movieid',
			templateUrl: 'modules/og-xbmc/views/movieDetails.client.view.html'
		});
	}
]);