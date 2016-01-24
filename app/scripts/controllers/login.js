'use strict';

angular.module('efterfestApp')
  .controller('LoginCtrl', function ($scope, simpleLogin, $location, $rootScope) {

    $scope.oauthLogin = function(provider) {
      $scope.err = null;
      simpleLogin.login(provider, {rememberMe: true}).then(redirect, showError);
    };

    function redirect() {
      $location.path('/konto');
    }

    function showError(err) {
      $scope.err = err;
    }


  });
