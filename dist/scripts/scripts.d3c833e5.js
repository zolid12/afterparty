"use strict";angular.module("efterfestApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase","firebase.utils","simpleLogin","uiGmapgoogle-maps","ui.bootstrap"]),angular.module("efterfestApp").controller("FindCtrl",["$scope","fbutil","$location","$rootScope",function(a,b,c,d){navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(b){a.map.center={latitude:b.coords.latitude,longitude:b.coords.longitude},a.map.zoom=8}),a.map={center:{latitude:62,longitude:15},zoom:4},a.ads=b.syncArray("parties"),a.events={click:function(a,b,d){c.path("/efterfest/"+a.key)}}}]),angular.module("efterfestApp").controller("MainCtrl",["$scope","fbutil","$location","$rootScope",function(a,b,c,d){}]),angular.module("firebase.config",[]).constant("FBURL","https://efterfest.firebaseio.com").constant("SIMPLE_LOGIN_PROVIDERS",["facebook"]).constant("loginRedirectPath","/loggain"),angular.module("firebase.utils",["firebase","firebase.config"]).factory("fbutil",["$window","FBURL","$firebase",function(a,b,c){function d(a){for(var b=0;b<a.length;b++)if(angular.isArray(a[b]))a[b]=d(a[b]);else if("string"!=typeof a[b])throw new Error("Argument "+b+" to firebaseRef is not a string: "+a[b]);return a.join("/")}function e(c){var e=new a.Firebase(b),f=Array.prototype.slice.call(arguments);return f.length&&(e=e.child(d(f))),e}function f(a,b){var d=e(a);return b=angular.extend({},b),angular.forEach(["equalTo","limitToFirst","limitToLast","orderByKey","orderByChild","orderByPriority","startAt","endAt"],function(a){if(b.hasOwnProperty(a)){var c=b[a];d=d[a].apply(d,angular.isArray(c)?c:[c]),delete b[a]}}),c(d,b)}return{syncObject:function(a,b){return f.apply(null,arguments).$asObject()},syncArray:function(a,b){return f.apply(null,arguments).$asArray()},ref:e}}]),function(){angular.module("simpleLogin",["firebase","firebase.utils","firebase.config"]).factory("authRequired",["simpleLogin","$q",function(a,b){return function(){return a.auth.$requireAuth().then(function(a){return a?a:b.reject({authRequired:!0})})}}]).factory("simpleLogin",["$firebaseAuth","fbutil","$q","$rootScope","createProfile",function(a,b,c,d,e){function f(){i.initialized=!0,i.user=g.$getAuth()||null,angular.forEach(h,function(a){a(i.user)})}var g=a(b.ref()),h=[],i={auth:g,user:null,initialized:!1,getUser:function(){return g.$getAuth()},login:function(a,b){return g.$authWithOAuthPopup(a,b)},anonymousLogin:function(a){return g.$authAnonymously(a)},passwordLogin:function(a,b){return g.$authWithPassword(a,b)},logout:function(){g.$unauth()},createAccount:function(a,b,c){return g.$createUser({email:a,password:b}).then(function(){return i.passwordLogin({email:a,password:b},c)}).then(function(b){return e(b.uid,a).then(function(){return b})})},changePassword:function(a,b,c){return g.$changePassword({email:a,oldPassword:b,newPassword:c})},changeEmail:function(a,b,c){return g.$changeEmail({password:a,oldEmail:c,newEmail:b})},removeUser:function(a,b){return g.$removeUser({email:a,password:b})},watch:function(a,b){h.push(a),g.$waitForAuth(a);var c=function(){var b=h.indexOf(a);b>-1&&h.splice(b,1)};return b&&b.$on("$destroy",c),c}};return g.$onAuth(f),i}]).factory("createProfile",["fbutil","$q","$timeout",function(a,b,c){return function(d,e,f){function g(a){return h(a.substr(0,a.indexOf("@"))||"")}function h(a){a+="";var b=a.charAt(0).toUpperCase();return b+a.substr(1)}var i=a.ref("users",d),j=b.defer();return i.set({email:e,name:f||g(e)},function(a){c(function(){a?j.reject(a):j.resolve(i)})}),j.promise}}])}(),angular.module("efterfestApp").directive("ngShowAuth",["simpleLogin","$timeout",function(a,b){var c;return a.watch(function(a){c=!!a}),{restrict:"A",link:function(d,e){function f(){b(function(){e.toggleClass("ng-cloak",!c)},0)}e.addClass("ng-cloak"),a.watch(f,d),a.getUser(f)}}}]),angular.module("efterfestApp").directive("ngHideAuth",["simpleLogin","$timeout",function(a,b){var c;return a.watch(function(a){c=!!a}),{restrict:"A",link:function(d,e){function f(){b(function(){e.toggleClass("ng-cloak",c!==!1)},0)}e.addClass("ng-cloak"),a.watch(f,d),a.getUser(f)}}}]);