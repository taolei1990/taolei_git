/**
751821617@qq.com
**/

// var picker = new mui.PopPicker();
// picker.setData([{
//     value: "1",
//     text: "第一项"
// }, {
//     value: "2",
//     text: "第一项"
// }, {
//     value: "3",
//     text: "第三项"
// }, {
//     value: "4",
//     text: "第四项"
// }, {
//     value: "5",
//     text: "第五项"
// }])


// 初始化Web Uploader
var uploader = WebUploader.create({

    // 选完文件后，是否自动上传。
    auto: true,

    // swf文件路径
    swf: 'Uploader.swf',

    // 文件接收服务端。
    server: 'preview.php',

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: '#tl-filePicker',

    // 只允许选择图片文件。
    accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,bmp,png',
        mimeTypes: 'image/*'
    }
});

// 当有文件添加进来的时候
uploader.on( 'fileQueued', function( file ) {
    // var $li = $(
    //     '<div id="' + file.id + '" class="file-item thumbnail">' +
    //     '<img>' +
    //     '</div>'
    //     ),
    //     $img = $li.find('img');


    // $list为容器jQuery实例
    // $('#fileList').empty().append( $li );

    // 创建缩略图
    // 如果为非图片文件，可以不用调用此方法。
    // thumbnailWidth x thumbnailHeight 为 100 x 100
    uploader.makeThumb( file, function( error, src ) {
        // if ( error ) {
        //     $img.replaceWith('<span>不能预览</span>');
        //     return;
        // }
        $('#tl-filePicker').find('img').attr( 'src', src );
        // $img.attr( 'src', src );
    }, 100, 60 );
});
// 文件上传过程中创建进度条实时显示。
uploader.on( 'uploadProgress', function( file, percentage ) {
    var $li = $( '#'+file.id ),
        $percent = $li.find('.progress span');

    // 避免重复创建
    if ( !$percent.length ) {
        $percent = $('<p class="progress"><span></span></p>')
            .appendTo( $li )
            .find('span');
    }

    $percent.css( 'width', percentage * 100 + '%' );
});

// 文件上传成功，给item添加成功class, 用样式标记上传成功。
uploader.on( 'uploadSuccess', function( file ) {
    $( '#'+file.id ).addClass('upload-state-done');
});

// 文件上传失败，显示上传出错。
uploader.on( 'uploadError', function( file ) {
    var $li = $( '#'+file.id ),
        $error = $li.find('div.error');

    // 避免重复创建
    if ( !$error.length ) {
        $error = $('<div class="error"></div>').appendTo( $li );
    }

    $error.text('上传失败');
});

// 完成上传完了，成功或者失败，先删除进度条。
uploader.on( 'uploadComplete', function( file ) {
    $( '#'+file.id ).find('.progress').remove();
});

/**
 * 图片裁剪
 * **/

/**
 * 复制到剪切板
 * **/

//点击复制链接
function copyLink(uid,t) {
    console.log(uid,t)

    var clipboard = new ClipboardJS('#'+uid, {
        text: function() {
            return t;
        }
    });
    clipboard.on('success', function(e) {
        console.log(e);
        mui.toast("复制成功")
    });
    clipboard.on('error', function(e) {
        console.log(e);
        mui.toast("复制失败了")
    });
}