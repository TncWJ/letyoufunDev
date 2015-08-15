/**
 * Created by jiangjiacai on 2015/8/6.
 */

angular.module('appIndex' , []).controller('IndexController' , function($scope , $http ){
    $scope.host = 'http://192.168.1.88/letyoufun/';
    //$scope.host = conf.common.webHost;
    var server = new ClientServer($http , $scope);
        server.createRequest('index' , 'getHotCity' , 'hotCity');
        server.createRequest('index' , 'getTravel' , '').then(function(d){
            $scope.travelList = d;
            var strZhoubian = '';
            var strJingnei = '';
            var strJingwai = '';
            var strHotel = '';
            var zhoubian = d.zhoubian;
            var jingnei = d.jingnei;
            var jingwai = d.jingwai;
            var i =0;
            for( i = 0; i < 1; i ++ ){
                strZhoubian += '<li><a href="#" onclick="lyf.goToDetal(\'travel\' , 3 , \'travelDetal\')"><dl><dt><img src="'+(zhoubian[i].picture)+'"></dt><dd><p>'+zhoubian[i].title+'</p><p><span>'+ zhoubian[i].other_info+'</span><em>|</em><span>'+zhoubian[i].special_info+'</span></p></dd></dl></a></li>';
                strJingnei += '<li><a href="#" onclick="lyf.goToDetal(\'travel\' , 3 , \'travelDetal\')"><dl><dt><img src="'+(jingnei[i].picture)+'"></dt><dd><p>'+jingnei[i].title+'</p><p><span>'+ jingnei[i].other_info+'</span><em>|</em><span>'+jingnei[i].special_info+'</span></p></dd></dl></a></li>';
                strJingwai += '<li><a href="#" onclick="lyf.goToDetal(\'travel\' , 3 , \'travelDetal\')"><dl><dt><img src="'+(jingwai[i].picture)+'"></dt><dd><p>'+jingwai[i].title+'</p><p><span>'+ jingwai[i].other_info+'</span><em>|</em><span>'+jingwai[i].special_info+'</span></p></dd></dl></a></li>';
            }
            $('#slideBox1 .bd ul').append(strZhoubian);
            $('#slideBox2 .bd ul').append(strJingnei);
            $('#slideBox3 .bd ul').append(strJingwai);

            /**
            * 效果调用
            */
            TouchSlide({
                slideCell:'#slideBox1',
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                autoPage:true,//自动分页
                autoPlay:false //自动播放
            });
            TouchSlide({
                slideCell:'#slideBox2',
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                autoPage:true,//自动分页
                autoPlay:false //自动播放
            });
            TouchSlide({
                slideCell:'#slideBox3',
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                autoPage:true,//自动分页
                autoPlay:false //自动播放
            });

        })
        server.createRequest('index' , 'getHotHotel' , '').then(function(d){
            $scope.hotHotel = d;
            var strHotel = '';
            var hotel = d.lists;
            for( i = 0; i < 3; i ++ ){
                strHotel += '<li><a href="#" onclick="lyf.goToDetal(\'index\' , '+hotel[i].hotelid+' , \'hotelDetal\' , \'hotelCon\')"><dl><dt><img src="'+'http://192.168.159.1/letyoufun/'+(hotel[i].Image)+'"></dt><dd><p>'+hotel[i].hotelname+'</p><p><span>'+ hotel[i].ourprice+'</span><em>|</em><span>'+hotel[i].MonthPay+'<em>× 12</em></span></p></dd></dl></a></li>';
            }
            $('#slideBox5 .bd ul').append(strHotel);

            TouchSlide({
                slideCell:'#slideBox5',
                titCell:".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell 为导航元素包裹层
                mainCell:".bd ul",
                effect:"leftLoop",
                autoPage:true,//自动分页
                autoPlay:false //自动播放
            });
        })
})