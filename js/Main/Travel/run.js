/**
 * Created by jiangjiacai on 2015/8/25.
 */

define(['zepto', 'common', 'mobiscrollZh' , 'swip'] , function(){
    var run = {};
    /**
     * 效果调用
     */
        run.start = function(){
            //travelCon
            //展示更多
            $(".trahasmo").click(function(){
                if($(this).hasClass("show")){
                    $(this).find(".icon-down-nav").hide();
                    $(this).find(".icon-up-nav").show();
                    $(this).removeClass("show");
                    $(".an_main").css("height","auto");
                }else{
                    $(this).find(".icon-up-nav").hide();
                    $(this).find(".icon-down-nav").show();
                    $(this).addClass("show");
                    $(".an_main").css("height","500px");
                }
            });
        }

    return run;


})