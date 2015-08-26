/**
 * Created by jiangjiacai on 2015/8/21.
 */

define(['run', 'route', 'conf', 'main', 'server'], function (run) {
    var app = angular.module('app.letyoufun', ['ngRoute']);
    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('*', {controller: 'Controller', templae: 'template.html'})
            .otherwise({redirectTo: '/index.html'});
        $locationProvider.html5Mode(true).hashPrefix("!");
    })
    app.init = function () {
        angular.bootstrap(document, ['app.letyoufun']);
    }

    /**
     * 运行非amd标准效果JS指令
     */
    app.directive('lyfRun', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'EA',
            templateUrl: 'plane.html',
            link: function (scope, iElement, attrs) {
                run.start();
            }
        };
    }]);

    /**
     * 支付服务
     */
    app.service('pay', ['$rootScope', '$http', '$timeout', function ($rootScope, $http) {
        return {
            //获取分期月支付
            getPayMonth: function (param) {
                if (scope[param[0]]) param[0] = parseInt(scope[param[0]]);
                if (scope[param[1]]) param[1] = parseFloat(scope[param[1]]);
                $http.post(lyf.go('AppServer/Index/getMonthPay'), {
                    'month': param[0],
                    'totalprice': param[1]
                }).then(function (d) {
                    $rootScope.payPrice = d.data.pay;
                    $rootScope.payMonth = param[0];
                })
            }
        }
    }]);


    return app;
})

