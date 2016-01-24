"use strict"

angular.module('efterfestApp')
    .controller('AccountCtrl', function ($scope, user, simpleLogin, fbutil, $timeout, $rootScope, $routeParams, $location, $firebase) {

        $scope.tab = $routeParams.tab || "efterfester";

        $scope.logout = function() {
          simpleLogin.logout();
          $location.path("/");
        };

        $scope.messages = [];

        $scope.user = user;
        var profile;
        loadProfile(user);

        function loadProfile(user) {
            if( profile ) {
                profile.$destroy();
            }
            profile = fbutil.syncObject('users/' + user.uid);
            profile.$bindTo($scope, 'profile');
        }

        $scope.sentRequests = $firebase(
          new Firebase.util.NormalizedCollection(fbutil.ref("users/" + user.uid + "/sentrequests"),
            fbutil.ref("requests"))
            .select("requests.message", "requests.approved", "requests.partyId", "requests.requestCreator", "requests.partyHost")
            .ref()).$asArray();


        $scope.receivedRequests = $firebase(
          new Firebase.util.NormalizedCollection(fbutil.ref("users/" + user.uid + "/receivedrequests"),
            fbutil.ref("requests"))
            .select("requests.message", "requests.approved", "requests.partyId", "requests.requestCreator", "requests.partyHost")
            .ref()).$asArray();

        $scope.myParties = fbutil.syncArray("parties", {orderByChild: "creator", equalTo: user.uid});

        $scope.approve = function(request, approved) {
          request.approved = approved;
          $scope.receivedRequests.$save(request);
        }

        $scope.remove = function(request){
          $scope.sentRequests.$remove(request);
        }

    });
