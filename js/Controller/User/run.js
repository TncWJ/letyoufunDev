/**
 * Created by jiangjiacai on 2015/8/23.
 */
var run = {
    start:function(){
        $(function () {

            function init() {

                $('.demo_select').mobiscroll().select({
                    lang: "zh"        // Specify language like: lang: 'pl' or omit setting to use default
                });
            }
            $('.demo-cont').hide();
            $("#demo_cont_select").show();
            $("#demo_cont_select2").show();
            init();

        });
    },
    getTimeMsg:function(){
        var now = new Date();
        var hour = now.getHours();
        var msg = '';
        if(hour < 6){
            msg ="凌晨好";
        }
        else if (hour < 9){
            msg ="早上好";
        }
        else if (hour < 12){
            msg ="上午好";
        }
        else if (hour < 14){
            msg ="中午好";
        }
        else if (hour < 17){
            msg ="下午好";
        }
        else if (hour < 19){
            msg ="傍晚好";
        }
        else if (hour < 22){
            msg ="晚上好";
        }
        else {
            msg ="夜里好";
        }
        return msg;
    }
}
