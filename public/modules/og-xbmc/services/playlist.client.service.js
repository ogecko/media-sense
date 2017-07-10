'use strict';

// no longer using client local playlist, now using server based playlist in MongoDB
// angular.module('og-xbmc').factory('playList', [
// 	function($resource) {

// 		var _playList = [];
// 		var service = {};

// 		service.getList = function () {
// 			return _playList;
// 		};

// 		service.isInList = function (id) {
// 			if (_playList.indexOf(id) === -1)
// 				return false;
// 			else
// 				return true;
// 		};

// 		service.addItem = function (id) {
// 			if (_playList.indexOf(id) === -1)
// 				_playList.push(id);
// 			return true;
// 		};

// 		service.toggleItem = function (id) {
// 			var idx=_playList.indexOf(id);
// 			if (idx === -1) 
// 				_playList.push(id);
// 			else
// 				_playList.splice(idx,1);
// 			return true;
// 		};

// 		return service;
// 	}
// ]);