'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Playlist = mongoose.model('Playlist');

/**
 * Globals
 */
var user, playlist;

/**
 * Unit tests
 */
describe('Playlist Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			playlist = new Playlist({
				user: user,
				listDB: [200,300,400,800]
			});

			done();
		});
	});

	it('should be able to save without problems', function(done) {
		return playlist.save(function(err) {
			should.not.exist(err);
			done();
		});
	});

	it('should be able to find the saved playlist without problems', function(done) {

		return playlist.save(function(err) {
			should.not.exist(err);
			Playlist.findOne(function(err,list) {
				should.not.exist(err);
				list.listDB.should.containDeep([200,300,400,800]);
				done();
			});
		});
	});
	
	it('should be able to find the saved playlist and update it', function(done) {
		return playlist.save(function(err) {
			should.not.exist(err);
			Playlist.findOne(function(err,list) {
				should.not.exist(err);
				list.update();
				list.listDB.should.containDeep([200,300,400,800]);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Playlist.remove().exec();
		User.remove().exec();

		done();
	});
});