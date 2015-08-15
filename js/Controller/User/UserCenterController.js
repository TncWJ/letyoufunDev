/**
 * Created by jiangjiacai on 2015/8/14.
 */
angular.module('appUserCenter' , []).controller('UserCenterController' , function($scope , $http ){
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    var server = new ClientServer($http , $scope);
    var param = lyf.getUrlPram();
    server.createRequest('user'  , 'getUserInfo', 'userInfo');
})