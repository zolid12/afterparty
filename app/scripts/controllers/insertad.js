'use strict'
angular.module('efterfestApp')
    .controller('InsertAdCtrl', function ($scope, fbutil, user, $timeout, $routeParams, $location, $modal, $rootScope) {

        var existingId = $routeParams.id;

        $scope.isEditing = function() {
            return !!existingId;
        }

        if (existingId) {
            $scope.ad = fbutil.syncObject("parties/" + existingId);
        } else {
            $scope.ad = {
                creator: user.uid,
                image: null,
                coords: {
                    latitude: 62,
                    longitude: 15
                }
            };


          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
              $scope.ad.coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              $scope.map.zoom = 8;
              $scope.$digest();
            });
          }
        }

        $scope.uploadImage = function(event) {
            var input = $("#imageInput");
            if (!input.val()) return false;

            var formData = new FormData(event.target);
            $scope.uploadingImage = true;
            $.ajax({
                type:'POST',
                url: "https://api.imgur.com/3/image",
                data: formData,
                cache: false,
                contentType: false,
                headers: {
                    "Authorization": "Client-ID 0e19db76d57b271"
                },
                processData: false,
                success:function(response){
                    $scope.ad.image = response.data;
                    $scope.uploadingImage = false;
                    $scope.$apply();
                    input.val("")
                },
                error: function(data){
                    $scope.uploadingImage = false;
                    console.log("error");
                    console.log(data);
                }

            });
            return false;
        }

        $scope.removeImage = function() {
            $scope.ad.image = null;
        }

        $scope.delete = function() {
            if (confirm("Är du säker?")) {
                $scope.ad.$remove().then(function() {
                    $location.path("/konto");
                })
            }
        }


        $scope.save = function() {
          if(existingId) {
            $scope.ad.$save();
            $location.path("/efterfest/" + $scope.ad.$id);
          } else {
            fbutil.syncArray("parties").$add($scope.ad).then(function(ad){
                $location.path("/efterfest/" + ad.key());
              },
              function(error) {});
          }
        }

        $scope.map = { zoom: 4 };

        $scope.marker = {
            id: 0,
            options: { draggable: true },
            events: {
                dragend: function (marker, eventName, args) {

                }
            }
        }
    }
)
