/**
 * Created by jiangjiacai on 2015/8/14.
 */
angular.module('appUserCenter' , []).controller('UserCenterController' , function($scope , $http ){
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    $scope.tplName = 'userCenter.html';
    $scope.lastTplName = '';
    var server = new ClientServer($http , $scope);
    var param = lyf.getUrlPram();
    server.createRequest('user'  , 'getUserInfo', 'userInfo');
    server.createRequest('user'  , 'getMyWallet', 'userWallet');
    server.createRequest('user'  , 'getBill', 'userBill');
    server.createRequest('user'  , 'getMyOrder', 'userOrder');

    /**
     * 切换模板
     * @param tplName
     */
    $scope.changeTpl = function(tplName){
        $scope.lastTplName = $scope.tplName;
        $scope.tplName = tplName;
    }

    /**
     * 切换到上个模板
     */
    $scope.goToLastTp = function(){
        $scope.tplName = $scope.lastTplName;
    }

    /**
     * 返回客户端首页框架
     */
    $scope.goToClient = function(tplName){
        window.location.href = history.go(-2);
    }

})