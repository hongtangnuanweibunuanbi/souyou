angular.module('games.controllers', [])

  .controller('gamesCtrl', ['$scope','$ionicLoading','GamesService',function($scope,$ionicLoading,GamesService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    $scope.page = 0;
    $scope.total = 1;
    $scope.games = [];
    $scope.getGamesList = function () {
      $scope.page++;
      GamesService.gamesList($scope.page).success(function (res) {
        // console.log(res);
        angular.forEach(res.games, function (game) {
          $scope.games.push(game);
        });
        // console.log($scope.games);
        $scope.total = res.pageCount;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
      }).error(function (error) {
        $ionicLoading.show({
          template : '请求服务器失败，请稍后再试！',
          noBackdrop: true,
          duration : 3000
        });
      });
    };
    $scope.getGamesList();
  }])
  .controller('gamesDetailCtrl', ['$scope','$stateParams','$ionicLoading','GamesService',function($scope,$stateParams,$ionicLoading,GamesService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    var id=$stateParams.id;
    var systemType;//啥子系统
    if(ionic.Platform.isIOS()){
      systemType='ios';
    }else{
      systemType='android';
    }
    GamesService.gamesInfo(id,systemType).success(function (res) {
      // console.log(res.gamesInfo);
      $scope.gamesInfo=res.gamesInfo;
      $ionicLoading.hide();
    }).error(function (error) {
      $ionicLoading.show({
        template : '请求服务器失败，请稍后再试！',
        noBackdrop: true,
        duration : 3000
      });
    });
}]);
