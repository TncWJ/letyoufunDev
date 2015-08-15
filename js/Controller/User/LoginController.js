/**
 * Created by jiangjiacai on 2015/8/14.
 */

angular.module('appUser' , []).controller('LoginController' , function($scope , $http ){
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    var server = new ClientServer($http , $scope);
    server.createRequest('user' , 'checkLogin' , '').then(function(d){
        if(d.type == 'success' && d.data == 'ok'){
            window.location.href='./user.html';
        }
    })

    $scope.doLogin = function(){
        var user = {};
            user.username = $('#userName').val();
            user.password = $('#userPass').val();
        server.createRequest('user' , 'doLogin' , '' , user).then(function(d){
            if(d.status == 1 ){
                //登录成功
                lyf.goToDetal('user' , '' , 'userInfo' , 'user');
            }else{
                alert(d.error);
            }
        })
    }
})