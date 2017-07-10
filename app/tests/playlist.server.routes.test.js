'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Playlist = mongoose.model('Playlist'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, playlist;

/**
 * Playlist routes tests
 */
describe('Playlist CRUD tests', function() {
	
	beforeEach(function(done) {
		done();
	});

	it('should be able to retrieve the playlist', function(done) {
		
		agent.get('/playlists')
			.expect(200)
			.end(function(err, res) {
				should.exist(res.body.listDB);
				done(err);
			});
	});



	it('should be able to append an item from the playlist', function(done) {
		agent.post('/playlists').send(['1620','1820','1920'])
			.expect(200).end(function(err, res) {
				res.body.listDB.should.containDeep(['1620','1820','1920']);
				done(err);
			});
	});


	it('should be able to remove items already in playlist', function(done) {
		agent.post('/playlists')
			.send(['1620','1820','1920'])
			.expect(200)
			.end(function(err, res) {
				agent.post('/playlists')
					.send(['1620','2000'])
					.expect(200)
					.end(function(err, res) {
						res.body.listDB.should.containDeep(['1820','1920','2000']);
						res.body.listDB.should.not.containDeep(['1620']);
						done(err);
					});
			});
	});

	afterEach(function(done) {
		User.remove().exec();
		Playlist.remove().exec();
		done();
	});
});