angular.module('forum.controllers', [])

  .controller('forumCtrl', ['$scope','$ionicLoading','ForumService',function($scope,$ionicLoading,ForumService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    $scope.page = 0;
    $scope.total = 1;
    $scope.forum = [];
    $scope.getForumList = function () {
      $scope.page++;
      ForumService.forumList($scope.page).success(function (res) {
        angular.forEach(res.forums, function (forum) {
          $scope.forum.push(forum);
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
    $scope.getForumList();
  }])
  .controller('cardCtrl', ['$scope','$stateParams','$ionicLoading','sessionStorage','ForumService',function($scope,$stateParams,$ionicLoading,sessionStorage,ForumService) {
    $ionicLoading.show({
      noBackdrop: true
    });
    $scope.page = 0;
    $scope.total = 1;
    $scope.card = [];
    var userId = sessionStorage.get('userId');
    $scope.forumId = $stateParams.id;
    ForumService.getVote($scope.forumId).success(function (res) {
      console.log(res);
      $scope.vote = res.vote;
    }).error(function (error) {
      console.log(error);
    });
    $scope.getCardList = function () {
      $scope.page++;
      ForumService.cardList($scope.forumId,userId,$scope.page).success(function (res) {
        $scope.isAdmin = res.isAdmin;
        console.log(res);
        angular.forEach(res.cards, function (card) {
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
    $scope.getCardList();
  }])
  .controller('themeDetailCtrl', ['$scope','$stateParams','$state','$timeout','$ionicPopup','$ionicLoading','sessionStorage','ForumService',function($scope,$stateParams,$state,$timeout,$ionicPopup,$ionicLoading,sessionStorage,ForumService) {
    $scope.showAlert = function(text) {
      var alertPopup = $ionicPopup.alert({
        title: text,
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 2000);
    };
    $ionicLoading.show({
      noBackdrop: true
    });
    $scope.userId = sessionStorage.get('userId');
    $scope.cardId = $stateParams.id;
    ForumService.themeDetail($scope.userId,$scope.cardId).success(function (res) {
      $ionicLoading.hide();
      $scope.theme = res.cardsInfo;
      console.log(res);
    }).error(function (error) {
      $ionicLoading.show({
        template : '请求服务器失败，请稍后再试！',
        noBackdrop: true,
        duration : 3000
      });
    });
    $scope.page = 0;
    $scope.total = 1;
    $scope.comments = [];
    $scope.getCommentList = function () {
      $scope.page++;
      ForumService.commentList($scope.cardId,$scope.page).success(function (res) {
        console.log(res);
        angular.forEach(res.comments, function (comment) {
          $scope.comments.push(comment);
        });
        $scope.total = res.pageCount;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }).error(function (error) {
        console.log(error);
      });
    };
    $scope.getCommentList();
    $scope.contentData={
      userId: $scope.userId,
      cardId: $scope.cardId,
      content: ''
    };
    $scope.publish = function (data) {
      if(!data.content){
        $scope.showAlert('写点什么吧')
      }else{
        ForumService.comment(data).success(function (res) {
          $state.reload();
        }).error(function (error) {
          $ionicLoading.show({
            template : '评论失败，请稍后再试！',
            noBackdrop: true,
            duration : 3000
          });
        });
      }
    };
  }])
  .controller('themeCtrl', ['$scope','$timeout','$stateParams','$ionicPopup','$ionicLoading','$ionicHistory','sessionStorage','ForumService',function($scope,$timeout,$stateParams,$ionicPopup,$ionicLoading,$ionicHistory,sessionStorage,ForumService) {
    $scope.showAlert = function(text) {
      var alertPopup = $ionicPopup.alert({
        title: text,
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 2000);
    };
    var userId = sessionStorage.get('userId');
    var forumId = $stateParams.id;
    $scope.reader = new FileReader();
    $scope.formData = new FormData();
    $scope.thumb = {};
    $scope.img_upload = function(files) {
      $scope.guid = (new Date()).valueOf();
      $scope.formData.append($scope.guid,files[0]);
      $scope.reader.readAsDataURL(files[0]);
      $scope.reader.onload = function(ev) {
        $scope.$apply(function(){
          $scope.thumb[$scope.guid] = {
            imgSrc : ev.target.result
          }
        });
      };
    };
    $scope.img_del = function(key) {
      var guidArr = [];
      angular.forEach($scope.thumb,function(data,index){
        guidArr.push(index);
      });
      console.log(guidArr);
      delete $scope.thumb[guidArr[key]];
      $scope.formData.delete(guidArr[key]);
    };
    $scope.post = function (data) {
      $scope.formData.append('userId',userId);
      $scope.formData.append('forumId',forumId);
      $scope.formData.append('title',data.title);
      $scope.formData.append('content',data.content);
      if(!data.title){
        $scope.showAlert('标题不能为空！');
      }else{
        $ionicLoading.show({
          template : '正在发帖，请稍后！',
          noBackdrop: true
        });
        ForumService.publish(data).success(function (res) {
          $ionicLoading.show({
            template : res.message,
            noBackdrop: true,
            duration : 2000
          });
          $ionicHistory.goBack();
          console.log(res.message);
        }).error(function (error) {
          $ionicLoading.show({
            template : res.message,
            noBackdrop: true,
            duration : 2000
          });
          console.log(error);
        })
      }
    }
  }])
  .controller('voteDetailCtrl', ['$scope','$stateParams','$state','$timeout','$ionicPopup','$ionicLoading','sessionStorage','ForumService',function($scope,$stateParams,$state,$timeout,$ionicPopup,$ionicLoading,sessionStorage,ForumService) {
    $scope.showAlert = function(text) {
      var alertPopup = $ionicPopup.alert({
        title: text,
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 2000);
    };
    $ionicLoading.show({
      noBackdrop: true
    });
    var userId = sessionStorage.get('userId');
    var voteId = $stateParams.id;
    ForumService.voteDetail(userId,voteId).success(function (res) {
      $ionicLoading.hide();
      console.log(res);
      $scope.voteInfo = res.voteInfo;
      console.log($scope.voteInfo.voteOptions);
    }).error(function (error) {
      $ionicLoading.show({
        template : '请求服务器失败，请稍后再试！',
        noBackdrop: true,
        duration : 3000
      });
    });
    var selected = [];
    var updateSelected = function(action,id){
      if(action == 'add' && selected.indexOf(id) == -1){
        selected.push(id);
      }
      if(action == 'remove' && selected.indexOf(id)!=-1){
        var idx = selected.indexOf(id);
        selected.splice(idx,1);
      }
    };
    $scope.updateSelection = function($event,id){
      var checkbox = $event.target;
      var action = (checkbox.checked?'add':'remove');
      updateSelected(action,id);
    };

    $scope.isSelected = function(id){
      return selected.indexOf(id)>=0;
    };
    $scope.select = '';
    $scope.onChange = function (options) {
      // console.log(options);
      if (options.checked) {
        if (!$scope.select) $scope.select = options;
        if ($scope.select !== options) options.checked = false;
      } else {
        $scope.select = '';
      }
    };
    $scope.vote = function () {
      var voteDate = {
        userId : userId,
        voteId : voteId,
        optionId : selected[0]
      };
      ForumService.vote(voteDate).success(function (res) {
        console.log(res);
        $state.reload();
      }).error(function (error) {
        console.log(error);
        $ionicLoading.show({
          template : res.message,
          noBackdrop: true,
          duration : 3000
        });
      });
    }
  }])
  .controller('voteCtrl', ['$scope','$timeout','$stateParams','$ionicPopup','$ionicLoading','$ionicHistory','sessionStorage','ForumService',function($scope,$timeout,$stateParams,$ionicPopup,$ionicLoading,$ionicHistory,sessionStorage,ForumService) {
    $scope.showAlert = function(text) {
      var alertPopup = $ionicPopup.alert({
        title: text,
        okText: '确认',
        okType: 'button-assertive'
      });
      $timeout(function() {
        alertPopup.close();
      }, 2000);
    };
    var userId = sessionStorage.get('userId');//用户ID
    var forumId = $stateParams.id;//论坛ID
    $scope.reader = new FileReader();
    $scope.formData = new FormData();
    $scope.thumb = {};
    $scope.items=[];    //初始化数组，以便为每一个ng-model分配一个对象
    var i=0;
    $scope.img_upload = function(files) {
      $scope.guid = (new Date()).valueOf();
      $scope.formData.append($scope.guid,files[0]);
      $scope.reader.readAsDataURL(files[0]);
      $scope.reader.onload = function(ev) {
        $scope.$apply(function(){
          $scope.thumb[$scope.guid] = {
            imgSrc : ev.target.result
          }
        });
      };
    };
    $scope.img_del = function(key) {
      var guidArr = [];
      angular.forEach($scope.thumb,function(data,index){
        guidArr.push(index);
      });
      console.log(guidArr);
      delete $scope.thumb[guidArr[key]];
      $scope.formData.delete(guidArr[key]);
    };

    $scope.Fn = {
      add: function () {         //每次添加都要给items数组的长度加一
        $scope.items[i] = '';
        i++;
      },
      del: function (key) {//每次删除一个输入框都后要让i自减，否则重新添加时会出bug
        console.log(key);
        $scope.items.splice(key,1);
        i--;
      }
    };
    $scope.post = function (data) {
      var result='';
      result+=data.option1+'^';
      result+=data.option2+'^';
      angular.forEach($scope.items,function(item,key){
        result+=$scope.items[key]+'^';
      });
      console.log(result);
      $scope.formData.append('userId',userId);
      $scope.formData.append('forumId',forumId);
      $scope.formData.append('voteTitle',data.voteTitle);
      $scope.formData.append('voteDescribe',data.voteDescribe);
      $scope.formData.append('options',result);
      if(!data.voteTitle){
        $scope.showAlert('标题不能为空！');
      }else if(!data.option1||!data.option2){
        $scope.showAlert('请填写默认投票选项！');
      }else{
        $ionicLoading.show({
          template : '正在发帖，请稍后！',
          noBackdrop: true
        });
        ForumService.publishVote(data).success(function (res) {
          $ionicLoading.show({
            template : res.message,
            noBackdrop: true,
            duration : 2000
          });
          $ionicHistory.goBack();
          console.log(res);
        }).error(function (error) {
          $ionicLoading.show({
            template : res.message,
            noBackdrop: true,
            duration : 2000
          });
          console.log(error);
        });
      }
    }
  }]);
