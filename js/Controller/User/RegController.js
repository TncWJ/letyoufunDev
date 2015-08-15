/**
 * Created by jiangjiacai on 2015/8/14.
 */

angular.module('appUser', []).controller('RegController', function ($scope, $http) {
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    var server = new ClientServer($http, $scope);
    $scope.curPage = 1;
    $scope.moblie = '';
    $scope.time = '获取验证码';
    $scope.checkCode = '';
    $scope.pass1 = '';
    $scope.pass2 = '';

    $scope.nextPage = function (page) {
        var error = '';
        switch ($scope.curPage) {
            case 1:
                error = lyf.isMoblie($scope.moblie) ? '' : '手机号码不符合规范';
                break;
            case 2:
                return (server.createRequest('user', 'checkSMSCode?sms_code=' + $scope.checkCode, '').then(function (d) {
                    if (d.type == 'success') {
                        $scope.curPage++;
                    } else {
                        alert(d.data);
                        return false;
                    }
                }));
                break;
            case 3:
                error = lyf.checkRpPass($scope.pass1, $scope.pass2) ? '' : '两次密码不一致';
                var user = {};
                user.phone_number = $scope.moblie;
                user.user_pass = $scope.pass1;
                user.sms_code = $scope.checkCode;
                return (server.createRequest('user', 'regUser', '', user).then(function (d) {
                    if(d.status != 1){
                        alert(d.info);
                        $scope.curPage --;
                        return false;
                    }else{
                        $scope.curPage ++;
                    }
                }));
                break;
            default :
                break;
        }

        if (error != '' || error == undefined) {

            alert(error);
        } else {
            $scope.curPage = page;
        }

        /**
         * 图标更新
         */
        $(".tx_bz li").eq(parseInt($scope.curPage - 1)).addClass('on');
    }


    $scope.update = function (name, value) {
        $scope[name] = value;
    }


    /**
     * 获取一个手机验证码
     */
    $scope.getCheckCode = function () {
        var phone = {'phone_number': $scope.moblie};
        server.createRequest('user', 'getSMSCode', '', phone).then(function (d) {
            if (d.state == "success") {
                $scope.time = '已发送';
            } else {
                alert('发送失败，请联系管理员解决！');
            }
        })

    }


})