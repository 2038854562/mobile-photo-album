/**
 * jinz 2017/9/12
 */
$(function() {

    var $container = $('#container');
    var total = 17;
    var zWin = $(window);

    var render = function() {
            //padding
            var pad = 2;
            //窗口宽度
            var winWidth = zWin.width();
            //每张图片宽度
            var picWidth = Math.floor((winWidth - pad * 3) / 4);
            var templ = '';
            //把图片添加到页面
            for (var i = 1; i <= total; i++) {
                var imgSrc = '../image/' + i + '.jpg';
                //每行第一张图片的padding-left
                var pFirst = pad;
                if (i % 4 == 1) {
                    pFirst = 0;
                }
                templ += '<li data-id="' + i + '" class="animated bounceIn" style="width:' + picWidth + 'px;height:' + picWidth + 'px;padding-top:' + pad + 'px;padding-left:' + pFirst + 'px;"><canvas id="cvs' + i + '"></canvas></li>';
                //创建img 对象
                var imgObject = new Image();
                imgObject.index = i;
                imgObject.onload = function() {
                    var cvs = $('#cvs' + this.index)[0].getContext('2d');
                    cvs.width = this.width;
                    cvs.height = this.height;
                    cvs.drawImage(this, 0, 0);
                }
                imgObject.src = imgSrc;
            }

            $container.html(templ)
        }
        //执行render方法
    render();

    // 触摸显示大图方法
    var wImage = $('#largeImg');
    var domImage = wImage[0];
    var loadImg = function(id, callback) {
        $('#largeContainer').css({
            width: zWin.width(),
            height: zWin.height()
        }).show();
        var imgSrc = '../image/' + id + '.jpg';
        var imgObject = new Image();
        imgObject.onload = function() {
            var realWidth = this.width; //图片实际宽度
            var realHeight = this.height; //图片实际高度
            var winWidth = zWin.width(); //窗口宽度
            var winHeight = zWin.height(); //窗口高度
            var showW = winHeight * realWidth / realHeight; //图片展示宽度
            var showH = winWidth * realHeight / realWidth; //图片展示高度
            var paddingLeft = parseInt((winWidth - showW) / 2); //竖放时的padding-left
            var paddingTop = parseInt((winHeight - showH) / 2); //横放时的padding-left
            // 计算宽高比 以实现图片 横放 还是竖放
            wImage.css({
                width: "auto",
                height: "auto",
                paddingLeft: 0,
                paddingTop: 0
            });
            if (realHeight / realWidth > winHeight / winWidth) { //竖放
                wImage.attr('src', imgSrc).css('height', winHeight).css('padding-left', paddingLeft);
            } else { //横放
                wImage.attr('src', imgSrc).css('width', winWidth).css('padding-top', paddingTop);
            };
            callback && callback(); //存在并执行回调函数；
        }
        imgObject.src = imgSrc;

    }


    // 触摸事件代理
    var cid;
    $("#container").delegate('li', 'tap', function() {
        var _id = cid = $(this).attr('data-id');
        loadImg(_id);
    });

    //点击大图消失以及左右切换
    $('#largeContainer').tap(function() {
        $(this).hide();
    }).swipeLeft(function() {
        cid++;
        if (cid > total) {
            cid = total;
        } else {
            loadImg(cid, function() {
                // 动画结束移除添加的类和动画结束事件webkitAnimationEnd
                domImage.addEventListener('webkitAnimationEnd', function() {
                    wImage.removeClass('animated bounceInRight');
                    domImage.removeEventListener('webkitAnimationEnd', arguments.callee);
                }, false);
                wImage.addClass('animated bounceInRight');
            });
        }
    }).swipeRight(function() {
        cid--;
        if (cid <= 0) {
            cid = 1;
        } else {
            loadImg(cid, function() {
                // 动画结束移除添加的类和动画结束事件webkitAnimationEnd
                domImage.addEventListener('webkitAnimationEnd', function() {
                    wImage.removeClass('animated bounceInLeft');
                    domImage.removeEventListener('webkitAnimationEnd', arguments.callee);
                }, false);
                wImage.addClass('animated bounceInLeft');
            });
        }
    });





})