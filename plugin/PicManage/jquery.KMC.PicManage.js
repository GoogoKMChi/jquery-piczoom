/*
 *GoogoKMC
 * IE没测啊
 * 后续加上如果初始化传入的是URL的话直接生成img展示
 * */
(function(KMC) {
    "use strict";
    /*自己用的浏览器环境用的，没做那么多神奇的环境判断*/
    KMC(jQuery, window, document);
}(function($, window, document) {

    var KPManage = function(option) {
            //检测一下所有元素都是img
            this.valid = (function(that) {
                var errMsg = '';
                that.each(function() {
                    if (!$(this).is('img')) {
                        errMsg += '<' + this.tagName.toLowerCase() + '>' + ' is not <img />\n';
                    }
                });
                if (errMsg) {
                    alert(errMsg);
                    return false;
                } else {
                    return true;
                }
            })(this)
            if (false === this.valid) return 'invalid tag';
            /*——————————————————————————————————————————__________________________________________________________________________________________—————————————————————*/
            /*初始化的属性设置，这里有待完善，mark*/
            var that = this,
                defaults = {
                    'selectable': false,
                    'zoomable': false,
                    'zoomScroll': false,
                    'zoomDrag': false,
                    'zoomOnAnimate': false,
                    'zoomOffAnimate': false,
                },
                settings = $.extend(defaults, option);
            //初始化加载图片等
            (function _init(o) {
                /*$('#img1').kmcPicManage().toggleSelect();要是重复这么写了不能出错是不是，不能重复初始化，我用这个判断的，可能不严谨，没仔细想，先这么着了，mark*/
                /*防止重复初始化*/
                if ($(o).parent().hasClass('kmc-pic-border')) return;
                /*开始*/
                //图片默认隐藏，加载完后淡入效果
                $(o).css('opacity', '0');
                $(o).each(function() {
                        //把图片装进一个Div中并设置其基本样式
                        $(this).wrap("<div class='kmc-pic-border loader'></div>");
                        //放一个加载动画层，但是这个动画并不完美，有待完善，mark（图片加载太快可能是，反正放大和位移不同步，于是这个动画就向左下角跑然后再回中间这么一个情况）
                        $(this).parent().prepend('<div class="loader-inner ball-scale-multiple kmc-loading"><div></div><div></div><div></div></div>');
                        Imagess($(this).attr('k-src'), this, checkimg);
                        /*图片可选中，默认不开启^_-* */
                        $(this).attr('selectable') !== undefined ? selectable(this) : settings.selectable == true ? selectable(this) : false;
                        /*图片放大*/
                        $(this).attr('zoomable') !== undefined ? zoomable(this, settings) : settings.zoomable == true ? zoomable(this, settings) : false;
                        /*图片点击事件*/
                    })
                    //淡入效果动画
                $(o).animate({ opacity: '1' }, 1500, 'swing', function() {
                    /*图片出现后的回调，后期加上好叻，先不写咯*/
                });
            })(this)
            //获取选中的图片
            this.getSelectPic = function() {
                return $('.kmc-pic-border-select img');
            }
            this.select = function() {
                $(that).parent().addClass('kmc-pic-border-select');
            }
            this.unSelect = function() {
                $(that).parent().removeClass('kmc-pic-border-select');
            }
            this.toggleSelect = function() {
                $(that).parent().toggleClass('kmc-pic-border-select');
            }
            this.$ = function(obj) {
                //暂时还不知道怎么写
                //			return jQuery('this example');
            }
            this.zoom = function() {

            }
            return this;
        }
        //判断是否加载完成
    function Imagess(url, imgid, callback) {
        //创建一个临时的图片用来判断加载情况，加载完了之后再将图片给真实的<img/>
        var val = url;
        var img = new Image();
        img.src = url;
        //这里没有判断浏览器的兼容性等--有待完善，mark
        img.onload = function() {
                if (img.complete == true) {
                    callback(img, imgid);
                }
            }
            //如果因为网络或图片的原因发生异常，则显示该图片-------还没写，有待完善，mark
            //		  img.onerror=function(){img.src='img/2.jpg'}
            //		  img.src=val;
    }
    //显示图片
    function checkimg(obj, imgid) {
        //加载完的图片给正主
        imgid.src = obj.src;
        //判断图片是横向的还是纵向的以计算垂直居中还是水平居中
        var isHorizontal = imgid.width >= imgid.height;
        $(imgid).css(isHorizontal ? 'width' : 'height', '100%');
        if (isHorizontal) {
            $(imgid).css({ 'margin-top': ($('.kmc-pic-border').height() - imgid.height) / 2 + 'px' });
        } else {
            $(imgid).css({ 'margin-left': ($('.kmc-pic-border').width() - imgid.width) / 2 + 'px' })
        }
        //结束加载动画并将动画层移走。。。。怕影响点击事件
        setTimeout(function() {
            $($(imgid).parent().children()[0]).addClass('kmc-loading-end');
            $($(imgid).parent().children()[0]).children().addClass('kmc-loading-end-child');
        }, 300)
        setTimeout(function() { $($(imgid).parent().children()[0]).remove() }, 1100);
    }
    //图片可选中
    function selectable(o) {
        $(o).parent().on('click', function() {
            //选中边框的样式
            $(this).toggleClass('kmc-pic-border-select');
        }).addClass('kmc-pic-border-selectable');
        //第二个class是加了一个transition和一个鼠标手指状态
    }

    function zoomable(o, config) {
        $(o).on('click', function(e) {
            $(this).kmcPicZoom({
                'origin': e,
                'zoomScroll': config.zoomScroll,
                'zoomDrag': config.zoomDrag,
                'zoomOnAnimate': config.zoomOnAnimate,
                'zoomOffAnimate': config.zoomOffAnimate,
            });
        })
    }
    $.fn.kmcPicManage = KPManage;
    return $.fn.kmcPicManage;
}))