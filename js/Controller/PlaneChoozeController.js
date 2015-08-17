/**
 * Created by jiangjiacai on 2015/8/11.
 */


angular.module('appPlaneChooze' , []).controller('PlaneChoozeController' , function($scope , $http ){
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    var server = new ClientServer($http , $scope);
    server.createRequest('index' , 'getHotCity' , 'hotCity');
})