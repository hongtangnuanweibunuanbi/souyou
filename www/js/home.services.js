angular.module('home.services', [])

  .factory('HomeService',['$http','SERVER', function($http,SERVER) {
    return {
      banner : function () {
        return $http.get(SERVER.url+'/index/roundimg');
      },
      info : function () {
        return $http.get(SERVER.url+'/index/gamesAndnews');
      },
      news : function (id) {
        return $http.get(SERVER.url+'/news/details?newsId='+id);
      }
    };
  }])
  .factory('signService',['$http','SERVER',function ($http,SERVER) {
    return {
      info : function (userId) {
        return $http.get(SERVER.url+'/sign/details?userId='+userId);
      },
      sign : function (signInfo) {
        return $http.post(SERVER.url+'/sign/doSign',signInfo)
      }
    }
  }]);
