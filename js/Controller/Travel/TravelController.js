/**
 * Created by jiangjiacai on 2015/8/25.
 */

define(['app'] , function(app){
    app.service('travel' , ['$rootScope' , '$http' ,function($rootScope , $http){
        var server = new ClientServer($http , $rootScope);
        var Travel = {};

        /**
         * 获取当前城市的酒店数据
         * @param city
         * @param $scope
         */
        Travel.getCurCityTravel = function($scope , city ){
            server.createRequest('travel' ,  'getTravel/class/3/placearrive/'+city , 'zhoubian');
            server.createRequest('travel' ,  'getTravel/class/1/placearrive/'+city , 'jingnei');
            server.createRequest('travel' ,  'getTravel/class/2/placearrive/'+city , 'jingwai');
        }

        /**
         *
         * @param id
         */
        Travel.getDetal = function( id ){
            server.createRequest('travel' , 'getTravelDetal/id/'+id , 'travelDetal')
        }
        return Travel;
    }])
    app.controller('TravelController' , function($scope , $http , travel){
        $scope.curCity = '北京'; //当前城市
        $scope.tplName = 'travel.html';
        $scope.tplLastTpl = '';


        var server = new ClientServer($http , $scope);
        server.createRequest('index' , 'getHotCity' , 'hotCity');
        server.createRequest('travel' , 'getTravel' , 'zhoubian');
        //server.createRequest('travel' , 'getTravel/class/3' , 'zhoubian');
        server.createRequest('travel' , 'getTravel/class/1' , 'jingnei');
        server.createRequest('travel' , 'getTravel/class/2' , 'jingwai');


        /**
         * 切换到上个模板
         */
        $scope.goToLastTpl = function(){
            $scope.tplName = $scope.lastTplName;
            $location.path($scope.lastTplName);
        }

        /**
         * 更新选择的城市
         */
        $scope.updateCity = function(city){
            $scope.curCity = city;
            travel.getCurCityTravelData(city);
        }

        /**
         * 更新当前城市
         * @param city
         */
        $scope.updateCity = function(city){
            $scope.curCity = city;
            travel.getCurCityTravel(city);
            $scope.goToLastTpl();
        }

        /**
         * 显示酒店详情
         * @param id
         */
        $scope.showDetal = function(id){
            travel.getDetal(id);
            $scope.changeTpl('travelCon.html');
        }
    })
})