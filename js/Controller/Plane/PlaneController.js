/**
 * Created by jiangjiacai on 2015/8/21.
 */

define(['app'] , function(app){
    app.controller('PlaneController' , function($scope , $http){
        $scope.today = new Date().format('yyyy-MM-dd');
        $scope.tplName = 'plane.html';
        $scope.lastTplName = '';
        $scope.dCity = '北京'; //出发城市
        $scope.aCity = '上海'; //到达城市
        $scope.dCode = '';
        $scope.aCode = '';

       var server = new ClientServer($http , $scope);
           server.createRequest('index', 'getHotCity', 'hotCity');

        /**
         * 搜索航班
         */
        $scope.searchFlight = function(){
            var time = new Date().getTime();
            server.createRequest('flight' , 'getSearch/c/'+$scope.dCity+'-'+$scope.aCity+'-'+parseInt(time/1000) , '').then(function(d){
                var data = {};
                    data.date = $scope.today;
                    data.dCityName = $scope.dCity;
                    data.aCityName = $scope.aCity;
                    data.dCity = d.dCityCode;
                    data.aCity = d.aCityCode;

                server.createRequest('flight' , 'flightSearch' , 'flightList' , data);
            })
            $scope.changeTpl('planeList.html');
        }

        /**
         * 交换城市，对调
         */
        $scope.exchangeCity = function(){
            var temp = $scope.dCity;
                $scope.dCity = $scope.aCity;
                $scope.aCity = temp;
        }
    })
})