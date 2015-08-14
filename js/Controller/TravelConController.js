/**
 * Created by jiangjiacai on 2015/8/9.
 */


angular.module('appTravel' , []).controller('TravelConController' , function($scope , $http ){
    var param = lyf.getUrlPram();
    var server = new ClientServer($http , $scope);
    var funName = param.type == 'hotelCon' ? 'getHotelDetal' : 'getTravelDetal';
        if(param.templateName == 'travelDetal'){
            server.createRequest(param.apiName , funName+'/id/'+param.id , '').then(function(d){
                $scope.travelDetal = d;
                $(".tra_block").html(d.li.productinfo);
                var str = '';
                for( var i = 0; i < d.li.productimage.url.length ; i ++ ){
                    str += '<div><a href="javascript:;"><img class="img-responsive" src="'+d.li.productimage.url[i]+'"/></a></div>';
                }
                $('.swipe-wrap').html(str);

                /**
                 * 效果调用
                 */
                var bullets = document.getElementById('position').getElementsByTagName('li');
                var banner = Swipe(document.getElementById('mySwipe'), {
                    auto: 2000,
                    continuous: true,
                    disableScroll:false,
                    callback: function(pos) {
                        var i = bullets.length;
                        while (i--) {
                            bullets[i].className = ' ';
                        }
                        bullets[pos].className = 'cur';
                    }
                });


            })
        }else{
            server.createRequest(param.apiName , funName+'/id/'+param.id , param.templateName);
        }


})