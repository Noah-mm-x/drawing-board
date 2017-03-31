/**
 * Created by mengfanxu on 17/3/22.
 * # 为工具性方法
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

    // // 颜色选择器 ~消失
    // btns.on('click', '.confirm , .cancel', function (e) {
    //     if ($(e.target).hasClass('confirm')) pageCurrentColorBox.css('backgroundColor', getAttrValue(popupNewColorBox, 'backgroundColor'));
    //     trBk.hide();
    //     popupColor.hide();
    // });
    // // 颜色选择器 ~选择
    // popupColorsBox.find('li').on('click', function () {
    //     var _self = $(this),
    //         tempColor = getAttrValue(_self, 'backgroundColor');
    // });

    var xu = new Vue({
        el: '#drawing-board-page',
        data: {
            trBk: false,
            popupColorShow: false,
            colors: ['#FFDAB9', '#E6E6FA', '#8470FF', '#00CED1', '#7FFFD4', '#00FF7F', '#FFD700', '#CD5C5C', '#BBFFFF',
                '#FFA500', '#FF0000', '#8A2BE2', '#EED5B7', '#F0FFDF', '#0000FF', '#00BFFF', '#AB82FF', '#E066FF',
                '#8B1C62', '#FF82AB', '#EE1289', '#EE0000', '#FF6347', '#FF7F00', '#00FF00', '#00FF7F', '#00FFFF'],
            pageColor: '000000',
            newColor: '000000',
            RColor: '00',
            GColor: '00',
            BColor: '00',
            hexColorArr: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
            hexColorStr: '0123456789ABCDEF'
        },
        methods: {
            // 颜色选择器 ~出现
            clickPopupColorShow: function (e) {
                var currentBkColor = this.getAttrValue($(e.target), 'backgroundColor');
                this.trBk = true;
                this.popupColorShow = true;
                this.newColor = this.getHexColorFromRgb(currentBkColor);
                this.RColor = this.getRGBColor(this.getHexColorFromRgb(currentBkColor))[0];
                this.GColor = this.getRGBColor(this.getHexColorFromRgb(currentBkColor))[1];
                this.BColor = this.getRGBColor(this.getHexColorFromRgb(currentBkColor))[2];
            },
            // 颜色选择器 ~确定
            colorConfirm: function () {
                this.trBk = false;
                this.popupColorShow = false;
                this.pageColor = this.newColor;
            },
            // 颜色选择器 ~取消
            colorCancel: function () {
                this.trBk = false;
                this.popupColorShow = false;
            },
            // 颜色选择器 ~选择
            selectColor: function (e) {
                var selectedColor = this.getAttrValue($(e.target), 'backgroundColor');
                this.newColor = this.getHexColorFromRgb(selectedColor);
            },
            // 颜色选择器 ~绑定
            bindHex: function (e) {
                this.newColor = $(e.target).val();
                this.RColor = this.getRGBColor($(e.target).val())[0];
                this.GColor = this.getRGBColor($(e.target).val())[1];
                this.BColor = this.getRGBColor($(e.target).val())[2];
            },
            bindRColor: function (e) {
                this.RColor = $(e.target).val();
                this.newColor = '' + this.getHexColorFromRGB([this.RColor,this.GColor,this.BColor]);
            },
            bindGColor: function (e) {
                this.GColor = $(e.target).val();
                this.newColor = '' + this.getHexColorFromRGB([this.RColor,this.GColor,this.BColor]);
            },
            bindBColor: function (e) {
                this.BColor = $(e.target).val();
                this.newColor = '' + this.getHexColorFromRGB([this.RColor,this.GColor,this.BColor]);
            },
            //=========== 方法区 ===========
            // 获取属性的具体数值 #
            getAttrValue: function (target, attr, unit) {
                unit = unit || "";
                return '' + target.css(attr).replace(unit, '');
            },
            // 获取颜色值得具体数值 #
            getColorValue: function (str) {
                return str.replace('#', '');
            },
            //判断16进制数的合法性 #
            hexColorValueValid: function (hexColorValue) {
                if (hexColorValue.length > 6) return false;
                for (var i = 0, len = hexColorValue.length; i < len; i++) {
                    if (this.hexColorStr.indexOf(hexColorValue.toUpperCase().charAt(i)) == -1) return false;
                }
                return true;
            },
            // 获取RGB颜色值 hexColorValue:'000000'
            getRGBColor: function (hexColorValue) {
                //不非法直接返回黑色
                if (!this.hexColorValueValid(hexColorValue)) return ['00', '00', '00'];

                // 获取RGB值
                var tempR, tempG, tempB,
                    hexColorValueTemp = hexColorValue || '000000'; //默认为黑色
                switch (hexColorValueTemp.length) {
                    case 1:
                        tempR = tempG = tempB = this.calRGBValue(hexColorValueTemp.toUpperCase().repeat(2));
                        break;
                    case 2:
                        tempR = tempG = tempB = this.calRGBValue(hexColorValueTemp.toUpperCase());
                        break;
                    case 3:
                        tempR = this.calRGBValue(hexColorValueTemp.substring(0, 1).toUpperCase().repeat(2));
                        tempG = this.calRGBValue(hexColorValueTemp.substring(1, 2).toUpperCase().repeat(2));
                        tempB = this.calRGBValue(hexColorValueTemp.substring(2, 3).toUpperCase().repeat(2));
                        break;
                    case 6:
                        tempR = this.calRGBValue(hexColorValueTemp.substring(0, 2).toUpperCase());
                        tempG = this.calRGBValue(hexColorValueTemp.substring(2, 4).toUpperCase());
                        tempB = this.calRGBValue(hexColorValueTemp.substring(4, 6).toUpperCase());
                        break;
                    default:
                        tempR = tempG = tempB = '00';
                        break;
                }
                return [tempR, tempG, tempB];
            },
            // 获取16进制颜色值   RgbColor : rgb(n,n,n)
            getHexColorFromRgb: function (RgbColor) {
                var tempR = this.RGBReg(RgbColor)[0],
                    tempG = this.RGBReg(RgbColor)[1],
                    tempB = this.RGBReg(RgbColor)[2];
                return '' + this.calHexValue(tempR) + this.calHexValue(tempG) + this.calHexValue(tempB);
            },
            // 获取16进制颜色值   RGBColor : [n,n,n]
            getHexColorFromRGB : function (RGBColor) {
                var tempR = RGBColor[0],
                    tempG = RGBColor[1],
                    tempB = RGBColor[2];
                return '' + this.calHexValue(tempR) + this.calHexValue(tempG) + this.calHexValue(tempB);
            },
            // 计算RGB数值 #
            calRGBValue: function (hexVal) {
                var result = this.getHexIndex(hexVal.charAt(0)) * 16 + this.getHexIndex(hexVal.charAt(1));
                return result > 10 ? result : '0' + result;
            },
            // 根据位置获得16进制数 #
            getHexValue: function (index) {
                return this.hexColorStr.charAt(index);
            },
            // 把RGB其中一项转化成16进制数 #
            calHexValue: function (val) {
                return this.getHexValue(this.getInt16(val)) + this.getHexValue(this.getRem16(val));
            },
            //获得数字对应的16进制数列表的位置 #
            getHexIndex: function (value) {
                return this.hexColorStr.indexOf(value);
            },
            // 取整 #
            getInt16: function (num) {
                return Math.floor(num / 16);
            },
            // 取余 #
            getRem16: function (num) {
                return num % 16;
            },
            //正则匹配RGB颜色值 #
            /**
             *
             * @param str rgb(n,n,n)
             * @returns {Array} [n,n,n]
             */
            RGBReg: function (str) {
                return str.match(/\d+/g);
            },
            HexReg: function (str) {
                return str.match(/\w+/g);
            },
            //对象转化为数组 #
            ObjToArr: function (obj) {
                var tempArr = [];
                for (var item in obj) {
                    tempArr.push(obj[item]);
                }
                return tempArr;
            }
        },
        // computed: {
        //     getRColor: function () {
        //         return this.getRGBColor(this.newColor)[0];
        //     },
        //     getGColor: function () {
        //         return this.getRGBColor(this.newColor)[1];
        //     },
        //     getBColor: function () {
        //         return this.getRGBColor(this.newColor)[2];
        //     }
        // }
    });

    // 重复字符串 #
    String.prototype.repeat = function (n) {
        var result = '';
        for (var i = 0; i < n; i++) {
            result += this;
        }
        return result;
    };


});