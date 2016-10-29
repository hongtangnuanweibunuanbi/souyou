angular.module('login.services', [])

  .factory('registService', ['$http','SERVER',function($http,SERVER) {
    return {
      getCheckCode : function (phone) {
        return $http.get(SERVER.url+'/syuser/checkRegister?phone='+phone);
      },
      regist : function (registData) {
        return $http.post(SERVER.url+'/syuser/register',registData);
      }
    };
  }])
  .factory('forgetService', ['$http','SERVER',function($http,SERVER) {
    return {
      getChengeCode : function(phone){
        return $http.get(SERVER.url+'/syuser/sfyz?phone='+phone);
    },
      changePassword : function (forgetData) {
        return $http.post('http://58.84.53.242:8080/souyou/rest/syuser/changePassword',forgetData);
      }
    };
  }])
  // .constant('AUTH_EVENTS', {
  //   loginSuccess: 'auth-login-success',//登录成功
  //   loginFailed: 'auth-login-failed',//登录失败
  //   logoutSuccess: 'auth-logout-success',//登出成功
  //   sessionTimeout: 'auth-session-timeout',
  //   notAuthenticated: 'auth-not-authenticated',//未认证
  //   notAuthorized: 'auth-not-authorized'//未授权
  // })
  //认证
  .factory('AuthService', ['$http','SERVER',function ($http,SERVER) {
    return{
      login : function (credentials) {
        return $http.post(SERVER.url+'/syuser/login',credentials);
        // .then(function (res) {
        //   Session.create(res.data.id, res.data.user.id,
        //     res.data.user.role);
        //   return res.data.user;
        //   console.log(res);
        // });
      }
      // isAuthenticated : function () {
      //   return !!Session.userId;
      // },
      // isAuthorized : function (authorizedRoles) {
      //   if (!angular.isArray(authorizedRoles)) {
      //     authorizedRoles = [authorizedRoles];
      //   }
      //   return (authService.isAuthenticated() &&
      //   authorizedRoles.indexOf(Session.userRole) !== -1);
      // }
    };
  }])
  // .service('Session', function () {
  //   this.create = function (sessionId, userId, userRole) {
  //     this.id = sessionId;
  //     this.userId = userId;
  //     this.userRole = userRole;
  //   };
  //   this.destroy = function () {
  //     this.id = null;
  //     this.userId = null;
  //     this.userRole = null;
  //   };
  //   return this;
  // })
  .factory('localStorage',['$window',function($window) {
    return {
      set: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      clear: function () {
        $window.localStorage.clear();
      }
    }
  }])
  .factory('sessionStorage',['$window',function($window) {
    return {
      set: function (key, value) {
        $window.sessionStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.sessionStorage[key] || defaultValue;
      },
      clear: function () {
        $window.sessionStorage.clear();
      }
    }
  }])
  .factory('requireLoginService',['$state','sessionStorage',function($state,sessionStorage) {
    return {
      checkLogin : function () {
        var token = sessionStorage.get('userId');
        if(!token){
          $state.go('init');
          return false;
        }else{
          return true;
        }
      }
    }
  }])
  .factory('autoLoginService',['$state','$timeout','$ionicPopup','localStorage','sessionStorage','AuthService',function($state,$timeout,$ionicPopup,localStorage,sessionStorage,AuthService) {
    return {
      autoLogin : function () {
        var showAlert = function(text) {
          var alertPopup = $ionicPopup.alert({
            title: text,
            okType: 'button-assertive'
          });
          $timeout(function() {
            alertPopup.close();
          }, 3000);
        };
        var username = localStorage.get('username');
        var password = localStorage.get('password');
        var loginDate = {
          username : username,
          password : password
        };
        if(!username && !password){
          $state.go('init');
          return false;
        }else{
          AuthService.login(loginDate).success(function (res) {
            sessionStorage.set('userId',res.userId);
            sessionStorage.set('token','login-success');
            console.log(res);
            $state.go('tab.home');
          }).error(function (error) {
            showAlert(error.message);
            localStorage.clear();
            sessionStorage.clear();
            console.log(error.message);
          });
        }
      }
    }
  }]);
