//	<!--tab设置自适应高度-->
				function mofirst() {
					var nowheight = 0;
					$(".mymobileitem").height(nowheight);
					var heirgh = $("#scllm0").height() ;
					$("#item0mobile").height(heirgh);
				}
				mofirst();

				$("#slider").on("slide", function(e) {
					var nowheight = 0;
					$(".mymobileitem").height(nowheight);
					var ai = e.detail.slideNumber;
					var heis = $("#scllm" + ai).height() ;
					$("#item" + ai + "mobile").height(heis);
				});
		

/*
    	作者：751821617@qq.com
     	时间：2017-07-19
     	描述：点赞动画效果
     */
	$(document).ready(function() {
					$(".praise").click(function() {
						if($(this).is('.d-red')) {
							    $(this).removeClass('d-praise');
						} else{
							$(this).addClass('d-praise');		
						}	
						$(this).toggleClass("d-red")
					});
				});
				
	//滑动页面固定导航的位置
				jQuery(function() {
					$(document).ready(function() {
						//enabling stickUp on the '.navbar-wrapper' class
						$('.w-navbar').stickUp();
					});
				});
//切换

					$(".w-resource-class span").click(function() {
						$(".w-resource-class span").removeClass("w-reclassify-active")
						$(this).addClass("w-reclassify-active")
					});
	
