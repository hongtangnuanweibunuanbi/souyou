angular.module('directive', [])
  // .directive('hideTabs', function($rootScope) {
  //   return {
  //      restrict: 'A',
  //       link: function(scope, element, attributes) {
  //
  //          scope.$on('$ionicView.beforeEnter', function() {
  //
  //            scope.$watch(attributes.hideTabs, function(value){
  //                 $rootScope.hideTabs = 'tabs-item-hide';
  //                });
  //
  //             });
  //       scope.$on('$ionicView.beforeLeave', function() {
  //               scope.$watch(attributes.hideTabs, function(value){
  //                 $rootScope.hideTabs = 'tabs-item-hide';
  //                 });
  //               scope.$watch('$destroy',function(){
  //                   $rootScope.hideTabs = false;
  //                 })
  //
  //             });
  //        }
  //     };
  //   });

  .directive('hideTabs', ['$rootScope',function($rootScope) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function() {
          scope.$watch(attributes.hideTabs, function(value){
            $rootScope.hideTabs = value;
          });
        });

        scope.$on('$ionicView.beforeLeave', function() {
          $rootScope.hideTabs = false;
        });
      }
    };
  }])
  .directive('publish', function() {
    return {
      restrict: 'EA',
      templateUrl: 'templates/directive/publish.html',
      scope: true,
      link: function(scope,element,attributes) {
        scope.isadmin = attributes.isAdmin;
        var box = angular.element(document.querySelector('.card-post-box'));
        var btn = angular.element(document.querySelector('.card-post-btn'));
        box.css('display','none');
        box.on('click',function () {
          scope.$apply(function () {
            box.css('display','none');
            btn.css('display','-webkit-box');
          });
        });
        btn.on('click',function () {
          scope.$apply(function () {
            box.css('display','-webkit-box');
            btn.css('display','none');
          });
        });
      }
    };
  })
  .directive('collection',['$state','ForumService',function($state,ForumService) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope,element,attributes) {
        var button = angular.element(element[0]);
        var data={
          userId : scope.userId,
          cardId : scope.cardId
        };
        if(attributes.collection=='0'){
          button.on('click',function () {
            ForumService.collection(data,scope).success(function (res) {
              $state.reload();
              button.removeClass('ion-ios-star-outline').addClass('ion-ios-star');
              console.log(res);
            }).error(function (error) {
              console.log(error);
            });
          });
        }else if(attributes.collection=='1'){
          button.on('click',function () {
            scope.$apply(function () {
              scope.theme.isCollection='0';
            });
            ForumService.uncollection(data).success(function (res) {
              $state.reload();
              button.removeClass('ion-ios-star').addClass('ion-ios-star-outline');
              console.log(res);
            }).error(function (error) {
              console.log(error);
            });
          });
        }

      }
    };
  }]);
