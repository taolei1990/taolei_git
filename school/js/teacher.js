/* Created by taolei on 2016/11/30 */
/*图片自动右向左播放*/
(function($){
    $.fn.kxbdMarquee = function(options){
        var opts = $.extend({},$.fn.kxbdMarquee.defaults, options);
        return this.each(function(){
            var $marquee = $(this);//滚动元素容器
            var _scrollObj = $marquee.get(0);//滚动元素容器DOM
            var scrollW = $marquee.width();//滚动元素容器的宽度
            var scrollH = $marquee.height();//滚动元素容器的高度
            var $element = $marquee.children(); //滚动元素
            var $kids = $element.children();//滚动子元素
            var scrollSize=0;//滚动元素尺寸
            var _type = (opts.direction == 'left' || opts.direction == 'right') ? 1:0;//滚动类型，1左右，0上下
            //防止滚动子元素比滚动元素宽而取不到实际滚动子元素宽度
            $element.css(_type?'width':'height',10000);
            //获取滚动元素的尺寸
            if (opts.isEqual) {
                scrollSize = $kids[_type?'outerWidth':'outerHeight']() * $kids.length;
            }else{
                $kids.each(function(){
                    scrollSize += $(this)[_type?'outerWidth':'outerHeight']();
                });
            }
            //滚动元素总尺寸小于容器尺寸，不滚动
            if (scrollSize<(_type?scrollW:scrollH)) return;
            //克隆滚动子元素将其插入到滚动元素后，并设定滚动元素宽度
            $element.append($kids.clone()).css(_type?'width':'height',scrollSize*2);

            var numMoved = 0;
            function scrollFunc(){
                var _dir = (opts.direction == 'left' || opts.direction == 'right') ? 'scrollLeft':'scrollTop';
                if (opts.loop > 0) {
                    numMoved+=opts.scrollAmount;
                    if(numMoved>scrollSize*opts.loop){
                        _scrollObj[_dir] = 0;
                        return clearInterval(moveId);
                    }
                }
                if(opts.direction == 'left' || opts.direction == 'up'){
                    var newPos = _scrollObj[_dir] + opts.scrollAmount;
                    if(newPos>=scrollSize){
                        newPos -= scrollSize;
                    }
                    _scrollObj[_dir] = newPos;
                }else{
                    var newPos = _scrollObj[_dir] - opts.scrollAmount;
                    if(newPos<0){
                        newPos += scrollSize;
                    }
                    _scrollObj[_dir] = newPos;
                }
            };
            //滚动开始
            var moveId = setInterval(scrollFunc, opts.scrollDelay);
            //鼠标划过停止滚动
            $marquee.hover(
                function(){
                    clearInterval(moveId);
                },
                function(){
                    clearInterval(moveId);
                    moveId = setInterval(scrollFunc, opts.scrollDelay);
                }
            );

            //控制加速运动
            if(opts.controlBtn){
                $.each(opts.controlBtn, function(i,val){
                    $(val).bind(opts.eventA,function(){
                        opts.direction = i;
                        opts.oldAmount = opts.scrollAmount;
                        opts.scrollAmount = opts.newAmount;
                    }).bind(opts.eventB,function(){
                        opts.scrollAmount = opts.oldAmount;
                    });
                });
            }
        });
    };
    $.fn.kxbdMarquee.defaults = {
        isEqual:true,//所有滚动的元素长宽是否相等,true,false
        loop: 0,//循环滚动次数，0时无限
        direction: 'left',//滚动方向，'left','right','up','down'
        scrollAmount:1,//步长
        scrollDelay:10,//时长
        newAmount:3,//加速滚动的步长
        eventA:'mousedown',//鼠标事件，加速
        eventB:'mouseup'//鼠标事件，原速
    };

    $.fn.kxbdMarquee.setDefaults = function(settings) {
        $.extend( $.fn.kxbdMarquee.defaults, settings );
    };

})(jQuery);
/* 圆形统计图*/
function drawCircle(_options){
    var options = _options || {};    //获取或定义options对象;
    options.angle = options.angle || 1;
    options.color = options.color || '#fff';
    options.lineWidth = options.lineWidth || 10;
    options.lineCap = options.lineCap || 'square';

    var oBoxOne = document.getElementById(options.id);
    var sCenter = oBoxOne.width / 2;
    var ctx = oBoxOne.getContext('2d');
    var nBegin = Math.PI / 2;
    var nEnd = Math.PI * 2;
    var grd = ctx.createLinearGradient(0, 0, oBoxOne.width, 0);
    grd.addColorStop(0, 'red');
    grd.addColorStop(0.5, 'yellow');
    grd.addColorStop(1, 'green');

    ctx.textAlign = 'center';
    ctx.font = 'normal normal bold 20px Arial';
    ctx.fillStyle = options.color == 'grd' ? grd : options.color;
    ctx.fillText((options.angle * 100) + '%', sCenter, sCenter);
    /*ctx.strokeStyle = grd;
     ctx.strokeText((options.angle * 100) + '%', sCenter, sCenter);*/
    ctx.lineCap = options.lineCap;
    ctx.strokeStyle = options.color =='grd' ? grd : options.color;
    ctx.lineWidth = options.lineWidth;

    ctx.beginPath();
    ctx.strokeStyle ='#D8D8D8';
    ctx.arc(sCenter, sCenter, (sCenter - options.lineWidth), -nBegin, nEnd, false);
    ctx.stroke();

    var imd = ctx.getImageData(0, 0, 240, 240);
    function draw(current) {
        ctx.putImageData(imd, 0, 0);
        ctx.beginPath();
        ctx.strokeStyle = options.color =='grd' ? grd : options.color;
        ctx.arc(sCenter, sCenter, (sCenter - options.lineWidth), -nBegin, (nEnd * current) - nBegin, false);
        ctx.stroke();
    }

    var t = 0;
    var timer = null;
    function loadCanvas(angle) {
        timer = setInterval(function(){
            if (t > angle) {
                draw(options.angle);
                clearInterval(timer);
            }else{
                draw(t);
                t += 0.02;
            }
        }, 20);
    }
    loadCanvas(options.angle);
    timer = null;

}
/* 返回顶部*/
function gotoTop(min_height){
//预定义返回顶部的html代码，它的css样式默认为不显示
    var gotoTop_html = '<div id="gotoTop">返回顶部</div>';
//将返回顶部的html代码插入页面上id为page的元素的末尾
    $("#page").append(gotoTop_html);
    $("#gotoTop").click(//定义返回顶部点击向上滚动的动画
        function(){$('html,body').animate({scrollTop:0},700);
        }).hover(//为返回顶部增加鼠标进入的反馈效果，用添加删除css类实现
        function(){$(this).addClass("hover");},
        function(){$(this).removeClass("hover");
        });
//获取页面的最小高度，无传入值则默认为600像素
    min_height ? min_height = min_height : min_height = 100;
//为窗口的scroll事件绑定处理函数
    $(window).scroll(function(){
//获取窗口的滚动条的垂直位置
        var s = $(window).scrollTop();
//当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
        if( s > min_height){
            $("#gotoTop").fadeIn(400);
        }else{
            $("#gotoTop").fadeOut(400);
        };
    });
};
gotoTop();

/* 个人空间右边导航*/
$(document).ready(function(){
    $(".syw-list-nav li h3").click(function(){
        $(this).nextAll('a').toggle();
        $(this).children('.r-arrow').toggleClass('r-arrow-90');
        $(this).children('sup').toggle();
    });
    $(".syw-list-nav .o-unfold h3").click(function(){
        $(this).nextAll('a').toggleClass('xy-block');
        $(this).children('.b-arrow').toggleClass('b-arrow-90');
    });

});

$(document).ready(function(){
    $(".gb").click(function(){
        $(".cat-nva").hide();
    });
    $(".fl").click(function(){

        $(".cat-nva").show();
    });
});

 /*星光大道tab
$(document).ready(function(){

    $(".yxzj-teb a").mouseover(function(){
        $(".yxzj-teb a").removeClass("yxzj-teb-on");
        $(this).addClass("yxzj-teb-on");
    });
});
  */

var tDiv=document.getElementById("syw-xgdd");
var oDivs=tDiv.getElementsByTagName("ul");
var oTab=document.getElementById("yxzj-teb");
var oLis=oTab.getElementsByTagName("a");
for (var i=0;i<oLis.length;i++){
    console.log(i);
    var oLi=oLis[i];
    oLi.taolei1=i;
    oLi.onmouseover=function () {
        for (var j=0;j<oLis.length;j++){
            oLis[j].className="";
            oDivs[j].style.display="none"
        }
        this.className="yxzj-teb-on";
       oDivs[this.taolei1].style.display="block"
    } 
}
/*分类导航*/
