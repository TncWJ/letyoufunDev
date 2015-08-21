/**
 * Created by jiangjiacai on 2015/8/18.
 */

var app = angular.module('appHotel', []).controller('HotelController', function ($scope, $http) {
    $scope.host = 'http://192.168.99.190/letyoufunR010/';
    //$scope.host = conf.common.webHost;
    $scope.tplName = 'search.html';
    $scope.lastTplName = '';
    $scope.btn = '';

    $scope.today = new Date().format('yyyy-MM-dd' , 1);
    $scope.tomorrow = new Date().format('yyyy-MM-dd', 2);
    $scope.curAreasCode = ''; //当前的行政区查询代码
    $scope.curAreasName = ''; //当前的行政区名字
    $scope.curZonesCode = ''; //当前的商圈查询代码
    $scope.curZonesName = ''; //当前的商圈名字
    $scope.curbandsCode = ''; //酒店品牌查询代码
    $scope.curbandsName = ''; //酒店品牌名字
    $scope.curSelectIndex = {
        Areas:-1,
        Zones:-1,
        bands:-1
    }; //当前选中的index值
    $scope.star = [-1];
    $scope.price = new Array({
        go: 0,
        end:150
    });
    //酒店价格筛选条件

    var server = new ClientServer($http, $scope);
    server.createRequest('index', 'getCurPlace', 'place');
    server.createRequest('index', 'getHotCity', 'hotCity');
    server.createRequest('index' , 'getStarAndPrice' , 'starAndPrice');

    /**
     * 设置当前城市
     */
    $scope.setCurCity = function (city) {
        server.createRequest('index', 'setCurPlace?curCity=' + city, '').then(function (d) {
            if (d.status) {
                $scope.place.city = city;
                $scope.goToLastTpl();
            } else {
                lyf.alert('错误提醒', '网络错误，请稍后再试！', 3000);
            }
        })
    }
    /**
     * 圈子详情切换（解决兼容）
     * @param index
     */
    $scope.showDetal = function (index) {
        $('.ho_list').each(function () {
            $(this).removeClass('on');
        })

        $('.left_chooze li').each(function () {
            $(this).removeClass('on');
        })

        $('.ho_list').eq(index).addClass('on');
        $('.left_chooze li').eq(index).addClass('on');
    }


    /**
     * 获得行政区和商圈
     */
    $scope.getAreasAndZones = function () {
        server.createRequest('index', 'getAreasAndZones?mudi=' + $scope.place.city, '').then(function (d) {
            $scope.data = d;
            $scope.changeTpl('hotelSelect.html');
        })

    }

    /**
     * 选择
     * @param selName
     * @param data
     * @param index
     */
    $scope.selectOn = function (selName, data , index) {
        switch (selName) {
            case 'Areas':
                //行政区域
                $scope.curAreasCode = data.code;
                $scope.curAreasName = data.name;
                $scope.curSelectIndex.Areas = index;
                break;
            case 'Zones':
                //    商圈
                $scope.curZonesCode = data.code;
                $scope.curZonesName = data.name;
                $scope.curSelectIndex.Zones = index;
                break;
            case 'Showbands':
                //酒店品牌
                $scope.curbandsCode = data.code;
                $scope.curbandsName = data.name;
                $scope.curSelectIndex.bands = index;
                break;
            default :
                break;
        }

    }

    /**
     * 返回默认选择不限
     */
    $scope.clear = function(){
        $scope.curAreasCode = '';
        $scope.curZonesCode = '';
        $scope.curZonesCode = '';

        $scope.curSelectIndex.Areas = -1;
        $scope.curSelectIndex.Zones = -1;
        $scope.curSelectIndex.bands = -1;

    }


    /**
     * 酒店搜索
     */
    $scope.search = function(){
        var selPriceCode = '';//价格查询码
        var selStar = ''; //星级码
            //不限制
        var len = $scope.price.length;
        for ( var i = 0; i < len ; i ++ ){
            var goPrice = $scope.price[i].go;
            var endPrice = $scope.price[i].end;

            if ( goPrice == -1 && endPrice == -1){selPriceCode = '';}else{
                if ( endPrice == -1){
                    //    无上限搜索
                    if ( len - i-1 ){selPriceCode += goPrice+'TO'+',';}else{selPriceCode += goPrice+'TO'}
                }else if( goPrice == 0){
                    //以下
                    if ( len - i -1){selPriceCode += endPrice+'TO'+',';}else{selPriceCode += endPrice+'TO'}
                }else{
                    //区间搜索
                    if ( len - i -1){selPriceCode += goPrice+'TO'+endPrice+',';}else{selPriceCode += endPrice+'TO'}
                }
            }
        }

        for ( i = 0; i < $scope.star.length; i ++ ){
            var num = $scope.star[i];
                if ( num == -1){
                    selStar = '';
                }else{
                    selStar += num;
                }
        }
        var data = {};
            data.mudi = $scope.place.city;
            data.hotel_start = $scope.today;
            data.hotel_end = $scope.tomorrow;
            data.AreaId = $scope.curAreasCode;
            data.OurPrice = selPriceCode;
            data.HotelStarRate = selStar;
        server.createRequest('hotel' , 'searchHotel' , 'hotelList' , data);
        $scope.changeTpl('hotelList.html');
    }


    /**
     * 更新酒店搜索条件
     * @param name
     * @param value
     * @param isAppend
     */
    $scope.updateSearch = function(name ,value , isAppend){
        isAppend = arguments[2] ? arguments[2] : false;
        if ( !isAppend ){
            $scope[name] = value;
        }else{
        //    更新多个
        //    待解决重复
                var objArr = $scope[name];
                objArr.push(value);
                $scope[name] = objArr;
        }
    }


    /**
     * 获取详情
     */
    $scope.getDetal = function(hotelId){
        server.createRequest('hotel' , 'getDetal/hotelid/'+hotelId , '').then(function(d){
            $scope.hotelDetal = d;
            $scope.changeTpl('hotelCon.html');
        })
    }


    /**
     * repeat 完成之后
     */
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //下面是在table render完成后执行的js
        var banner = Swipe(document.getElementById('mySwipe'), {
            auto: 2000,
            continuous: true,
            disableScroll:false
        });

    });

    /**
     * 酒店预定显示
     */

    $scope.hotelBook = function(id){
        var data = {};
            data.roomNum = 1;
            data.name = '';
            data.lastTime = '';
            data.phone = '';
        $scope.order = data;
        server.createRequest('hotel' , 'getOderInfo/roomid/'+id +'/checkindate/'+$scope.today+'/checkoutdate/'+$scope.tomorrow, '').then(function(d){
            if (d.status == 0){
                window.location.href = './userlogin.html';
            }else{
                $scope.hotelOrderInfo = d;
                $scope.changeTpl('hotelOrder1.html');
            }
        });
    }


    /**
     * 检查用户填写的订单表单
     */
    $scope.checkOrderTable = function(){
        console.log('ok');
        var roomNum = $scope.order.roomNum;
        var name = $scope.order.name;
        var lastTime = $scope.order.lastTime;
        var phone = $scope.order.phone;

        if ( !roomNum || !name || !lastTime || !phone ){
            lyf.alert('错误提示' , '表单信息不完整！' , 3000);
            return false;
        }else{
            if ( typeof roomNum != "number"){$scope.order.roomNum = 1;return false;}
            if ( !lyf.isCnName(name) ){$scope.order.name = ''; return false;}
            if ( !lyf.IsDate(lastTime)){$scope.order.lastTime = '';return false;}
            if ( !lyf.isMoblie(phone)){$scope.order.phone = '';return false;}

            $scope.changeTpl('hotelOrder2.html');
        }

    }

})



app.directive('onFinishRenderFilters', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

app.filter(
    'to_html', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]
)