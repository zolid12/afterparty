angular.module('firebase.config', [])
  .constant('FBURL', 'https://efterfest.firebaseio.com')
  .constant('SIMPLE_LOGIN_PROVIDERS', ['facebook'])
  .constant('loginRedirectPath', '/loggain');
