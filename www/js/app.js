// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in login.services.js
// 'starter.controllers' is found in login.controllers.js
angular.module('starter', ['ionic','login.controllers','home.controllers','games.controllers','forum.controllers','my.controllers', 'login.services','home.services','games.services',
'forum.services','my.services','directive','filter'])
.constant('SERVER', {
  url: 'http://58.84.53.242:8080/souyou/rest'
  // url: 'http://122.226.189.158:8080/souyou/rest'
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$httpProvider,$ionicConfigProvider) {
  $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
      var query = '';
      var name, value, fullSubName, subName, subValue, innerObj, i;

      for (name in obj) {
        value = obj[name];

        if (value instanceof Array) {
          for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value instanceof Object) {
          for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        } else if (value !== undefined && value !== null) {
          query += encodeURIComponent(name) + '='
            + encodeURIComponent(value) + '&';
        }
      }

      return query.length ? query.substr(0, query.length - 1) : query;
    };

    return angular.isObject(data) && String(data) !== '[object File]'
      ? param(data)
      : data;
  }];

  $ionicConfigProvider.platform.ios.tabs.style('standard');
  $ionicConfigProvider.platform.ios.tabs.position('bottom');
  $ionicConfigProvider.platform.android.tabs.style('standard');
  $ionicConfigProvider.platform.android.tabs.position('standard');

  $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-back');
  $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

  $ionicConfigProvider.platform.ios.views.transition('ios');
  $ionicConfigProvider.platform.android.views.transition('android');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in login.controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('init',{
      url: '/init',
      templateUrl: 'templates/init.html',
      controller: 'initCtrl'
    })
    .state('login',{
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })
    .state('regist',{
      url: '/regist',
      templateUrl: 'templates/regist.html',
      controller: 'registCtrl'
    })
    .state('forget-password',{
      url: '/forget-password',
      templateUrl: 'templates/forget-password.html',
      controller: 'forgetCtrl'
    })

    .state('tab', {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/tab-home.html',
          controller: 'homeCtrl'
        }
      }
    })
    .state('tab.home-sign', {
      url: '/home-sign',
      cache: false,
      views: {
        'tab-home': {
          templateUrl: 'templates/home/sign.html',
          controller: 'signCtrl'
        }
      }
    })
    .state('tab.my-sign', {
      url: '/my-sign',
      cache: false,
      views: {
        'tab-my': {
          templateUrl: 'templates/home/sign.html',
          controller: 'signCtrl'
        }
      }
    })
    .state('tab.home-games-detail', {
      url: '/home-games-detail/:id',
      views: {
        'tab-home': {
          templateUrl: 'templates/games/games-detail.html',
          controller: 'gamesDetailCtrl'
        }
      }
    })
    .state('tab.news-detail', {
      url: '/news-detail/:id',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/news-detail.html',
          controller: 'newsCtrl'
        }
      }
    })

    .state('tab.games', {
      url: '/games',
      views: {
        'tab-games': {
          templateUrl: 'templates/games/tab-games.html',
          controller: 'gamesCtrl'
        }
      }
    })
    .state('tab.games-detail', {
      url: '/games-detail/:id',
      views: {
        'tab-games': {
          templateUrl: 'templates/games/games-detail.html',
          controller: 'gamesDetailCtrl'
        }
      }
    })
    .state('tab.forum', {
      url: '/forum',
      cache: false,
      views: {
        'tab-forum': {
          templateUrl: 'templates/forum/tab-forum.html',
          controller: 'forumCtrl'
        }
      }
    })
    .state('tab.card', {
      url: '/card/:id',
      cache: false,
      views: {
        'tab-forum': {
          templateUrl: 'templates/forum/card.html',
          controller: 'cardCtrl'
        }
      }
    })
    .state('tab.theme-detail', {
      url: '/theme-detail/:id',
      cache: false,
      views: {
        'tab-forum': {
          templateUrl: 'templates/forum/theme-detail.html',
          controller: 'themeDetailCtrl'
        }
      }
    })
    .state('tab.vote-detail', {
      url: '/vote-detail/:id',
      cache: false,
      views: {
        'tab-forum': {
          templateUrl: 'templates/forum/vote-detail.html',
          controller: 'voteDetailCtrl'
        }
      }
    })
    .state('tab.theme', {
      url: '/theme/:id',
      views: {
        'tab-forum': {
          templateUrl: 'templates/forum/theme.html',
          controller: 'themeCtrl'
        }
      }
    })
    .state('tab.vote', {
      url: '/vote/:id',
      views: {
        'tab-forum': {
          templateUrl: 'templates/forum/vote.html',
          controller: 'voteCtrl'
        }
      }
    })
    .state('tab.my', {
      url: '/my',
      cache: false,
      views: {
        'tab-my': {
          templateUrl: 'templates/my/tab-my.html',
          controller: 'myCtrl'
        }
      }
    })
    .state('tab.info', {
      url: '/info',
      cache: false,
      views: {
        'tab-my': {
          templateUrl: 'templates/my/info.html',
          controller: 'infoCtrl'
        }
      }
    })
    .state('tab.info-head', {
      url: '/info-head',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/info-head.html',
          controller: 'headCtrl'
        }
      }
    })
    .state('tab.info-name', {
      url: '/info-name',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/info-name.html',
          controller: 'nameCtrl'
        }
      }
    })
    .state('tab.info-sex', {
      url: '/info-sex',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/info-sex.html',
          controller: 'sexCtrl'
        }
      }
    })
    .state('tab.info-age', {
      url: '/info-age',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/info-age.html',
          controller: 'ageCtrl'
        }
      }
    })
    .state('tab.info-autograph', {
      url: '/info-autograph',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/info-autograph.html',
          controller: 'autographCtrl'
        }
      }
    })
    .state('tab.mall', {
      url: '/mall',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/mall.html',
          controller: 'mallCtrl'
        }
      }
    })
    .state('tab.exchange', {
      url: '/exchange',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/exchange.html',
          controller: 'exchangeCtrl'
        }
      }
    })
    .state('tab.my-collection', {
      url: '/my-collection',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/my-card.html',
          controller: 'myCollectionCtrl'
        }
      }
    })
    .state('tab.my-post', {
      url: '/my-post',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/my-post.html',
          controller: 'myPostCtrl'
        }
      }
    })
    .state('tab.my-theme-detail', {
      url: '/my-theme-detail/:id',
      cache: false,
      views: {
        'tab-my': {
          templateUrl: 'templates/forum/theme-detail.html',
          controller: 'themeDetailCtrl'
        }
      }
    })
    .state('tab.my-feedback', {
      url: '/my-feedback',
      views: {
        'tab-my': {
          templateUrl: 'templates/my/my-feedback.html',
          controller: 'feedbackCtrl'
        }
      }
    })

    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/init');

});
