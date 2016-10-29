angular.module('my.controllers', [])

  .controller('myCtrl', ['$scope','$state','$ionicPopup','localStorage','sessionStorage','MyService',function($scope,$state,$ionicPopup,localStorage,sessionStorage,MyService) {
    $scope.showConfirm = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: '退出当前账号',
        cancelText: '取消',
        cancelType: 'button-light',
        okText: '确定',
        okType: 'button-assertive'
      });
      confirmPopup.then(function(res) {
        if(res) {
          localStorage.clear();
          sessionStorage.clear();
          $state.go('init');
        } else {
          console.log('You are not sure');
        }
      });
    };
    var userId = sessionStorage.get('userId');
    MyService.myInfo(userId).success(function (res) {
      $scope.myInfo = res.userIndex;
    });
    $scope.logout = function () {
      $scope.showConfirm();
    };
  }])
  .controller('infoCtrl', ['$scope','sessionStorage','infoService',function($scope,sessionStorage,infoService) {
    var userId = sessionStorage.get('userId');
    infoService.getInfo(userId).success(function (res) {
      console.log(res.userInfo);
      $scope.info = res.userInfo;
    });
  }])
  .controller('headCtrl', ['$scope','sessionStorage','infoService',function($scope,sessionStorage,infoService) {
    var userId = sessionStorage.get('userId');
    $scope.head = {
      userId : userId,
      thumb : ''
    };
    infoService.getHead(userId).success(function (res) {
      console.log(res.headpic);
      $scope.head.thumb = res.headpic;
    }).error(function (error) {
      console.log(error);
    });
    $scope.reader = new FileReader();
    $scope.img_upload=function (files) {
      $scope.guid = (new Date()).valueOf();
      $scope.reader.readAsDataURL(files[0]);
      console.log(files[0]);
      $scope.reader.onload = function(ev) {
        $scope.$apply(function(){
          $scope.head.thumb=ev.target.result;
        });
      };
      var data = new FormData();
      console.log(data);
      data.append('image', files[0]);
      data.append('userId',userId);
      console.log(data);
      infoService.editHead(data).success(function (res) {
        console.log(res);
      }).error(function(error){
        console.log(error);
      });
    };
  }])
  .controller('nameCtrl', ['$scope','$ionicHistory','$ionicPopup','$timeout','sessionStorage','infoService',function($scope,$ionicHistory,$ionicPopup,$timeout,sessionStorage,infoService) {
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: '请填写昵称！',
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 3000);
    };
    var userId = sessionStorage.get('userId');
    $scope.nameData = {
      userId : userId,
      niceng : ''
    };
    $scope.updata = function (data) {
      if(!data.niceng){
        $scope.showAlert();
      }else{
        infoService.editName(data).success(function (res) {
          $ionicHistory.goBack();
          console.log(res);
        }).error(function (error) {
          console.log(error);
        });
      }
    };
  }])
  .controller('sexCtrl', ['$scope','$ionicHistory','$ionicPopup','$timeout','sessionStorage','infoService',function($scope,$ionicHistory,$ionicPopup,$timeout,sessionStorage,infoService) {
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: '请选择性别！',
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 3000);
    };
    var userId = sessionStorage.get('userId');
    $scope.sexData = {
      userId : userId,
      sex : ''
    };
    $scope.updata = function (data) {
      if(!data.sex){
        $scope.showAlert();
      }else{
        infoService.editSex(data).success(function (res) {
          $ionicHistory.goBack();
          console.log(res);
        }).error(function (error) {
          console.log(error);
        });
      }
    };
  }])
  .controller('ageCtrl', ['$scope','$ionicHistory','$ionicPopup','$timeout','sessionStorage','infoService',function($scope,$ionicHistory,$ionicPopup,$timeout,sessionStorage,infoService) {
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: '请填写年龄！',
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 3000);
    };
    var userId = sessionStorage.get('userId');
    $scope.ageData = {
      userId : userId,
      age : ''
    };
    $scope.updata = function (data) {
      if(!data.age){
        $scope.showAlert();
      }else{
        infoService.editAge(data).success(function (res) {
          $ionicHistory.goBack();
          console.log(res);
        }).error(function (error) {
          console.log(error);
        });
      }
    };
  }])
  .controller('autographCtrl', ['$scope','$ionicHistory','sessionStorage','infoService',function($scope,$ionicHistory,sessionStorage,infoService) {
    var userId = sessionStorage.get('userId');
    $scope.autographData = {
      userId : userId,
      pname : ''
    };
    $scope.updata = function (data) {
      infoService.editAutograph(data).success(function (res) {
        $ionicHistory.goBack();
        console.log(res);
      }).error(function (error) {
        console.log(error);
      });
    };
  }])
  .controller('mallCtrl', ['$scope','$ionicPopup','$ionicLoading','sessionStorage','mallService',function($scope,$ionicPopup,$ionicLoading,sessionStorage,mallService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    $scope.page = 0;
    $scope.total = 1;
    $scope.malls = [];
    $scope.getMallList = function () {
      $scope.page++;
      mallService.mallList($scope.page).success(function (res) {
        angular.forEach(res.gifts, function (mall) {
          $scope.malls.push(mall);
        });
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
    $scope.getMallList();
    //礼包兑换
    $scope.showAlert = function(message,describe,code) {
      $ionicPopup.alert({
        title: message,
        template: '<P>'+code+'</P>'+'<p>'+describe+'</P>',
        okType: 'button-assertive',
        okText: '确认'
      });
    };
    var userId = sessionStorage.get('userId');
    $scope.exchange = function(id) {
      mallService.exchange(userId,id).success(function (res) {
        console.log(res);
        console.log(res.codeVo);
        var giftsDescription,codesNumber;
        if(res.mcode=='1'){
          giftsDescription = res.codeVo.giftsDescription;
          codesNumber = res.codeVo.codesNumber;
        }else{
          giftsDescription = '';
          codesNumber = '';
        }
        $scope.showAlert(res.message,giftsDescription,codesNumber);
      }).error(function (error) {
        $scope.showAlert(res.message,giftsDescription,codesNumber);
      });
    };
  }])
  .controller('exchangeCtrl', ['$scope','$ionicLoading','sessionStorage','mallService',function($scope,$ionicLoading,sessionStorage,mallService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    var userId = sessionStorage.get('userId');
    $scope.page = 0;
    $scope.total = 1;
    $scope.exchangeRecord = [];
    $scope.getExchangeRecord = function () {
      $scope.page++;
      mallService.exchangeRecord(userId,$scope.page).success(function (res) {
        console.log(res);
        angular.forEach(res.consumes, function (consumes) {
          $scope.exchangeRecord.push(consumes);
        });
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
    $scope.getExchangeRecord();
  }])

  .controller('myPostCtrl', ['$scope','$stateParams','$ionicLoading','sessionStorage','cardService',function($scope,$stateParams,$ionicLoading,sessionStorage,cardService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    $scope.page = 0;
    $scope.total = 1;
    $scope.card = [];
    var userId = sessionStorage.get('userId');
    $scope.myPostList = function () {
      $scope.page++;
      cardService.myPost(userId,$scope.page).success(function (res) {
        console.log(res);
        angular.forEach(res.mycards, function (card) {
          $scope.card.push(card);
        });
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
    $scope.myPostList();
  }])
  .controller('myCollectionCtrl', ['$scope','$stateParams','$ionicLoading','sessionStorage','cardService',function($scope,$stateParams,$ionicLoading,sessionStorage,cardService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    $scope.page = 0;
    $scope.total = 1;
    $scope.card = [];
    var userId = sessionStorage.get('userId');
    $scope.myCardList = function () {
      $scope.page++;
      cardService.myCollection(userId,$scope.page).success(function (res) {
        console.log(res.myCollectForums);
        angular.forEach(res.myCollectForums, function (card) {
          $scope.card.push(card);
        });
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
    $scope.myCardList();
  }])
  .controller('feedbackCtrl', ['$scope','$ionicPopup','$timeout','sessionStorage','feedbackService',function($scope,$ionicPopup,$timeout,sessionStorage,feedbackService) {
    $scope.showAlert = function(text) {
      var alertPopup = $ionicPopup.alert({
        title: text,
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 3000);
    };
    var userId = sessionStorage.get('userId');
    $scope.feedbackData = {
      userId : userId,
      content : ''
    };
    $scope.feedback = function (data) {
      if(!data.content){
        $scope.showAlert('请输入你的意见！');
      }else{
        feedbackService.feedback(data).success(function (res) {
          console.log(res);
          $scope.showAlert(res.message);
        }).error(function (error) {
          console.log(error.message);
          $scope.showAlert(error.message);
        });
      }
    };
  }]);

