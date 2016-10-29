angular.module('my.services', [])
  .factory('MyService',['$http','SERVER', function($http,SERVER) {
    return {
      myInfo : function (userId) {
        return $http.get(SERVER.url+'/userInfo?userId='+userId);
      }
    }
  }])
  .factory('infoService',['$http','SERVER', function($http,SERVER) {
    return {
      getInfo : function (userId) {
        return $http.get(SERVER.url+'/userInfo/details?userId='+userId);
      },
      getHead : function (userId) {
        return $http.get(SERVER.url+'/userInfo/getHeadpic?userId='+userId);
      },
      editHead : function (headData) {
        return $http({
          method:'POST',
          url:SERVER.url+'/userInfo/headpic',
          data: headData,
          headers: {'Content-Type':undefined},
          transformRequest: angular.identity
        });
      },
      editName : function (nameData) {
        return $http.post(SERVER.url+'/userInfo/niceng',nameData);
      },
      editSex : function (sexData) {
        return $http.post(SERVER.url+'/userInfo/sex',sexData);
      },
      editAge : function (ageData) {
        return $http.post(SERVER.url+'/userInfo/age',ageData);
      },
      editAutograph : function (autographData) {
        return $http.post(SERVER.url+'/userInfo/pname',autographData);
      }
    }
  }])
  .factory('mallService',['$http','SERVER', function($http,SERVER) {
    return {
      mallList : function (page) {
        return $http.get(SERVER.url+'/integraMarket?page='+page);
      },
      exchange : function (userId,giftsId) {
        return $http.get(SERVER.url+'/integraMarket/exchange?userId='+userId+'&giftsId='+giftsId);
      },
      exchangeRecord : function (userId,page) {
        return $http.get(SERVER.url+'/userInfo/consume?userId='+userId+'&page='+page);
      }
    }
  }])
  .factory('cardService',['$http','SERVER', function($http,SERVER) {
    return {
      myCollection : function (userId,page) {
        return $http.get(SERVER.url+'/userInfo/collection?userId='+userId+'&page='+page);
      },
      myPost : function (userId,page) {
        return $http.get(SERVER.url+'/userInfo/cards?userId='+userId+'&page='+page);
      }
    }
  }])
  .factory('feedbackService',['$http','SERVER', function($http,SERVER) {
    return {
      feedback : function (feedback) {
        return $http.post(SERVER.url+'/system/suggestion',feedback);
      }
    }
  }]);
