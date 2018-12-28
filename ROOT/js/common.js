/**
 * Created by 何军 on 2018/7/6.
 */

//页面加载所要进行的操作
var baseUrl = '/rest';
var uploadUrl = '/uploadapp/upload/create';
var transcodingUrl = '/uploadapp/transcoding/';

$(function () {
    //设置ajax当前状态(是否可以发送);
    ajaxStatus = true;
});

// 存入localStorage浏览器缓存
function saveStorage(name, value) {
    var storage = window.localStorage;
    storage.setItem(name, value);
}

function getUserPower(activityId, uploadSuccess) {
    get("/activity/getUserPower?activityId=" + activityId, function (res) {
        if (res.code == 200) {
            if (uploadSuccess && typeof(uploadSuccess) === "function") {
                uploadSuccess(res.data);
            }
        }
    })
}

function addDescribeButton(activityId) {
    get("/activity/getUserPower?activityId=" + activityId, function (res) {
        if (res.code == 200) {
            if (res.data == 2) {
                $("#describe_span").show();
            }
        }
    })
}

function ajax(url, data, success, cache, alone, async, type, dataType, error) {
    var type = type || 'post';//请求类型
    var dataType = dataType || 'json';//接收数据类型
    var async = async || true;//异步请求
    var alone = alone || false;//独立提交（一次有效的提交）
    var cache = cache || false;//浏览器历史缓存
    var success = success || function (data) {
        //console.log('请求成功');
        setTimeout(function () {
            alert(data.msg);//通过layer插件来进行提示信息
        }, 500);
        if (data.status) {//服务器处理成功
            setTimeout(function () {
                if (data.url) {
                    location.replace(data.url);
                } else {
                    location.reload(true);
                }
            }, 1500);
        } else {//服务器处理失败
            if (alone) {//改变ajax提交状态
                ajaxStatus = true;
            }
        }
    };

    var error = error || function (data) {
        /*console.error('请求成功失败');*/
        /*data.status;//错误状态吗*/
        layer.closeAll('loading');
        setTimeout(function () {
            if (data.status == 404) {
                alert('请求失败，请求未找到');
            } else if (data.status == 503) {
                alert('请求失败，服务器内部错误');
            } else {
                alert('请求失败,网络连接超时');
            }
            ajaxStatus = true;
        }, 500);
    };
    /*if(!ajaxStatus){ss
        return false;
    }*/
    ajaxStatus = false;//禁用ajax请求
    /*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
    if (!alone) {
        setTimeout(function () {
            ajaxStatus = true;
        }, 1000);
    }
    $.ajax({
        type: type,
        url: baseUrl + url,
        data: data,
        async: async,
        dataType: dataType,
        success: success,
        headers: {
            token: window.localStorage.getItem("token")//将token放到请求头中
        }
    });
}

// submitAjax(post方式提交)
function submitAjax(form, success) {
    var form = $(form);
    var url = form.attr('action');
    var data = form.serialize();
    ajax(url, data, success, false, true, false, 'post', 'json');
}

// ajax提交(post方式提交)
function post(url, data, success) {
    ajax(url, data, success, false, true, false, 'post', 'json');
}

// ajax提交(get方式提交)
function get(url, success) {
    ajax(url, {}, success, false, false, false, 'get', 'json');
}

// jsonp跨域请求(get方式提交)
function jsonp(url, success) {
    ajax(url, {}, success, false, false, false, 'get', 'jsonp');
}

function Object_filter(obj) {
    if (obj == null || obj == undefined || obj == "undefined" || obj == "null" || obj.length == 0) {
        return false;
    } else {
        return true;
    }
}

//根据参数名称获取url参数
function getUrlParamValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

//获取url参数封装成对象
function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent((strs[i].split("=")[1]));
        }
    }
    return theRequest;
}

//一级选择
function onOneLinkage(idName, data, defaultVal) {
    (function ($, doc) {
        $.init();
        $.ready(function () {
            /**
             * 获取对象属性的值
             * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
             * @param {Object} obj 对象
             * @param {String} param 属性名
             */
            var _getParam = function (obj, param) {
                return obj[param] || '';
            };
            //一级选择
            //-----------------------------------------
            var userPicker = new $.PopPicker();
            userPicker.setData(data);
            var showUserPickerButton = doc.getElementById(idName);
            showUserPickerButton.addEventListener('tap', function (event) {
                userPicker.show(function (items) {
                    showUserPickerButton.value = items[0].text;
                    // 给隐藏的兄弟节点赋值
                    showUserPickerButton.nextElementSibling.innerText = items[0].value;
                    //JSON.stringify(test);
                    //items[0].text
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                });
            }, false);
            if (Object_filter(defaultVal)) {
                userPicker.pickers[0].setSelectedValue(defaultVal);
                showUserPickerButton.value = userPicker.pickers[0].getSelectedText();
                showUserPickerButton.nextElementSibling.innerText = defaultVal;
            }
        });
    })(mui, document);
}

//两级联动
function onTwoLinkage(idName, cityData, defaultVal) {
    (function ($, doc) {
        $.init();
        $.ready(function () {
            /**
             * 获取对象属性的值
             * 主要用于过滤三级联动中，可能出现的最低级的数据不存在的情况，实际开发中需要注意这一点；
             * @param {Object} obj 对象
             * @param {String} param 属性名
             */
            var _getParam = function (obj, param) {
                return obj[param] || '';
            };

            //二级连选
            //-----------------------------------------
            var cityPicker = new $.PopPicker({
                layer: 2
            });
            cityPicker.setData(cityData);
            var showUserPickerButton = doc.getElementById(idName);
            showUserPickerButton.addEventListener('tap', function (event) {
                cityPicker.show(function (items) {
                    showUserPickerButton.value = items[0].text + " " + items[1].text;
                    // 给隐藏的兄弟节点赋值
                    showUserPickerButton.nextElementSibling.innerText = items[0].value + "," + items[1].value;
                    //返回 false 可以阻止选择框的关闭
                    //return false;
                });
            }, false);
            //-----------------------------------------
            if (Object_filter(defaultVal)) {
                var values = defaultVal.toString().split(",");
                cityPicker.pickers[0].setSelectedValue(values[0], 0, function () {
                    setTimeout(function () {
                        cityPicker.pickers[1].setSelectedValue(values[1]);
                        showUserPickerButton.value = cityPicker.pickers[0].getSelectedText() + " " + cityPicker.pickers[1].getSelectedText();
                        showUserPickerButton.nextElementSibling.innerText = values[0] + "," + values[1];
                    }, 100);

                });
            }

        });
    })(mui, document);
}

//关闭弹窗
$(function () {
    mui('.mui-bar-nav').on('tap', '.shut-out', function () {
        $("#myiframeparent", parent.document).hide();
    });
});

function initImgUploader(idName, uid, uploadSuccess) {
    // 初始化Web Uploader
    var $list = $('#' + idName);
    // 初始化Web Uploader
    var uploader = WebUploader.create({

        // 选完文件后，是否自动上传。
        auto: true,

        // swf文件路径
        swf: 'js/Uploader.swf',

        // 文件接收服务端。
        server: '/uploadapp/upload/create?appid=1000&uid=' + uid,

        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '.filePicker',

        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        }
    });
    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        var $li = $(
            '<div id="' + file.id + '" class="file-item thumbnail">' +
            '<img src>' +
            '</div>'
            ),
            $img = $li.find('img');

        // $list为容器jQuery实例
        $list.html($li);

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }

            $img.attr('src', src);
        }, 900, 500);
        $('.y-xzmfan').hide();
    });


    uploader.on('uploadSuccess', function (file, response) {
        if (uploadSuccess && typeof(uploadSuccess) === "function") {
            uploadSuccess(response);
        }
    });
}

function initMoreUploader(idName, uid, uploadSuccess) {
    var $list = $('#' + idName);//存放文件
    var uploader = WebUploader.create({
        resize: false, // 不压缩image
        swf: 'js/uploader.swf', // swf文件路径
        server: '/uploadapp/upload/create?appid=1000&uid=' + uid, // 文件接收服务端。
        pick: '#picker', // 选择文件的按钮。可选
        chunked: true, //是否要分片处理大文件上传
        chunkSize: 2 * 1024 * 1024, //分片上传，每片2M，默认是5M
        auto: true,//选择文件后是否自动上传
        chunkRetry: 2, //如果某个分片由于网络问题出错，允许自动重传次数
        runtimeOrder: 'html5,flash'
    });
    // 当有文件被添加进队列的时候
    uploader.on('fileQueued', function (file) {
        var sai = file.size;
        if (sai < 1024) {
            sai = sai + 'b';
        }
        else if (sai > 1024 * 1024 * 1024) {
            sai = (file.size / 1024 / 1024 / 1024).toFixed(2) + 'G';
        } else if (sai > 1024 * 1024) {
            sai = (file.size / 1024 / 1024).toFixed(0) + 'M';
        } else if (sai >= 1024) {
            sai = (file.size / 1024).toFixed(0) + 'k';
        }
        $list.append('<div id="' + file.id + '" class="item y-tjkc">' +
            '<div class="y-fjlx-img" style="background-color: #f44c4c">' + file.ext + '</div>' +
            '<div class="info">' +
            '<h5>' + file.name + '</h5>' +
            '<p>' + sai + '</p>' +
            '</div>' +
            '<div class="y-rome"><span>X</span></div>' +
            '</div>');
        //删除上传的文件
        $list.on('click', '.y-rome', function () {
            if ($(this).parent().attr('id') == file.id) {
                uploader.removeFile(file);
                $(this).parent().remove();
            }
            $('#picker').show();
        })
    });
    uploader.on('uploadSuccess', function (file, response) {
        if (uploadSuccess && typeof(uploadSuccess) === "function") {
            uploadSuccess(response);
        }
    });
}

//环节提交描述
function commitTacheDescribe(describe, uploadSuccess) {
    var tacheType = getUrlParamValue("tacheType");
    var activityId = getUrlParamValue("activityId");
    if (Object_filter(describe)) {
        post("/activity/describeSave", {activityId: activityId, tacheType: tacheType, describe: describe}, function (res) {
            if (res.code != '') {
                if (res.code == 200) {
                    mui.toast('修改成功！');
                }
                if (uploadSuccess && typeof(uploadSuccess) === "function") {
                    uploadSuccess(res);
                }
            }
        });
    } else {
        mui.toast('请输入环节的描述！');
    }
}

//活动环节-所有详情页
function activityDetail(id, uploadSuccess) {
    var tacheType = getUrlParamValue("tacheType");		// 环节类型
    var activityId = getUrlParamValue("activityId");	// 活动编号
    if (Object_filter(id)) {
        get("/activity/detailPage?activityId=" + activityId + "&tacheType=" + tacheType + "&id=" + id, function (res) {
            if (res.code != '') {
                if (uploadSuccess && typeof(uploadSuccess) === "function") {
                    uploadSuccess(res);
                }
            }
        });
    }
}

// 活动环节-所有评论列表
function activityComment(id, uploadSuccess) {
    var tacheType = getUrlParamValue("tacheType");		// 环节类型
    var activityId = getUrlParamValue("activityId");	// 活动编号
    if (Object_filter(id)) {
        get("/activity/commentList?activityId=" + activityId + "&tacheType=" + tacheType + "&id=" + id, function (res) {
            if (res.code != '') {
                if (uploadSuccess && typeof(uploadSuccess) === "function") {
                    uploadSuccess(res);
                }
            }
        });
    }
}


//关闭描述弹窗
function closeToDescribe() {
    $(".w-describe-text").hide();
    $(".w-desc-mask").hide();

}

function keypress() //textarea输入长度处理
{
    var text1 = document.getElementById("username").value;

    if (text1.length > 0)//textarea控件不能用maxlength属性，就通过这样显示输入字符数了
    {
        $('.y-fabiao').addClass('active');
    }
    else {
        $('.y-fabiao').removeClass('active');
    }
}

