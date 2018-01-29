# jQuery-piczoom
## 说明
毕业前为了练习jQuery写的一个主要用来放大图片的插件，由于没有具体的需求因此完全凭着自己的想象写了写功能，还很不完善（图片放大时偶有卡顿），如果有幸有人喜欢这个插件，欢迎指出各种bug。
## 功能
> 1. 图片选择功能（选择，取消选择，获取已选择的图片）<br>
> 2. 图片放大功能（全屏适应窗口放大，滚轮调整图片大小，任意拖拽调整位置等）
## 使用方法
    //给图片加一个框框，显示加载动画并且点击后放大（点击放大和选择不共存~）
    $('#test-img').kmcPicManage({
        'selectable': false,//是否可选择
        'zoomable': true,//是否可放大
        'zoomScroll': true,//是否可放大
        'zoomDrag': true,//是否可拖拽
        'zoomOnAnimate': true,//放大时是否动画
    });
    //或点击图片直接放大
    $('#test-img2').on('click',function(){
        $(this).kmcPicZoom({
            'origin': true,//从点击的位置开始放大
            'zoomScroll': true,
            'zoomDrag': true,
            'zoomOnAnimate': true,
        });
    })