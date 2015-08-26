/**
 * Created by jiangjiacai on 2015/8/21.
 */
require.config(
    {
        baseUrl: 'js/',

        paths: {
            //public
            zepto: 'Common/zepto',
            conf: '../conf/conf',
            main: 'Common/main',
            server: 'Server/ClientServer',
            angular: 'Common/angular.min',
            app: 'Main/App',
            common: 'Common/comm.amd',
            route: 'Common/angular-route.min',
            appCenter:'Controller/Plane/PlaneCenter',
            run: 'Main/Plane/run',
            //private
            mobiscroll: 'mobiscroll.custom-2.16.1.min.amd',
            mobiscrollZh: 'i18n/mobiscroll.i18n.zh.amd',
            //    angular
            planeCon: 'Controller/Plane/PlaneController',
        },
        shim: {
            ng: {
                exports: 'angular'
            },
            conf: {
                exports: 'conf'
            },
            main: {
                exports: 'main'
            },
            server: {
                exports: 'server'
            },
            zepto: {
                exports: 'zepto'
            },
            mobiscrollZh: {
                deps: ['zepto', 'mobiscroll', 'common'],
                exports: 'mobiscrollZh'
            },
            route: {
                deps: ['angular'],
                expors: 'route'
            }

        }
    }
)


require([ 'app', 'planeCon' , 'run'], function (app) {
    app.init();
})