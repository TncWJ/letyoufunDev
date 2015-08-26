/**
 * Created by jiangjiacai on 2015/8/21.
 */

define(['app' , 'run'], function (app , run) {
    app.service('flight' , ['$rootScope' , '$http' , '$timeout', function($rootScope , $http , $timeout){
        var server = new ClientServer($http , $rootScope);
        return {
            getFlight:function($scope){
                var time = new Date().getTime();
                $scope.seatCode = $scope.seatCode ? $scope.seatCode : 'Y';
                server.createRequest('flight', 'getSearch/c/' + $scope.dCity + '-' + $scope.aCity + '-' + parseInt(time / 1000), '').then(function(d){
                    var data = {
                        date:$scope.today,
                        dCity: d.aCityCode,
                        aCity: d.dCityCode,
                        //服务器端命名错误，次处交换位置
                        dCityName:$scope.dCity,
                        aCityName :$scope.aCity,
                        condition:
                        {
                            filter_Classes:[$scope.seatCode]
                        },
                        column:$scope.sortKey,
                        sort:$scope.sort
                    };
                    if ( $scope.airCode ) data.condition['filter_Airline'] = [$scope.airCode];
                    if ( $scope.timeD ) data.condition['filter_DTime'] = [$scope.timeD];
                    $scope.aCode = d.aCityCode;
                    $scope.dCode = d.dCityCode;
                    //server.createRequest('flight' , 'getLowPrice' , 'lowList' , param);
                   return (  server.createRequest('flight' , 'flightSearch' , '' , data) );


                }).then(function(d){
                        $scope.flightList = d;
                        server.createRequest('flight' , 'getLowPriceList' , '' , {'aCity':$scope.aCode , 'dCity':$scope.dCode , 'date':$scope.today}).then(function(d){
                            for ( var i = 0; i < d.length; i ++ ){
                                d[i].departdate = new Date(d[i].departdate).format('yyyy-MM-dd');
                                d[i].day = run.getDay(new Date(d[i].departdate).getDay());
                            }
                            $scope.lowPriceList = d;
                        });

                        //查询相关航空公司
                        server.createRequest('flight' , 'getAirlineList' , 'airList' , {'aCity':$scope.aCode , 'dCity':$scope.dCode , 'date':$scope.today});
                })
                $scope.changeTpl('planeList.html');
            },
            getOrderInfo:function(seatCode , $scope){
                server.createRequest('flight' , 'getOrderInfo/t/'+seatCode , '').then(function(d){
                    $scope.orderInfo = d;
                    $scope.curDay = run.getDay(parseInt(d.flight.day));
                    console.log($scope.curDay);
                });
            }
        }
    }]);
    app.controller('PlaneController', function ($scope, $http , $location , flight) {
        $scope.host = conf.common.webHost;
        //$scope.today = new Date().format('yyyy-MM-dd');
        $scope.today = '2015-08-28';
        $scope.dCity = '北京'; //出发城市
        $scope.aCity = '上海'; //到达城市
        $scope.tplName = 'plane.html';
        $scope.lastTplName = '';
        $scope.btn = '';
        $scope.airCode = '' ;//航空公司代码，筛选条件
        $scope.timeD = ''; // mo 上午 af 下午 ev 晚间
        $scope.seatCode = 'Y'; // Y 经济仓 CF 公务/头等
        $scope.sTime = 'ASC'; //排序规则
        $scope.sPrice = 'ASC'; //排序规则
        $scope.sortKey = 'OurPrice'; //默认排序字段
        $scope.sort = 'ASC';
        $scope.passe = {
            //乘客列表
                0:[
                    {
                        name:'',
                        idcard:''
                    }
                ]
        };
        //联系人
        $scope.linkMan = {
            name:'',
            phone:''
        };
        $scope.passeIndex = 0; //乘客计数器

        var server = new ClientServer($http , $scope);
            server.createRequest('index' , 'getHotCity' , 'hotCity');
        $scope.changeTpl = function(tplName , way){
            $scope.lastTplName = $scope.tplName;
            $scope.tplName = tplName;

            if(arguments[1]){
                $scope.btn = way;
            }
            $location.path($scope.tplName);
        }

        /**
         * 切换到上个模板
         */
        $scope.goToLastTpl = function(){
            $scope.tplName = $scope.lastTplName;
            $location.path($scope.lastTplName);
        }

        /**
         * 搜索机票
         */
        $scope.searchFlight = function(){
            flight.getFlight($scope );
        }

        /**
         * 交换城市，对调
         */
        $scope.exchangeCity = function(){
            var temp = $scope.dCity;
            $scope.dCity = $scope.aCity;
            $scope.aCity = temp;
        }

        //设置当前城市

        $scope.setCurCity = function(city){
            if ( $scope.btn == 'aCity' ){
                $scope.aCity = city;
            }else{
                $scope.dCity = city;
            }

            $scope.goToLastTpl();
        }

        /**
         * 更多舱位
         * @param index
         */
        $scope.searchSeat = function(index){
            server.createRequest('user'  ,'checkLogin' , '').then(function(d){
                if (d.type == 'success' && d.data == 'ok' ){
                    $scope.moreSeat = $scope.flightList.data[index];
                    $scope.changeTpl('planeSeatSel.html');
                }else{
                    $scope.goToDetal('user' , '' , 'login' , 'userlogin');
                }
            })

        }


        /**
         * 排序
         */

        $scope.sortFlightList = function(key , sort_name){
            $scope[key] =  $scope[key]  == 'ASC' ? 'DESC' : 'ASC';
            $scope.sortKey = sort_name;
            $scope.sort = $scope[key];
            flight.getFlight($scope);
        }

        /**
         * 预定行班订单
         */
        $scope.planeBook = function(flightNo , seatCode){
            flight.getOrderInfo(seatCode , $scope);
            $scope.changeTpl('planeOrder1.html');
        }

        /**
         * 改变乘客列表
         */
        $scope.changePasse = function(num , index){
            if ( $scope.passeIndex + num <= 0 ){
                $scope.passeIndex = 0;
                return;
            }

            if ( $scope.passeIndex + num < $scope.passeIndex ){
            //    删除处理
            //    delete $scope.passe[index];
                return;
            }
            $scope.passe[$scope.passeIndex += num] = {name:'' , idcard : ''};
        }

        /**
         * 订单提交
         */
        $scope.bookCommit = function(){
        //   验证
            $scope.changeTpl('planeOrder2.html');
        }

    })
})