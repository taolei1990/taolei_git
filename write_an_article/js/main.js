//获取地址栏参数
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})(jQuery);

function initImgUploader() {
    var uid=$.getUrlParam("userId");
    uploader = new Array();     //定义一个uploader数组
//可行性判断
    if (!WebUploader.Uploader.support()) {
        alert('Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error('WebUploader does not support the browser you are using.');
    }
//每个uploader 的实例都给class 属性upload_container， 这样通过类选择器的each函数我们
//就可以遍历每个uploader 并且实例化了
     $('.upload_container').each(function (index) {
         var list = $(this).find('.uploader-list');
         var filePicker = $(this).find('.filePicker');//上传按钮实例
        //此处为webuploader的实例化过程，加了额下标index
        uploader[index] = WebUploader.create({
            auto: true,
            duplicate: true,// 重复上传图片，true为可重复false为不可重复
           // fileNumLimit:1,
            //fileSingleSizeLimit: 3*1024*1024,
           fileSizeLimit: 5*1024*1024,
            // swf文件路径
            swf: 'Uploader.swf',
            // 文件接收服务端。
            server: 'http://dev.yunjy.com.cn/upload/uploadapp/upload/create?appid=1000&uid='+uid,
           // server: './preview.php',
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            pick: {
                id: filePicker,
                multiple: false,
            },

        });

        var fileId = '';
//同理，我们其他的函数也要加上index下标
//生成缩略图
        uploader[index].on('fileQueued', function (file) {
            var lWidth = '1';
            var lHeight = '1';
            fileId = file.id;
            var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                '<img src>' +
                '<div class="file-manage"><i class="iconfont">&#xe65c;</i></div>' +
                '</div>'
                ),
                $img = $li.find('img');
            list.html($li);
            // 创建缩略图
            // 如果为非图片文件，可以不用调用此方法。
            // thumbnailWidth x thumbnailHeight 为 100 x 100
            uploader[index].makeThumb(file, function (error, src) {
                if (error) {
                    $img.replaceWith('<span>不能预览</span>');
                    return;
                }
                $img.attr('src', src);
                // filePicker.hide();
            }, lWidth, lHeight);
            $('.filePicker').eq(index).addClass('active');
        });

         //开始上传
         uploader[index].on('startUpload', function () {
             $('.tl-uploadstatus').fadeIn();
             // $('.tl-description').html('图片上传中...');
             // var $img = $("#"+fileId).find('img');
             // $img.attr('src','./img/logo.png');
         });
         //正在上传
         uploader[index].on('uploadProgress', function (file,percentage) {
             // console.log(percentage)
             // $('.tl-uploadstatus').fadeIn();
             // $('.tl-description').html('开始上传...');
         });

         //上传成功
         uploader[index].on('uploadSuccess', function (file,response) {
             var $img = $("#"+fileId).find('img');
             $img.attr('src', response.url);
             $('.tl-description').html('图片添加成功');
             setTimeout(function(){
                 $('.tl-uploadstatus').hide();
                 $('.tl-description').html('图片上传中...');
             }, 1000);
         });
         //上传失败
         uploader[index].on('uploadError', function () {
             var $img = $("#"+fileId).find('img');
             $img.attr('src', 'img/logo.png');
             $('.tl-description').html('上传失败 稍后重试');
             setTimeout(function(){
                 $('.tl-uploadstatus').hide();
                 $('.tl-description').html('图片上传中...');
             }, 1000);

         });
         //图片上传检查的
         uploader[index].on('error', function (type) {
             if (type == "F_DUPLICATE") {
                 alert("系统提示,请不要重复选择文件！");
             } else if (type == "Q_TYPE_DENIED") {
                 alert("请上传gif,jpg,jpeg,bmp,png格式的图片");
             } else if (type == "Q_EXCEED_SIZE_LIMIT") {
                 $('.tl-description').html('所选图片不能大于5M');
                 setTimeout(function(){
                     $('.tl-uploadstatus').hide();
                     $('.tl-description').html('图片上传中...');
                 }, 1000);
             } else if (type == "Q_EXCEED_NUM_LIMIT") {
                 alert("不能超过1个文件");
             }
         })

     });

    $('.uploader-list').on('click', '.file-manage', function () {
        var id = $(this).parent().attr("id");
        var file = $('#' + id);
        file.parent().next().removeClass('active');
        file.remove();
    });

}
//文字度处理
function keypress() //textarea输入长度处理
{
    var ntext = document.getElementById("username").value;
    var maxlength=$("#username").attr("maxlength");

    var len;//记录剩余字符串的长度
    if (ntext.length > 0)//textarea控件不能用maxlength属性，就通过这样显示输入字符数了
    {
        $('.tl-handle-wc').addClass('active');
    }
    else {
        $('.tl-handle-wc').removeClass('active');
    };

    if (ntext.length > maxlength)//textarea控件不能用maxlength属性，就通过这样显示输入字符数了
    {
        document.getElementById("textarea_val").value = ntext.substr(0, maxlength);
        len = 0;
    }
    else {
        len = maxlength - ntext.length;
       // len = ntext.length;
    }
    $('.tl-surplus').html(len)
    console.log(ntext.length)
}

//点击空白处隐藏弹出层，下面为滑动消失效果和淡出消失效果。
$(document).click(function(event){
    var _con = $('#myiframefind');   // 设置目标区域
    if(!_con.is(event.target) && _con.has(event.target).length === 0){ // Mark 1
        $('#myiframeparent').slideUp('slow');   //滑动消失
        $('#myiframefind').slideUp('slow');          //淡出消失
    }
});