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
            var base64 = canvas.toDataURL();
            var blob = self.Base64ToBlob(base64);
            if (canvas.toBlob === undefined) {

                self.sendBlob(blob, func);

            } else {
                canvas.toBlob(function (blob) {
                    self.sendBlob(blob, func);
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
var cr="iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAIAAAAABMCaAAABoUlEQVR42u3a0Q3DIAwFwOy/dLtCqP0IcY9PlNJwkbBlc32M8rgQQIQ4EvEKjMr6d357a5PpfUGECHE8YumgLayzCpp+nzvrQIQI8b8QK0Fg+YXCgSWxL4gQIUJMHfwJXIgQIUKcgLj6vwILRIgQdyAmChAnJNuvr+JAhAhxG2K6UfXU/KhuH0SIEKOI8Ys/i8GhEky27gsiRIgjEbsuFlWS7UoAOTrZhggR4hjEpxpJkQJqoAAMESLE+YhdDaauZLvrmcglLIgQIY5HTDTsE0lv14d5rLINESLEYxHTiW66Gd91AaoUWCBChDgGcWczKF1E6CrWxgsQECFCfAViV3EhkYS3FVNPuBUGESLEVyAmDuadza90QIMIESLE6mGcKIhGAkW6eQ8RIsRXIO4sOiSaWUcUICBChDgG8QqMrsZTev6xC00QIUJ8BWI6gCRAE4EFIkSIEKtNqHQz/gqP5Q8PESJEiI0NphOwKoELIkSIEH95oUSyXVm/bb8QIUL8K8TTINIFC4gQIULc0ag6bb7rGYgQIc5ENH4MbgggQpwyvlFyqHYsCUgcAAAAAElFTkSuQmCC"
    $.ajax({
                type: 'post',
                url: 'http://route.showapi.com/887-4',
                dataType: 'json',
                data: {
                    "showapi_appid": '83515', //这里需要改成自己的appid
                    "showapi_sign": 'cdf60a58375f4402a6c12754d5dea221',  //这里需要改成自己的应用的密钥secret
                    "imgData":cr,
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
                        $("#result").append("<p>请求成功地址s=="+ts+"</p>");
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




