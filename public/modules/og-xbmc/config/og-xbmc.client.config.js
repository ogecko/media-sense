'use strict';

// Configuring the Articles module
angular.module('og-xbmc').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Playlist', 'movieSummary?playlist=true', 'item', 'movieSummary?playlist=true');
		Menus.addMenuItem('topbar', 'Recent', 'movieSummary?recent=true&end=50', 'item', 'movieSummary?recent=true');
		Menus.addMenuItem('topbar', 'Genres', 'xbmcDropdown', 'dropdown', 'movieSummary?genres=Romance');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'All', 'movieSummary?genres=All');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'Family', 'movieSummary?genres=Family');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'Romance', 'movieSummary?genres=Romance');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'Comedy', 'movieSummary?genres=Comedy');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'Adventure', 'movieSummary?genres=Adventure');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'Crime', 'movieSummary?genres=Crime');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'Drama', 'movieSummary?genres=Drama');
		Menus.addSubMenuItem('topbar', 'xbmcDropdown', 'SciFi', 'movieSummary?genres=Sci-Fi|Science%20Fiction');
	}
]);

angular.module('og-xbmc').config(['$websocketProvider',
    function ($websocketProvider) {
        // Configuration of the $websocketProvider
        $websocketProvider.path = 'ws://Raven-PC:9090/jsonrpc';
    }
]);
