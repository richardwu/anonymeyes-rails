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

    vm.videos = [];


    vm.getFile = function(video){
      return '/recorded-videos/' + video.filename;
    };

    vm.formatTime = function(time){
      return moment.unix(time).calendar();
    };

    vm.formatFilename = function(filename){
      return filename.split(',').join('').split('.').join('');
    }

    vm.showModal = function(video){
      $('#modal-'+vm.formatFilename(video.filename)).openModal();
    }









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
        zoom: 16,
        center: {lat: cur_lat, lng: cur_lng}
      });








      // For Testing Purposes
      var marker = new google.maps.Marker({
        position: {
          lat: 43.47284,
          lng: -80.54027
        },
        map: map,
        title: "Get live stream"
      });
      vm.markers.push(marker);

      google.maps.event.addListener(marker, 'click', function(e){
        $('#modal-1442651880434722854-805448576mp4').openModal();
      });


      // var marker2 = new google.maps.Marker({
      //   position: {
      //     lat: 43.97284,
      //     lng: -85.54027
      //   },
      //   map: map,
      //   title: "Sept 8 2015"
      // });
      // vm.markers.push(marker2);
      // google.maps.event.addListener(marker2, 'click', function(e){
      //   $('#modal-'+parseInt(vm.markers.length)).openModal();
      // });
      vm.$apply();
    };








    function newVideoReceived(data){
      // Data returned is hash with filename, time (in UNIX), lat, lon, and address AND ID
      var video = data;

      vm.videos.push(video);

      var marker = new google.maps.Marker({
        position: {
          lat: data.lat,
          lng: data.lon
        },
        map: map,
        title: 'Click for stream'
      });
      vm.markers.push(marker);
      google.maps.event.addListener(marker, 'click', function(e){
        $('#modal-'+vm.formatFilename(video.filename)).openModal();
      });
      vm.$apply();
    };


    // Retrieve all videos on system
    $.ajax({
      url: '/videos',
      method: 'GET',
      dataType: 'json',
      success: function(resp){

        console.log(resp);
        // resp is a hash of hashes of filenames, times, lats, lons, and addresses
        vm.videos = resp;

        vm.$apply();


      },

      error: function(resp){

      }
    });
  });
};
