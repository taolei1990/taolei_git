/**
 * html5调用摄像头扫码
 */

function cdata(){

};
(function (win, doc) {
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
                navigator.mediaDevices = {

                };
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
                    $('#result').append('<p>摄像头允许调用</p>')
                    $('#close,.box-1').show()
                    vd.src = win.URL.createObjectURL(stream);
                    self.div_can.appendChild(vd);
                }).catch(function (err) {
                    // var p = doc.createElement('p');
                    // p.innerHTML = 'ERROR: ' + err.name +
                    //               '<br>该浏览器不支持调用摄像头';
                    // self.div_can.appendChild(p);
                    $('#result').append('<p>该手机浏览器没权限调用摄像头'+err.name+'</p>')
                    $('#close,.box-1').hide()
                });
                vd.play();
            }

        },

        closeScan: function () {
            this.div_can.innerHTML = '';
            $('#close,.box-1').hide()
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
                // $('#result').append('<p>获取图片二维码</p>')
                $('#sdafe').attr('src',canvas.toDataURL())
                // var img="<img id='"+said+"' src='"+canvas.toDataURL()+"' />"
                // $("#result").append(img);
            }
        },

        sendBlob: function (blob, func) {
            codeAnalysis('sdafe')
            $('#result').append('<p>开始解析</p>')
            // var fd = new FormData();
            // fd.append('auth', 'lkl123456');
            // fd.append('base64', blob);
            // var xhr = new XMLHttpRequest();
            // xhr.onreadystatechange = cdata();
            // xhr.open('post', 'https://px.dev.yunjy.com.cn/api/test/qcode', true);
            // xhr.onload = function () {
            //     var data = JSON.parse(xhr.responseText);
            //     if(data.resultCode == 200){
            //         $('#result').append('<p>请求成功</p>')
            //         $('#result').append('<p>解析内容：'+data.resultMsg+'</p>')
            //         // scan.closeScan();
            //         // $('#close,.box-1').hide();
            //         window.location.href=data.resultMsg;
            //         scan.closeScan();
            //
            //         $('#close,.box-1').hide()
            //     }else {
            //
            //     }
            //    // var p1 = "<p>上传成功</p>";
            //   //  $("#result").append(p1);
            //   //    var p2 = "<p>"+JSON.parse(xhr.responseText)+"</p>";
            //   //  $("#result").append(p2);
            //   // func ? func(JSON.parse(xhr.responseText)) : null;
            //
            // };
            // xhr.send(fd);

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

function codeAnalysis(imgId) {
    analyticCode.getUrl('img-url',document.getElementById(imgId),function(e){
        if (e=='error decoding QR Code') {
            console.log('解析错误')
            mui.toast('解析错误')
        }else {
            $('#result').append('<p>解析成功:'+e+'</p>')
                    scan.closeScan();
                    $('#close,.box-1').hide();
                    if(checkUrl(e)){
                          window.location.href=e;
                    } else {
                        mui.alert(e)
                    }
        }

    });
}
function checkUrl(urlString){
    if(urlString!=""){
        var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        if(!reg.test(urlString)){
            return false
        }else{
            return true
        }
    }
}