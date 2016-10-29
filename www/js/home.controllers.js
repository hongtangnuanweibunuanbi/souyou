angular.module('home.controllers', [])

  .controller('homeCtrl', ['$scope','$ionicLoading','HomeService','requireLoginService',function($scope,$ionicLoading,HomeService,requireLoginService) {
    requireLoginService.checkLogin();
    $ionicLoading.show({
      noBackdrop: true
    });
    HomeService.banner().success(function (res) {
      $scope.banner=res.rounds;
      // console.log(res.rounds);
    });
    HomeService.info().success(function (res) {
      $scope.games=res.games;
      $scope.newss=res.newss;
      $ionicLoading.hide();
      // console.log(res.newss);
    }).error(function (error) {
      $ionicLoading.show({
        template : '请求服务器失败，请稍后再试！',
        noBackdrop: true,
        duration : 3000
      });
    });
  }])
  .controller('signCtrl', ['$scope','$rootScope','$stateParams','$state','signService','sessionStorage',function($scope,$rootScope,$stateparams,$state,signService,sessionStorage) {
    $scope.signInfo={
      signId : '',
      userId : ''
    };
    signService.info(sessionStorage.get('userId')).success(function (res) {
      $scope.sign = res.userSignInfo;
      console.log(res);
      $scope.signInfo.signId = res.userSignInfo.id;
      $scope.signInfo.userId = res.userSignInfo.createUser;
    });
    $scope.doSign = function () {
      console.log($scope.signInfo);
      signService.sign($scope.signInfo).success(function (res) {
        console.log(res);
        $state.reload();
      });
    };
  }])
  .controller('newsCtrl', ['$scope','$stateParams','$sce','$ionicLoading','HomeService',function($scope,$stateparams,$sce,$ionicLoading,HomeService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    var id = $stateparams.id;
    HomeService.news(id).success(function (res) {
      $scope.news=res.newsInfo;
      $ionicLoading.hide();
      // console.log(res.newsInfo);
    }).error(function (error) {
      $ionicLoading.show({
        template : '请求服务器失败，请稍后再试！',
        noBackdrop: true,
        duration : 3000
      });
    });
    $scope.trustSrc = function(url){
      return $sce.trustAsResourceUrl(url);
    };
  }]);
