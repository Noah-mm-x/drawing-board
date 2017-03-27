/**
 * Created by mengfanxu on 17/3/22.
 */
$(function () {

    /*
     * 工具
     *     1：普通笔
     *     2：毛笔
     *     3：圆形
     *     4：方形
     * */

    var canvas = $('#drawing-board'),
        ctx = canvas[0].getContext('2d'),
        selectTool = $('#select-tool'),
        moving = false;
    canvas.on('mousedown', function (e) {
        if (selectTool.val() == '' || selectTool.val() == undefined || selectTool.val() == null) return false;
        moving = true;
        switch (selectTool.val()) {
            case '1':
                ctx.beginPath();
                ctx.moveTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                $(document).on('mousemove', function (e) {
                    e.preventDefault();
                    if (!moving) return false;
                    ctx.lineTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                    ctx.stroke();
                });
                $(document).on('mouseup', function (e) {
                    moving = false;
                    ctx.closePath();
                });
                break;
            case '2':
                ctx.beginPath();
                ctx.lineCap = "round";
                ctx.lineWidth = 5;
                ctx.moveTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                $(document).on('mousemove', function (e) {
                    e.preventDefault();
                    if (!moving) return false;
                    ctx.lineTo(e.pageX - canvas.offset().left, e.pageY - canvas.offset().top);
                    ctx.stroke();
                });
                $(document).on('mouseup', function (e) {
                    moving = false;
                    ctx.closePath();
                });
                break;
        }


    });

    $('.tools > li').on('click', function () {
        var _self = $(this);
        _self.siblings().removeClass('active');
        if (_self.hasClass('active')) {
            _self.removeClass('active');
            selectTool.val('');
        } else {
            _self.addClass('active');
            selectTool.val(_self.data('tool'));
        }
    });

    function clearPx(target, attr) {
        return +target.css(attr).replace('px', '');
    }
});