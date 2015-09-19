angular.module('homePage', [])
.controller('mainController', ['$scope', mainController]);

$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();
});

function mainController($scope){

  var vm = $scope;
  window.scope = vm;

  // On document load
  angular.element(document).ready(function(){

    videoDispatcher.bind('new_video_received', newVideoReceived);

    // Try to get the user's location
    var cur_lat, cur_lng;
    function geo_success(position) {
      cur_lat = position.coords.latitude;
      cur_lng = position.coords.longitude;
      console.log("Success " + cur_lat + " " + cur_lng);
      make_map();
    }
    function geo_error() {
      cur_lat = 43.47284;
      cur_lng = -80.54027;
      console.log("Error " + cur_lat + " " + cur_lng);
      make_map();
    }
    var geo_options = {
      enableHighAccuracy: false,
      maximumAge: 30000,
      timeout: 27000
    };
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);
    } else {
      geo_error();
    }

    function make_map() {
    console.log("Make map " + cur_lat + " " + cur_lng);
      vm.markers = [];
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: {lat: cur_lat, lng: cur_lng}
      });

      // For Testing Purposes
      var marker = new google.maps.Marker({
        position: {
          lat: 43.47284,
          lng: -80.54027
        },
        map: map,
        title: "Sept 5 2015",
        color: 'blue'
      });
      vm.markers.push(marker);
      google.maps.event.addListener(marker, 'click', function(e){
        $('#modal-'+parseInt(vm.markers.length)).openModal();
      });
      var marker2 = new google.maps.Marker({
        position: {
          lat: 43.97284,
          lng: -85.54027
        },
        map: map,
        title: "Sept 8 2015"
      });
      vm.markers.push(marker2);
      google.maps.event.addListener(marker2, 'click', function(e){
        $('#modal-'+parseInt(vm.markers.length)).openModal();
      });
      vm.$apply();
    };

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
