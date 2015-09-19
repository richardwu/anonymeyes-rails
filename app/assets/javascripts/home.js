angular.module('homePage', [])
.controller('mainController', ['$scope', mainController]);

$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();
  });

function mainController($scope){

	var vm = $scope;
	window.scope = vm;

	angular.element(document).ready(function(){

		videoDispatcher.bind('new_video_received', newVideoReceived);

		vm.markers = [];
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 8,
			center: {lat: -34.397, lng: 150.644}
		});

    var marker = new google.maps.Marker({
      position: {
        lat: -34.397,
        lng: 150.644
      },
      map: map,
      title: "Sept 5 2015"
    });
    vm.markers.push(marker);
    google.maps.event.addListener(marker, 'click', function(e){
      $('#modal-'+parseInt(vm.markers.length)).openModal();
    });
		vm.$apply();

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
			vm.videos.push(video);

			var marker = new google.maps.Marker({
				position: {
					lat: lat,
					lng: lon
				},
				map: map,
				title: time
			});
			vm.markers.push(marker);
			google.maps.event.addListener(marker, 'click', function(e){
				$('#modal-'+parseInt(vm.markers.length)).openModal();
			});
			vm.$apply();
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
