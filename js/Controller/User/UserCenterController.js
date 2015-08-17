/**
 * Created by jiangjiacai on 2015/8/14.
 */
angular.module('appUserCenter' , []).controller('UserCenterController' , function($scope , $http ){
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    $scope.tplName = 'userCenter.html';
    $scope.lastTplName = '';
    $scope.btn = ''; //绑定一个提交按钮事件

    $scope.curPass = ''; //当前密码
    $scope.pass1 = '';
    $scope.pass2 = '';
    $scope.time = '获取验证码';

    var server = new ClientServer($http , $scope);
    var param = lyf.getUrlPram();
    server.createRequest('user'  , 'getUserInfo', '').then(function(d){
        $scope.userInfo = d;
        if(lyf.isMoblie(d.phone_number)){
            $scope.moblie = d.phone_number;
        }
    })
    server.createRequest('user'  , 'getMyWallet', 'userWallet');
    server.createRequest('user'  , 'getBill', 'userBill');
    server.createRequest('user'  , 'getMyOrder', 'userOrder');

    /**
     * 切换模板
     * @param tplName
     * @param way 方法，如修改登录密码
     */
    $scope.changeTpl = function(tplName , way){
        $scope.lastTplName = $scope.tplName;
        $scope.tplName = tplName;

        if(arguments[1]){
            $scope.btn = way;
        }
    }

    /**
     * 切换到上个模板
     */
    $scope.goToLastTpl = function(){
        $scope.tplName = $scope.lastTplName;
    }

    /**
     * 返回客户端首页框架
     */
    $scope.goToClient = function(tplName){
        window.location.href = history.go(-2);
    }

    /**
     * 执行一个提交方法
     * @param name
     */
    $scope.submit = function(name){

        server.createRequest('user', 'checkSMSCode?sms_code=' + $scope.checkCode, '').then(function(d){

            if(d.type == 'success'){
                switch (name){
                    case 'changeLoginPass':
                        //修改登录密码
                            server.createRequest('user' , 'changeLoginPass' , '' , {oldpassword:$scope.curPass  , password : $scope.pass1 , repassword:$scope.pass2}).then(function(d){
                                if(d.status != 1){
                                    lyf.alert('error' , d.error , 3000);
                                    $scope.clearPass();
                                }else{
                                    lyf.alert('success' , '登陆密码修改成功，下次请使用新密码等陆！' , 3000);
                                    $scope.goToLastTpl();
                                    $scope.clearPass();
                                }
                            })
                        break;
                    case 'changePayPass':
                        //    修改支付密码
                        server.createRequest('user' , 'changePayPass' , '' , {oldpassword:$scope.curPass  , password : $scope.pass1 , repassword:$scope.pass2}).then(function(d){
                            if(d.status != 1){
                                lyf.alert('error' , d.error , 3000);
                                $scope.clearPass();
                            }else{
                                lyf.alert('success' , '支付密码修改成功，请使用新密码支付！' , 3000);
                                $scope.clearPass();
                                $scope.goToLastTpl();
                            }
                        })
                        break;
                    default :break;
                }
            }else{
                lyf.alert('error' , '短信验证码错误！' , 3000);
            }
        })


    }

    /**
     * 检查是否发送验证码
     */
    $scope.check = function(){
        /**
         * 检查两次密码是否一致
         */
        if ( !lyf.checkRpPass($scope.pass1 , $scope.pass2) ){
            lyf.alert('error' , '两次密码不一致' , 3000);
            $scope.pass1 = '';
            $scope.pass2 = '';
            return false;
        }

        if($scope.pass1 == '' || $scope.curPass == '' || $scope.pass2 == '' ){lyf.alert('error' , '为了保证您的利益，请认真填写！' , 3000);return false;}

        /**
         * 发送验证码
         */
        $scope.getCheckCode();

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
                lyf.alert('error','网络错误，发送失败！' , 3000);
            }
        })

    }

    /**
     * 清除密码
     */
    $scope.clearPass = function(){
        $('#pass1').val('');
        $('#pass2').val('');
        $('#curPass').val('');

        $scope.pass1 = '';
        $scope.pass2 = '';
        $scope.curPass = '';
    }

})