

angular.module('og-xbmc').controller('MovieController', ['$scope', '$stateParams', 'xbmc', 'xbmcCache', '$http', '$timeout',
	function($scope, $stateParams, xbmc, xbmcCache, $http, $timeout) {

		'use strict';
		var setMovieCounters = function () {
			$scope.numMovies = $scope.movies.length;
			$scope.numMoviesInCache = Object.keys(xbmcCache.cache.movies).length;
		};

		var addMovieToScope = function (movie) {
			$scope.movies.push(movie);
			setMovieCounters();  //update the counters stored on $scope
		};

		var addFirstOfMoviesToScope = function (movies) {
			var idx = Object.keys(movies)[0];
			if (idx) {$scope.movies.push(movies[idx]);}
			setMovieCounters();  //update the counters stored on $scope
		};

		////////////////////////////////////////////////////////////////////////////////////////
		// Methods to interact with the XBMC Player
		$scope.playMovie = function (id) {
            var params = { playlistid: 1, position: 0, item: { movieid: id } };

            xbmc.Playlist.Clear({playlistid: 1}, false).then(function () {
				return xbmc.Playlist.Insert(params);
            }).then(function () {
                return xbmc.Player.Open({item: {playlistid: 1}}, false);
            });
		};

		$scope.playerBackspace = function () {
            xbmc.Input.Back({}, false);
		};

		$scope.playerAction = function (actionName) {
            xbmc.Input.ExecuteAction({action:actionName}, false);
		};

		////////////////////////////////////////////////////////////////////////////////////////
		// Methods to setup the list of movies
		$scope.getMoviesGenres = function(genres, limitStart) {
			var arrayOfGenres = genres.split('|');
			$scope.summaryTitle = genres + ' movies';
			xbmc.onReady(function () {
				var params = {
					limits: { 'start' : limitStart, 'end': limitStart+100 }, 
					properties: xbmc.getTypeFields('Video.Fields.Movie'),
					// properties: ['rating','genre','thumbnail'], 
					sort: { 'order': 'ascending', 'method': 'rating', 'ignorearticle': true }
				};
				if (genres!=='All')	params.filter={'field': 'genre', 'operator': 'is', 'value': arrayOfGenres}; 

				xbmc.VideoLibrary.GetMovies(params,true)
				.then(function (movies) {
					var limitNum = Object.keys(movies).length;
					if (limitNum === 100) {
						$scope.getMoviesGenres(genres,limitStart+limitNum); // more to come
					} else {
						// completed scrape
						// convert to an array and store in scope(as opposed to an objet)
						$scope.movies=Object.keys(xbmcCache.cache.movies).map(function(key) {
        						return xbmcCache.cache.movies[key];
      					});
      					if (genres!=='All') $scope.movies=$scope.movies.filter(function(movie) {
      							var flag=false;
      							for (var idx in arrayOfGenres) {
      								if (movie.genre.indexOf(arrayOfGenres[idx]) > -1) flag=true;
      							}
      							return flag;
      					});
					}
					setMovieCounters();  //update the counters stored on $scope
				}, function (error) {
					$scope.errormsg=error;
				});

			});
		};


		$scope.getMoviesRecent = function(limitEnd) {
			var end = parseInt(limitEnd) || 40;
			$scope.summaryTitle = 'Recently recorded movies';
			xbmc.onReady(function () {
				xbmc.VideoLibrary.GetMovies({ 
					'limits': { 'start' : 0, 'end': end }, 
					'properties' : ['rating','genre','thumbnail'],
					'sort': { 'order': 'descending', 'method': 'dateadded', 'ignorearticle': true }
					 },true)
				.then(function (movies) {
					$scope.movies=Object.keys(movies).map(function(key) {
    						return movies[key];
  					});
					setMovieCounters();  //update the counters stored on $scope
				}, function (error) {
					$scope.errormsg=error;
				});

			});
		};


		$scope.getMoviesPlaylist = function(limitStart) {
			//get the playlist first
			$scope.summaryTitle = 'Movie playlist';
			$http.get('/playlists').success(function(data) {
				$scope.playlist = data.listDB;
				$scope.movies = [];

				xbmc.onReady(function () {
					for (var idx in data.listDB) {
						var params = {
							limits: { 'start' : 0, 'end': 1 },
							properties: ['rating','genre','thumbnail','title'],
							filter: {'field': 'title', 'operator': 'is', 'value': data.listDB[idx] }
						};
						xbmc.VideoLibrary.GetMovies(params,true).then(addFirstOfMoviesToScope);
					}
				});
				setMovieCounters();  //update the counters stored on $scope
			});
		};

		$scope.addMovieToPlaylist = function(id) {
			$http.post('/playlists',[id]).success(function(data) {
				$scope.playlist = data.listDB;
				// if ($stateParams.playlist) {
					$scope.movies.forEach(function(movie,idx) {
						if(movie.label===id) {
							$scope.movies.splice(idx,1);
						}
					});
					setMovieCounters();  //update the counters stored on $scope
				// }
			});
		};

		$scope.greatestCommonDenominator = function(a, b) {
			if (b===0) return a;
			return $scope.greatestCommonDenominator(b, a % b);
		};

		$scope.cleanAspectRatio = function(a, b) {
			var r = $scope.greatestCommonDenominator(a, b);
			return a / r + ':' + b / r;
		};

		$scope.getMovieDetail = function(movieid) {
			xbmc.onReady(function () {
				var params = {
					movieid: parseInt(movieid),
        			properties: xbmc.getTypeFields('Video.Fields.Movie')
        		};
				
				xbmc.VideoLibrary.GetMovieDetails(params).then(function (movie) {
					var videostream=movie.streamdetails.video[0];
					if (videostream) videostream.prettyAspect=$scope.cleanAspectRatio(videostream.width,videostream.height);
					movie.file=movie.file.replace(/smb:\/\//,'\\\\');
					$scope.movie=movie;
				}, function (error) {
					$scope.errormsg=error;
				});
			});
		};




		// all method declarations done, now setup the $scope
		$scope.summaryTitle = 'Movie Summary';
		$scope.movie = { };
		$scope.movies = [ ];
		$scope.numMovies=0;
		$scope.numMoviesInCache=0;

	    // Only set the filter text 250ms after user stops typing search text
	    $scope.filterText = '';
	    var tempFilterText = '',   filterTextTimeout;
	    $scope.$watch('searchText', function (val) {
	        if (filterTextTimeout) $timeout.cancel(filterTextTimeout);
	        tempFilterText = val;
	        filterTextTimeout = $timeout(function() {
	            $scope.filterText = tempFilterText;
	        }, 250); // delay 250 ms
	    });

		if ($stateParams.movieid) $scope.getMovieDetail($stateParams.movieid);
		if ($stateParams.genres) $scope.getMoviesGenres($stateParams.genres,0);
		if ($stateParams.recent) $scope.getMoviesRecent($stateParams.end);
		if ($stateParams.playlist) $scope.getMoviesPlaylist(0);

	}
]);