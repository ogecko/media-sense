'use strict';

(function() {
	describe('og-XBMC playList Factory Tests', function() {

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));


		describe('addItem(id)', function() {
			it('Should allow addition of a single movie', inject(function(playList) {
				var item=101;
				playList.addItem(item);
				expect(playList.getList()).toContain(item);

			}));

			it('Should allow addition of two movies', inject(function(playList) {
				playList.addItem(200);
				playList.addItem(300);
				expect(playList.getList()).toContain(300);
				expect(playList.getList()).toContain(200);
			}));

			it('Should ensure duplicates cannot be added', inject(function(playList) {
				playList.addItem(200);
				playList.addItem(200);
				expect(playList.getList().length).toEqual(1);
			}));
		});

		describe('isInList(id)', function() {
			it('Should identify whether an item is in the list', inject(function(playList) {
				playList.addItem(200);
				playList.addItem(300);
				expect(playList.isInList(300)).toBeTruthy();
				expect(playList.isInList(200)).toBeTruthy();
				expect(playList.isInList(600)).toBeFalsy();
			}));
		});

		describe('toggleItem(id)', function() {
			it('Should allow a movie to be added and removed from the playlist', inject(function(playList) {
				playList.addItem(500);
				playList.toggleItem(200);
				playList.addItem(300);
				playList.toggleItem(200);
				expect(playList.getList()).toContain(500);
				expect(playList.getList()).toContain(300);
				expect(playList.getList()).not.toContain(200);

			}));
		});

	});
}());