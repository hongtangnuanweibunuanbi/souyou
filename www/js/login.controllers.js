angular.module('login.controllers', [])
  .controller('initCtrl', ['$scope','autoLoginService',function($scope,autoLoginService) {
    autoLoginService.autoLogin();
  }])
  .controller('loginCtrl', ['$scope','$rootScope','$timeout','$interval','$location','$ionicPopup','AuthService','localStorage','sessionStorage',function($scope,$rootScope,$timeout,$interval,$location,$ionicPopup,AuthService,localStorage,sessionStorage) {
  //验证提示
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
  //登录
  $scope.loginDate={
    username : '',
    password : ''
  };
  //提交登录
  $scope.loginSubmit = function(loginInfo){
    console.log(loginInfo);
    if(!loginInfo.username||!loginInfo.password){
      $scope.showAlert('账号或密码不能为空！');
    }else{
      AuthService.login(loginInfo).success(function (res) {
        console.log(res);
        localStorage.set('username',loginInfo.username);
        localStorage.set('password',loginInfo.password);
        sessionStorage.set('userId',res.userId);
        sessionStorage.set('token','login-success');
        $location.path('/tab/home');
      }).error(function (error) {
        $scope.showAlert(error.message);
        localStorage.clear();
        sessionStorage.clear();
        console.log(error.message);
      });
    }
  };
}])

  .controller('registCtrl', ['$scope','$timeout','$interval','$ionicPopup','$ionicHistory','registService',function($scope,$timeout,$interval,$ionicPopup,$ionicHistory,registService) {
    //验证提示
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
    // 注册
    $scope.paracont = "获取验证码";
    $scope.paraevent = false;
    $scope.registDate={
      phone : '',
      scode : '',
      password : '',
      smsId: ''
    };
    //获取验证码
    $scope.getCode = function () {
      if(!$scope.registDate.phone){
        $scope.showAlert('请输入正确的手机号码！');
      }else{
        registService.getCheckCode($scope.registDate.phone).success(function (res) {
          if(res.iszc=='false'){
            $scope.showAlert(res.message);
          }else if(res.isFs=='false'){
            $scope.showAlert(res.message);
          }else{
            $scope.paraevent = true;
            var second = 60,
              timePromise = undefined;
            timePromise = $interval(function(){
              if(second<=0){
                $interval.cancel(timePromise);
                timePromise = undefined;
                second = 60;
                $scope.paracont = "获取验证码";
                $scope.paraevent = false;
              }else{
                $scope.paracont = second + "秒后可重发";
                second--;
              }
            },1000);
            $scope.showAlert(res.message);
            $scope.registDate.smsId=res.smsId;
          }
        });
      }
    };
    $scope.registSubmit=function (registInfo) {
      if(!registInfo.phone||!registInfo.scode||!registInfo.password){
        $scope.showAlert('请认真填写！');
      }else{
        registService.regist(registInfo).success(function (res) {
          if(res.code=='0'){
            $scope.showAlert(res.message);
            $ionicHistory.goBack();
          }else if(res.code=='1'){
            $scope.showAlert(res.message);
          }else if(res.code=='2'){
            $scope.showAlert(res.message);
          }
        }).error(function (error) {
          $scope.showAlert(error.message);
        });
      }
    };
  }])

  .controller('forgetCtrl', ['$scope','$timeout','$interval','$ionicPopup','$ionicHistory','forgetService',function($scope,$timeout,$interval,$ionicPopup,$ionicHistory,forgetService) {
    //验证提示
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
    //忘记密码
    $scope.paracont = "获取验证码";
    $scope.paraevent = false;
    $scope.forgetDate={
      phone : '',
      scode : '',
      password : '',
      smsId: ''
    };
    //获取验证码
    $scope.getCode = function () {
      if(!$scope.forgetDate.phone){
        $scope.showAlert('请输入正确的手机号码！');
      }else{
        forgetService.getChengeCode($scope.forgetDate.phone).success(function (res) {
          if(res.isFs=='false'){
            $scope.showAlert(res.message);
          }else{
            $scope.paraevent = true;
            var second = 60,
              timePromise = undefined;
            timePromise = $interval(function(){
              if(second<=0){
                $interval.cancel(timePromise);
                timePromise = undefined;
                second = 60;
                $scope.paracont = "获取验证码";
                $scope.paraevent = false;
              }else{
                $scope.paracont = second + "秒后可重发";
                second--;
              }
            },1000);
            $scope.showAlert(res.message);
            $scope.forgetDate.smsId=res.smsId;
          }
        });
      }
    };
    $scope.forgetSubmit=function (forgetInfo) {
      if(!forgetInfo.phone||!forgetInfo.scode||!forgetInfo.password){
        $scope.showAlert('请认真填写！');
      }else{
        forgetService.changePassword(forgetInfo).success(function (res) {
          if(res.code=='0'){
            $scope.showAlert(res.message);
            $ionicHistory.goBack();
          }else if(res.code=='1'){
            $scope.showAlert(res.message);
          }else if(res.code=='2'){
            $scope.showAlert(res.message);
          }
        }).error(function (error) {
          $scope.showAlert(error.message);
        });
      }
    };
  }]);
