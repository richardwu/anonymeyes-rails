angular.module('homePage', [])
.controller('mainController', ['$scope', mainController]);

function mainController($scope){
	$scope.videos = [];

	var vm = $scope;
	window.scope = vm;





	angular.element(document).ready(function(){
		videoDispatcher.bind('new_video_received', newVideoReceived);

		function newVideoReceived(data){
			// Data returned is hash with filename, time (in UNIX), lat, and lon

			var filename = data.filename;
			var time = data.time;
			var lat = data.lat;
			var lon = data.lon;

			// Do stuff with this
			video = {
				address: getAddress(lat, lon),
				timestamp: time
			};
			$scope.videos.push(video);
		};


		// Retrieve all videos on system
		$.ajax({
			url: '/videos',
			method: 'GET',
			dataType: 'json',
			success: function(resp){
				// resp is a hash of hashes of filenames, times, lats, and lons
				console.log(resp);
			},

			error: function(resp){

			}
		});

		function getAddress(lat, lon){
			$.ajax({
				url: 'address',
				method: 'POST',
				data: {lat, lon},
				dataType: json,
				success: function(data){

				},
				error: function(data) {

				}
			});
		}
	});
};
