/*
 * GoogoKMC
 * IE没测啊
 * 图片全屏放大插件
 * 模态层和用来放大的IMG初始化一次后都是重用的
 * */
(function(KMC) {
    "use strict";
    KMC(jQuery, window, document);
})(function($, window, document) {
    var KMCZoom = function(option) {
            this.valid = (function(that) {
                var errMsg = '';
                if ($(that).length != 1) {
                    errMsg = 'one more items or nothing';
                    console.log(errMsg);
                    return false;
                } else if (!$(that).is('img')) {
                    errMsg = 'img required';
                    console.log(errMsg);
                    return false;
                } else return true;
            })(this)
            if (false === this.valid) return 'invalid item';
            /*接受属性什么的先不写了*/
            //初始化
            var that = this,
                //origin 是触发这个放大时候鼠标的event，不传也无所谓，穿了图片在鼠标点击的位置放大，不传就中心放大
                defaults = {
                    'origin': undefined,
                    'zoomScroll': true,
                    'zoomDrag': true,
                    'zoomOnAnimate': true,
                    /*config.zoomOnAnimate,*/
                    'zoomOffAnimate': true /*config.zoomOffAnimate,*/
                },
                settings = $.extend(defaults, option);
            (function(originPic) {
                //加模态层
                initModal();
                //建图像对象
                var img = buildIMG(originPic, settings.origin);
                //图片移动
                settings.zoomScroll && movePic(img);
                //滚轮放大
                settings.zoomDrag && wheelZoom(img);
                /*
                 屏幕大小发生变化时，模态层和图片大小重新计算
                 * */
                $(window).resize(function() {
                    //重算模态框高度
                    caculateModal();
                    //重算图片宽高位置
                    caculatePicWHP(img);
                })
            })(this)
        }
        //添加蒙版
    function initModal() {
        //第一次添加模态层
        $('#kmcPicZoom').length == 0 && $(document.body).append('<div id="kmcPicZoom"></div>');
        //以后的直接显示
        $('#kmcPicZoom').length == 1 && showModal();
        //计算模态框的高度
        caculateModal();
        //点击关闭
        $("#kmcPicZoom").on('click', function() {
            hideModal();
        })
    }
    //隐藏蒙版
    function hideModal() {
        //最后一下把放大还原成1倍
        $('#kmcPicZoom').length == 1 && $('#kmcPicZoom').hide() && $("#zoomedPic").css('transform', 'matrix(1,0,0,1,0,0)');
    }
    //显示蒙版
    function showModal() {
        $('#kmcPicZoom').length == 1 && $('#kmcPicZoom').show();
    }
    //计算蒙版的高度
    function caculateModal() {
        $('#kmcPicZoom').length == 1 && $("#kmcPicZoom").height(document.documentElement.clientHeight);
    }
    //计算图片宽高和位置
    function caculatePicWHP(origin) {
        //实现中心放大效果step1
        origin.css('transition', 'none');
        //屏幕宽高
        var sH = document.documentElement.clientHeight,
            sW = document.documentElement.clientWidth;
        //屏幕宽高比（长宽比）
        var aspectRatioScreen = sW / sH;
        //计算图片宽高比，直接用origin的可能会出现问题，所以new一个获取图片实际宽高
        var newImg = new Image;
        newImg.src = origin.attr('src');
        var aspectRatioPicture = newImg.width / newImg.height;
        //实现中心放大效果step2
        origin.css('transition', 'all 0.3s');
        //图片宽高随屏幕比例走并保持居中
        aspectRatioScreen > aspectRatioPicture ?
            origin.css({
                'height': sH,
                'width': sH * aspectRatioPicture,
                'left': (sW - sH * aspectRatioPicture) / 2,
                'top': 0
            }) :
            origin.css({
                'width': sW,
                'height': sW / aspectRatioPicture,
                'top': (sH - sW / aspectRatioPicture) / 2,
                'left': 0
            });
    }
    //创建一个用来显示放大的图片
    function buildIMG(origin, e) {
        //创建
        if ($('#zoomedPic').length == 0) {
            //init
            var zoomedPic = new Image;
            zoomedPic.src = $(origin).attr('src');
            zoomedPic.id = 'zoomedPic';
            zoomedPic.style.position = 'fixed';
            //添加
            $("#kmcPicZoom").append(zoomedPic);
        } else {
            //重复使用img
            $('#zoomedPic').attr('src', $(origin).attr('src'));
        }
        //中心放大,配合计算函数实现，如果有鼠标点击的e传过来，就定位点击为原点
        var top = e == undefined ? '50%' : e.clientY,
            left = e == undefined ? '50%' : e.clientX;
        $('#zoomedPic').css({ 'top': top, 'left': left, 'width': '0', 'height': '0' });
        //计算宽高位置
        setTimeout
        caculatePicWHP($("#zoomedPic"));
        return $('#zoomedPic');
    }
    /*销毁图片
     * */
    function destoryIMG(origin) {}
    /*滑轮放大图片*/
    function wheelZoom(origin) {
        origin.on('mouseover', function() {
            var that = this;
            //小手
            that.style.cursor = 'url("data:image/gif;base64,R0lGODlhEAAQAJECAAAAAP///////wAAACH5BAEAAAIALAAAAAAQABAAQAI3lC8AeBDvgosQxQtne7yvLWGStVBelXBKqDJpNzLKq3xWBlU2nUs4C/O8cCvU0EfZGUwt19FYAAA7"), ew-resize'
            $(that).on("mousewheel ", function(e) {
                //几个浏览器对鼠标滑轮上下的值不同，用这个方式统一下，这两行代码是copy，学习下
                var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
                    (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1)); // firefox
                //放大前的scale()参数，如果未放大过scale是NaN
                var scale = parseFloat($(that).css('transform').substring(7).split(',')[0]);
                var rS = isNaN(scale) ? 1 : scale,
                    //倍放系数等
                    toUp = toDown = 2,
                    max = 16,
                    min = 0.5;
                //最后的数
                var rsc = rsc = delta > 0 ? (rS * toUp > max ? max : rS * toUp) : (rS / toUp < min ? min : rS / toUp);
                $(that).css('transform', 'matrix(' + rsc + ', 0, 0, ' + rsc + ', 0, 0)');
            });
        });
        origin.on('mouseout', function() {
            $(this).unbind('mousewheel');
        });
    }
    /*图片移动代码*/
    function movePic(origin) {
        //图片移动代码
        var distX, distY;
        //记录元素本身的transition配置
        var selftransition = origin.css('transition');
        /*先阻止点击图片冒泡，防止触发父容器模态层点击关闭事件*/
        origin.on('click', function(e) {
                e.stopPropagation();
            })
            //拖拽正式开始
        origin.on('mousedown', function(e) {
            /*
             该方法将通知 Web 浏览器不要执行与事件关联的默认动作（如果存在这样的动作）。
             例如，如果 type 属性是 "submit"，在事件传播的任意阶段可以调用任意的事件句柄，通过调用该方法，可以阻止提交表单。
             注意，如果 Event 对象的 cancelable 属性是 fasle，那么就没有默认动作，或者不能阻止默认动作。无论哪种情况，调用该方法都没有作用。
             -----------------因为没加之前拖动图片，会先有一个禁止拖动的样子，应该是浏览器的拖动效果，加上就OK了--------------------
             * */
            e.preventDefault();
            var sX = e.clientX,
                sY = e.clientY;
            //将元素本身的transition效果取消，不然会影响到拖拽效果
            origin.css('transition', 'none');
            //				document.body.style.cursor = 'move';//这里因为后来设置了base64的图片，在滚轮放大函数里边，所以没用了，注释掉

            document.onmousemove = function(e) {
                distX = e.clientX - sX;
                distY = e.clientY - sY;
                sX = e.clientX;
                sY = e.clientY;
                /*
                 大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑大坑
                		$('#zoomedPic').position().top
                		87.5
                		$('#zoomedPic').css('top')
                		"0px"
                俩值还不一样了
                		position() 方法返回匹配元素相对于父元素的位置（偏移）。
                		该方法返回的对象包含两个整型属性：top 和 left，以像素计。
                		此方法只对可见元素有效。
                 * */
                origin.css({
                    'top': parseInt(origin.css('top')) + distY + 'px',
                    'left': parseInt(origin.css('left')) + distX + 'px',
                });
            }
        })
        document.onmouseup = function(e) {
            //恢复原有的transition
            origin.css('transition', selftransition);
            //			document.body.style.cursor = 'default';
            document.onmousemove = null;
        }
    }

    $.fn.kmcPicZoom = KMCZoom;
    return $.fn.kmcPicZoom;

})