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

    // =========== 页面基础设置 ===========
    var trBk = $('.tr-bk'),
        colorBox = $('.color-box'),
        popupColor = $('.popup-color'),
        popupShow = false,
        pageCurrentColorBox = colorBox.find('.color-value'),
        popupCurrentColorBox = $('.current-color'),
        popupNewColorBox = $('.new-color'),
        popupColorsBox = $('.alternative-color'),
        colors = ['#FFDAB9', '#E6E6FA', '#8470FF', '#00CED1', '#7FFFD4', '#00FF7F', '#FFD700', '#CD5C5C', '#BBFFFF',
            '#FFA500', '#FF0000', '#8A2BE2', '#EED5B7', '#F0FFDF', '#0000FF', '#00BFFF', '#AB82FF', '#E066FF',
            '#8B1C62', '#FF82AB', '#EE1289', '#EE0000', '#FF6347', '#FF7F00', '#00FF00', '#00FF7F', '#00FFFF'],
        btns = $('.color-show-btns'),
        confirmBtn = $('.popup-color .color-show-btns .confirm'),
        cancelBtn = $('.popup-color .color-show-btns .cancel');


    // 颜色选择器 ~消失
    btns.on('click', '.confirm , .cancel', function (e) {
        if ($(e.target).hasClass('confirm')) pageCurrentColorBox.css('backgroundColor', getAttrValue(popupNewColorBox, 'backgroundColor'));
        trBk.hide();
        popupColor.hide();
    });
    // 颜色选择器 ~选择
    popupColorsBox.find('li').on('click', function () {
        console.log(1);
        var _self = $(this),
            tempColor = getAttrValue(_self, 'backgroundColor');
        console.log(tempColor);
    });
    // =========== vue ===========
    // ~vue
    var xu = new Vue({
        el: '#drawing-board-page',
        data: {
            trBk: false,
            popupColorShow: false,
            selectColor: colors,
            colors: ['#FFDAB9', '#E6E6FA', '#8470FF', '#00CED1', '#7FFFD4', '#00FF7F', '#FFD700', '#CD5C5C', '#BBFFFF',
                '#FFA500', '#FF0000', '#8A2BE2', '#EED5B7', '#F0FFDF', '#0000FF', '#00BFFF', '#AB82FF', '#E066FF',
                '#8B1C62', '#FF82AB', '#EE1289', '#EE0000', '#FF6347', '#FF7F00', '#00FF00', '#00FF7F', '#00FFFF'],
            rgbColor: ['00', '00', '00'],
            hexColor: '000000'
        },
        methods: {
            // 颜色选择器 ~出现
            clickPopupColorShow: function (e) {
                this.trBk = true;
                this.popupColorShow = true;
            },
            // 颜色选择器 ~确定
            colorConfirm: function () {
                pageCurrentColorBox.css('backgroundColor', getAttrValue(popupNewColorBox, 'backgroundColor'));
                this.trBk = false;
                this.popupColorShow = false;
            },
            colorCancel: function () {
                this.trBk = false;
                this.popupColorShow = false;
            }

        }
    });


    //=========== 方法区 ===========
    // 清除属性px单位
    function clearPx(target, attr) {
        return +target.css(attr).replace('px', '');
    }

    // 获取属性值
    function getAttrValue(target, attr) {
        return '' + target.css(attr);
    }

    // 重复字符串
    String.prototype.repeat = function (n) {
        var result = '';
        for (var i = 0; i < n; i++) {
            result += this;
        }
        return result;
    };

    var hexColorArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
        hexColorStr = hexColorArr.join('');

    function hexColorValueValid(hexColorValue) {
        var char = "";
        if (hexColorValue.length > 6) return false;
        for (var i = 0, len = hexColorValue.length; i < len; i++) {
            if (hexColorStr.indexOf(hexColorValue.toUpperCase().charAt(i)) == -1) return false;
        }
        return true;
    }

    //获取rgb颜色值
    function getRGBColor(hexColorValue) {
        // 判断16进制数的合法性
        //不非法直接返回黑色
        if (!hexColorValueValid(hexColorValue)) return ['00', '00', '00'];

        // 获取RGB值
        var tempR, tempG, tempB,
            hexColorValueTemp = hexColorValue || '000'; //默认为黑色
        switch (hexColorValueTemp.length) {
            case 3:
                tempR = calRGBValue(hexColorValueTemp.substring(0, 1).toUpperCase().repeat(2));
                tempG = calRGBValue(hexColorValueTemp.substring(1, 2).toUpperCase().repeat(2));
                tempB = calRGBValue(hexColorValueTemp.substring(2, 3).toUpperCase().repeat(2));
                break;
            case 6:
                tempR = calRGBValue(hexColorValueTemp.substring(0, 2).toUpperCase());
                tempG = calRGBValue(hexColorValueTemp.substring(2, 4).toUpperCase());
                tempB = calRGBValue(hexColorValueTemp.substring(4, 6).toUpperCase());
                break;
            default:
                tempR = tempG = tempB = '00';
                break;
        }
        return [tempR, tempG, tempB];
    }

    // 获取16进制颜色值
    /**
     *
     * @param RGBColor {Array}
     */
    function getHexColor(RGBColor) {
        var tempR = RGBColor[0],
            tempG = RGBColor[1],
            tempB = RGBColor[2];
        console.log(getHexValue(getInt(tempR)));
        console.log(getInt(tempR));
        return '' + calHexValue(tempR) + calHexValue(tempG) + calHexValue(tempB);
    }

    function calRGBValue(hexVal) {
        var tenDigit = getHexIndex(hexVal.charAt(0)),
            singleDigit = getHexIndex(hexVal.charAt(1));
        return tenDigit * 16 + singleDigit;
    }

    function calHexValue(RGBVal) {
        return getHexValue(getInt(RGBVal)) + getHexValue(getRem(RGBVal))
    }

    // 取整
    function getInt(num) {
        return Math.floor(num / 16);
    }

    // 取余
    function getRem(num) {
        return num % 16;
    }

    //获得数字对应的16进制数列表的位置
    function getHexIndex(value) {
        return hexColorStr.indexOf(value);
    }

    //根据位置获得16进制数
    function getHexValue(index) {
        return hexColorStr.charAt(index);
    }
});