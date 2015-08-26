/**
 * Created by jiangjiacai on 2015/8/21.
 */


define(['zepto', 'common', 'mobiscrollZh'], function () {
    return {
        start: function () {
            //plane

            // Mobiscroll Calendar initialization
            $('#demo').mobiscroll().calendar({
                lang: 'zh',                 // Specify language like: lang: 'pl' or omit setting to use default
                display: 'bottom',          // Specify display mode like: display: 'bottom' or omit setting to use default
                swipeDirection: 'vertical'  // More info about swipeDirection: http://docs.mobiscroll.com/2-16-0/calendar#!opt-swipeDirection
            });

            $(".citytwo").click(function () {
                var val1 = $(".cityone dd p span").text();
                var val2 = $(".citythree dt p span").text();
                $(this).toggleClass("on");
                $(".cityone dd p span").html(val2);
                $(".citythree dt p span").html(val1);
            });


            //    planeList
            $.jqtab(".plane_foo .tab-item");
            $(".next").tap(function () {
                alert("next");
            })
            $(".prev").tap(function () {
                alert("prev");
            })

            // Mobiscroll Calendar initialization
            $('.calender').mobiscroll().calendar({
                lang: 'zh',                 // Specify language like: lang: 'pl' or omit setting to use default
                display: 'bottom',          // Specify display mode like: display: 'bottom' or omit setting to use default
                swipeDirection: 'vertical'  // More info about swipeDirection: http://docs.mobiscroll.com/2-16-0/calendar#!opt-swipeDirection
            });


            // order1.html
            //明细展示
            var show = false;
            $(".feiy").tap(function () {
                if (!show) {
                    $(".plane_pri").show().animate({
                        bottom: "55px"
                    }, 150);
                    $(".mask").show();
                    show = true;
                } else {
                    $(".mask").hide();
                    $(".plane_pri").hide().css("bottom", "0px");
                    show = false;
                }
            });

            $(".mask").tap(function () {
                $(".mask").hide();
                $(".plane_pri").hide().css("bottom", "0px");
                show = false;
            });
            //添加删除乘客信息
            $(".addxck").tap(function () {
                if ($(".ck_infor").length > 0) {
                    $(".ck_con").append($(".ck_infor").eq(0).clone(true));
                } else {
                    var oDiv = $("<dl class='ck_infor'><dt></dt><dd><form class='input-group'><div class='input-row'><label>成人票</label><input type='text' placeholder='姓名'></div><div class='input-row'><label>身份证</label><input type='email'placeholder='必填'></div></form></dd></dl>");
                    $(".ck_con").append(oDiv);
                }

                $(".ck_infor dt").on("tap", function () {
                    $(this).parent().remove();
                });
            });
            $(".ck_infor dt").on("tap", function () {
                $(this).parent().remove();
            });


            //    planeSelect
            $(".left_chooze li").tap(function () {
                $(this).addClass('on').siblings().removeClass('on');
                $(".ho_se_right .ho_list").eq($(this).index()).addClass('on').siblings("ul").removeClass('on');
            });
            $.tap(".ho_list li");

            $(".reset").tap(function () {
                $(".ho_list li").removeClass("on");
                $(".ho_list").each(function () {
                    $(this).find("li").eq(0).addClass("on");
                });
            });

        },
        getDay: function (num) {
            var arr = ['周日', '周二', '周三', '周四', '周五', '周六'];
            return arr[num];
        }
    }
})