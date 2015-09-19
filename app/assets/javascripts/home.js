angular.module('homePage', [])
.controller('mainController', ['$scope', mainController]);

function mainController($scope){

	var vm = $scope;
	window.scope = vm;





	angular.element(document).ready(function(){
		videoDispatcher.bind('new_video_received', newVideoReceived);

		var markers = [];
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 8,
			center: {lat: -34.397, lng: 150.644}
		});

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

			var marker = new google.maps.Marker({
				position: {
					lat: lat,
					lon: lo
				},
				map: map,
				title: time
			});
			markers.push(marker);

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
	});
};
