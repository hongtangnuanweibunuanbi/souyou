angular.module('forum.services', [])

  .factory('ForumService',['$http','SERVER', function($http,SERVER) {
    return {
      forumList : function (page) {
        return $http.get(SERVER.url+'/forum?page='+page);
      },
      cardList : function (forumId,userId,page) {
        return $http.get(SERVER.url+'/forum/cards?forumId='+forumId+'&userId='+userId+'&page='+page);
      },
      getVote : function (forumId) {
        return $http.get(SERVER.url+'/forum/queryVote?forumId='+forumId);
      },
      voteDetail : function (userId,voteId) {
        return $http.get(SERVER.url+'/forum/queryVoteInfo?userId='+userId+'&voteId='+voteId);
      },
      vote : function (voteDate) {
        return $http.post(SERVER.url+'/forum/userVote',voteDate);
      },
      themeDetail : function (userId,cardId) {
        return $http.get(SERVER.url+'/forum/cards/info?userId='+userId+'&cardId='+cardId);
      },
      commentList : function (cardId,page) {
        return $http.get(SERVER.url+'/forum/comments?cardId='+cardId+'&page='+page);
      },
      comment : function (commentData) {
        return $http.post(SERVER.url+'/forum/commented',commentData);
      },
      collection : function (data) {
        return $http.post(SERVER.url+'/forum/collected',data);
      },
      uncollection : function (data) {
        return $http.post(SERVER.url+'/forum/collected/cancel',data);
      },
      publish : function (data) {
        return $http({
          method : 'POST',
          url:SERVER.url+'/forum/content/save',
          data: data,
          headers: {'Content-Type':undefined},
          transformRequest: angular.identity
        })
      },
      publishVote : function (data) {
        return $http({
          method : 'POST',
          url:SERVER.url+'/forum/addForumVote',
          data: data,
          headers: {'Content-Type':undefined},
          transformRequest: angular.identity
        })
      }
    };
  }]);
