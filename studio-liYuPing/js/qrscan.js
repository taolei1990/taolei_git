/**
 * html5调用摄像头扫码
 */
;(function (win, doc) {
    function QRScan(div_id) {
        this.div_id = div_id;
        this.div_can = null;
        this.videos = [];
        this.medioConfig = {};
        this.can_open = false;
        this.init();
    }

    QRScan.prototype = {
        init: function () {
            win.URL = (win.URL || win.webkitURL || win.mozURL || win.msURL);
            var promisifiedOldGUM = function(constraints) {
                var getUserMedia = (navigator.getUserMedia ||
                    navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
            if(navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {};
            }
            if(navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = promisifiedOldGUM;
            }

            var self = this;
            self.div_can = doc.getElementById(self.div_id);
            navigator.mediaDevices.enumerateDevices().then(function(devices) {
                devices.forEach(function (dv) {
                    var kind = dv.kind;
                    if (kind.match(/^video.*/)) {
                        self.videos.push(dv.deviceId);
                        console.log(dv);
                    }
                });
                var len = self.videos.length;
                self.can_open = true;
                self.medioConfig = {
                    audio: false,
                    video: { deviceId: self.videos[len - 1] }
                }
            });
        },
        openScan: function () {
            var self = this;
            if (self.can_open) {
                var vd = doc.createElement('video');
                vd.setAttribute('id', 'video_id');
                navigator.mediaDevices.getUserMedia(self.medioConfig).then(function (stream) {
                    $("#result").append("<p>调用摄像头成功</p>");
                    vd.src = win.URL.createObjectURL(stream);
                    self.div_can.appendChild(vd);
                }).catch(function (err) {
                    var p = doc.createElement('p');
                    p.innerHTML = 'ERROR: ' + err.name +
                                  '<br>该浏览器不支持调用摄像头';
                    self.div_can.appendChild(p);
                });
                vd.play();
            }
        },

        closeScan: function () {
            this.div_can.innerHTML = '';
            $("#result").append("<p>关闭扫一扫</p>");
        },
        // 截图上传
        getImgDecode: function (func) {
            var self = this;
            var video = doc.getElementById('video_id');
            var canvas = doc.createElement('canvas');
            canvas.width = 300;
            canvas.height = 300;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 300, 300);

            if (canvas.toBlob === undefined) {
                var base64 = canvas.toDataURL();
                var blob = self.Base64ToBlob(base64);
                self.sendBlob(blob, func);

            } else {
                canvas.toBlob(function (blob) {
                    self.sendBlob(canvas.toDataURL(), func);
                });
                // var img="<img src='"+canvas.toDataURL()+"' />"
                // $("#result").append(img);
                $("#result").append("<p>开始截图</p>");
            }
        },

        sendBlob: function (blob, func) {
            // var p = "<p>准备上传</p>";
            // $("#result").append(p);
            // var fd = new FormData();
            // // alert(blob+func)
            // fd.append('auth', 'lkl123456');
            // fd.append('file', blob);
            // console.log("截图",blob);
            // var xhr = new XMLHttpRequest();
            // xhr.open('post', 'http//:127.0.0.1:7009/dd/qcode', true);
            // var p3 = "<p>p3"+JSON.parse(xhr.responseText)+"</p>";
            // $("#result").append(p3);
            // xhr.onload = function () {
            //     var p1 = "<p>上传成功</p>";
            //     $("#result").append(p1);
            //     var p2 = "<p>"+JSON.parse(xhr.responseText)+"</p>";
            //     $("#result").append(p2);
            //    func ? func(JSON.parse(xhr.responseText)) : null;
            //
            // };
            // xhr.send(fd);
var b='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'
            $.ajax({
                type: 'post',
                url: 'http://route.showapi.com/887-4',
                dataType: 'json',
                data: {
                    "showapi_appid": '83515', //这里需要改成自己的appid
                    "showapi_sign": 'cdf60a58375f4402a6c12754d5dea221',  //这里需要改成自己的应用的密钥secret
                    "imgData":b,
                    "handleImg":""
                },

                error: function(XmlHttpRequest, textStatus, errorThrown) {
                    // alert("操作失败!");
                    $("#result").append("<p>请求失败</p>");
                },
                success: function(result) {
                    if (result.showapi_res_code==0){
                        var data=result.showapi_res_body
                        var id=result.showapi_res_id
                        var ts=data.retText
                        var cd=data.ret_code
                        $("#result").append('<p>请求成功id=='+id+'</p>');
                        $("#result").append("<p>请求成功地址=="+ts+"</p>");
                        $("#result").append("<p>请求成功cd=="+cd+"</p>");
                        scan.closeScan();
                        $('#close,.box-1').hide()
                    }
                }
            });
        },

        Base64ToBlob: function (base64) {
            var code = win.atob(base64.split(',')[1]);
            var len = code.length;
            var as = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                as[i] = code.charCodeAt(i);
            }
            return new Blob([as], {type: 'image/png'});
        }
    }

    win.QRScan = QRScan;
}(window, document));




