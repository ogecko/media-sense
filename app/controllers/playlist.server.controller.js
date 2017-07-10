'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    Playlist = mongoose.model('Playlist');


/**
 * Show the current Playlist
 */
exports.read = function(req, res) {
	// Read the playlist from the database
	Playlist.findOne( {'user':req.user}, function(err,playlist) {
		if (err || !playlist) {
			playlist = new Playlist();
			playlist.user = req.user;
			playlist.save();
		}
		res.json(playlist);
	});

};

/**
 * Append items to the Playlist
 */
exports.append = function(req, res) {
	// Read the playlist from the database
	Playlist.findOne( {'user':req.user}, function(err,playlist) {
		if (err || !playlist) {
			playlist = new Playlist();
			playlist.user = req.user;
			playlist.save();
		}

		// Append each item to the playlist
		for (var id in req.body) {
			var idx=playlist.listDB.indexOf(req.body[id]);
			if (idx === -1) 
				playlist.listDB.push(req.body[id]);		//Append if it doesnt exist
			else
				playlist.listDB.splice(idx,1);			//Remove if it already exists
		}

		// Save back to database and send back to client
		playlist.updated = Date.now();
		playlist.save();
		res.json(playlist);
	});
};


/**
 * Create a Playlist
 */
exports.create = function(req, res) {
};

/**
 * Update a Playlist
 */
exports.update = function(req, res) {

};

/**
 * Delete an Playlist
 */
exports.delete = function(req, res) {

};

/**
 * List of Playlists
 */
exports.list = function(req, res) {

};