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


    // videoDispatcher.bind('new_recording_started', newRecordingStarted);
    var ref = new Firebase('https://blazing-torch-7129.firebaseio.com/new_recording_started');

    ref.on('value', function(snapshot){
      console.log(snapshot.val());
    }, function(errorObject){
      console.log('The read failed: ' + errorObject.code);
    });
    // videoDispatcher.bind('new_video_uploaded', newVideoUploaded);

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


    // Checks if the video has been uploaded yet
    vm.checkVideo = function(video){
      var filename = video.filename;

      var url = '/recorded-videos/' + filename;

      var request = new XMLHttpRequest();

      request.open('HEAD', url, false);
      request.send();

      if(request.status == 200) {
        return true;
      } else {
        return false;
      }
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

      vm.$apply();
    };





    function newRecordingStarted(data){
      var video = data;

      vm.videos.push(video);

      var marker = new google.maps.Marker({
        position: {
          lat: video.lat,
          lng: video.lon
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












    function newVideoUploaded(data){
      // Data returned is hash with filename, time (in UNIX), lat, lon, and address AND ID
      // var video = data;

      // for (i in vm.videos){
      //   if (vm.videos[i].filename == video.filename)
      //     vm.videos[i].uploaded = true;
      // }

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
