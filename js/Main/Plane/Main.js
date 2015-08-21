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
            common :'Common/comm.amd',
            //private
            mobiscroll: 'mobiscroll.custom-2.16.1.min',
            mobiscrollZh: 'i18n/mobiscroll.i18n.zh',
            show : 'Main/Plane/show',
            //    angular
            planeCon: 'Controller/Plane/PlaneController'
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
            mobiscrollZh:{
                deps:['mobiscroll'],
                exports:'mobiscrollZh'
            }

        }
    }
)

require(['planeCon'], function () {
    //启动angular
    angular.bootstrap(document, ['app']);
    require(['zepto' , 'common'] ,function(){
        require(['show']);
    })
});
