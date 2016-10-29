angular.module('filter', [])
.filter('percentage',function () {
  return function(item){
    return Math.round(item)*100+'%';
  }
});
