angular.module('games.services', [])

  .factory('GamesService',['$http','SERVER', function($http,SERVER) {
    return {
      gamesList : function (page) {
        return $http.get(SERVER.url+'/games?page='+page);
      },
      gamesInfo : function (id,systemType) {
        return $http.get(SERVER.url+'/games/gameInfo?gameId='+id+'&systemType='+systemType);
      }
    };
  }]);
