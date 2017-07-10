'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	playlistController = require('../../app/controllers/playlist.server.controller');

module.exports = function(app) {
	app.route('/playlists')
		.post(playlistController.append)
		.get(playlistController.read);

};