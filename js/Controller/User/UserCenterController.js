/**
 * Created by jiangjiacai on 2015/8/14.
 */
var app = angular.module('appUserCenter', [])
app.directive('lyfRun', ['$rootScope', function ($rootScope) {
    return {
        restrict: 'EA',
        link: function (scope, iElement, attrs) {
            run.start();
        }
    };
}]);
//现金贷
app.service('userDai', ['$rootScope', '$http', function ($rootScope, $http) {
    var userDai = {};
    var server = new ClientServer($http, $rootScope);
    /**
     * 获取当前借款信息
     */
    userDai.getInfo = function () {
        server.createRequest('user', 'curApplyNum', 'curApplyNum');
    }
    //获取分期月支付
    userDai.getPayMonth = function (param) {
        $http.post(lyf.go('AppServer/Index/getMonthPay'), {
            'month': param[0],
            'totalprice': param[1]
        }).then(function (d) {
            $rootScope.payPrice = d.data.pay;
            $rootScope.payMonth = param[0];
        })
    }

    //提交现金贷申请
    userDai.commitLoan = function(param){
        console.log(param);
        server.createRequest('user' , 'commitLoan' , '' ,param).then(function(d){
            var str = '';
            if(d.success){
                lyf.alert('借款受理成功' , d.data , 3000);
                $rootScope.goToLastTpl();
            }else{
                lyf.alert('借款受理失败' , d.data , 3000);
            }
        })
    }
    return userDai;
}])
app.controller('UserCenterController', function ($scope, $http, userDai) {
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    $scope.tplName = 'userCenter.html';
    $scope.lastTplName = '';
    $scope.btn = ''; //绑定一个提交按钮事件

    $scope.curPass = ''; //当前密码
    $scope.pass1 = '';
    $scope.pass2 = '';
    $scope.msg = '获取验证码';
    $scope.timeMsg = run.getTimeMsg();
    $scope.loanNum = ['100', '200', '500', '700', '800', '1000', '1500', '2000', '3000'];
    $scope.monthNum = []; //分期月数
    $scope.alipayNo = ''; //支付宝号
    $scope.showTotal = true; //显示信用额度或剩余额度（开关）
    for (var i = 3; i <= 24; i++) {
        $scope.monthNum.push(i);
    }
    $scope.curPayMonth = 12; //当前分期月数
    $scope.curLoanPrice = 500; //当前借款数
    userDai.getPayMonth([12, 500]); //当前还款额度

    var server = new ClientServer($http, $scope);
    var param = lyf.getUrlPram();
    if (param.templateName) {
        console.log('ok');
        $scope.changeTpl(param.templateName);
    }
    server.createRequest('user', 'getUserInfo', '').then(function (d) {
        $scope.userInfo = d;
        if (lyf.isMoblie(d.phone_number)) {
            $scope.moblie = d.phone_number;
        }
    })
    server.createRequest('user', 'getMyWallet', 'userWallet');
    server.createRequest('user', 'getBill', 'userBill');
    server.createRequest('user', 'getMyOrder', 'userOrder');
    userDai.getInfo();
    /**
     * 返回客户端首页框架
     */
    $scope.goToClient = function (tplName) {
        window.location.href = history.go(-2);
    }

    /**
     * 执行一个提交方法
     * @param name
     */
    $scope.submit = function (name) {

        server.createRequest('user', 'checkSMSCode?sms_code=' + $scope.checkCode, '').then(function (d) {

            if (d.type == 'success') {
                switch (name) {
                    case 'changeLoginPass':
                        //修改登录密码
                        server.createRequest('user', 'changeLoginPass', '', {
                            oldpassword: $scope.curPass,
                            password: $scope.pass1,
                            repassword: $scope.pass2
                        }).then(function (d) {
                            if (d.status != 1) {
                                lyf.alert('error', d.error, 3000);
                                $scope.clearPass();
                            } else {
                                lyf.alert('success', '登陆密码修改成功，下次请使用新密码等陆！', 3000);
                                $scope.clearPass();
                                server.createRequest('user', 'logout', '').then(function (d) {
                                    if (d.status) {
                                        window.history.go(-2);
                                    }
                                })
                            }
                        })
                        break;
                    case 'changePayPass':
                        //    修改支付密码
                        server.createRequest('user', 'changePayPass', '', {
                            oldpassword: $scope.curPass,
                            password: $scope.pass1,
                            repassword: $scope.pass2
                        }).then(function (d) {
                            if (d.status != 1) {
                                lyf.alert('error', d.error, 3000);
                                $scope.clearPass();
                            } else {
                                lyf.alert('success', '支付密码修改成功，请使用新密码支付！', 3000);
                                $scope.clearPass();
                                $scope.goToLastTpl();
                            }
                        })
                        break;
                    default :
                        break;
                }
            } else {
                lyf.alert('error', '短信验证码错误！', 3000);
            }
        })


    }

    /**
     * 检查是否发送验证码
     */
    $scope.check = function () {
        /**
         * 检查两次密码是否一致
         */
        if (!lyf.checkRpPass($scope.pass1, $scope.pass2)) {
            lyf.alert('error', '两次密码不一致', 3000);
            $scope.pass1 = '';
            $scope.pass2 = '';
            return false;
        }

        if ($scope.pass1 == '' || $scope.curPass == '' || $scope.pass2 == '') {
            lyf.alert('error', '为了保证您的利益，请认真填写！', 3000);
            return false;
        }

        /**
         * 发送验证码
         */
        $scope.getCheckCode();

    }


    /**
     * 获取一个手机验证码
     */
    $scope.getCheckCode = function () {
        var phone = {phone_number: $scope.moblie, type: $scope.btn};
        server.createRequest('user', 'getSMSCode', '', phone).then(function (d) {
            if (d.status) {
                $scope.time = '已发送';
            } else {
                lyf.alert('error', d.info, 3000);
            }
        })

    }

    /**
     * 清除密码
     */
    $scope.clearPass = function () {
        $('#pass1').val('');
        $('#pass2').val('');
        $('#curPass').val('');

        $scope.pass1 = '';
        $scope.pass2 = '';
        $scope.curPass = '';
    }


    /**
     * 更新月分期信息
     * @param param array [month , price]
     */
    $scope.updateMonthPay = function (param) {
        $scope.curPayMonth = param[0];
        $scope.curLoanPrice = param[1];
        userDai.getPayMonth(param);
    }

    /**
     * 提交借款
     */

    $scope.commitLoan = function (){
        userDai.commitLoan({alipayNo:$scope.alipayNo , amount:$scope.curLoanPrice , monthNum:$scope.curPayMonth});
    }

})