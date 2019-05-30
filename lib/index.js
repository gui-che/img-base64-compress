"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import EXIF from "exif-js";
var ImgBase64Compress =
/*#__PURE__*/
function () {
  function ImgBase64Compress() {
    var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, ImgBase64Compress);

    this.props = props;
    this.init();
  }

  _createClass(ImgBase64Compress, [{
    key: "init",
    value: function init() {
      var _this = this;

      var imgSrc = this.props.imgSrc;
      var img = new Image();

      if (!imgSrc) {
        throw new Error("require imgSrc");
      }

      img.onload = function () {
        _this.beforeCompress(img);
      };

      img.src = imgSrc;
    }
  }, {
    key: "beforeCompress",
    value: function beforeCompress(img) {
      var _this$props$callback = this.props.callback,
          callback = _this$props$callback === void 0 ? function () {} : _this$props$callback; // const systems = ["ios", "ipad"];
      // if (!system) {
      //   throw new Error("require system, system maybe one of ios/android/ipad");
      // }
      // let self = this;
      // // 判断IOS下使用拍照功能是否需要旋转
      // if (systems.includes(system)) {
      //   EXIF.getData(img, function() {
      //     let orientation = EXIF.getTag(this, "Orientation");
      //     const returnData = self.compressing(img);
      //     callback(returnData);
      //   });
      //   return;
      // }

      var returnData = this.compressing(img);
      callback(returnData);
    }
  }, {
    key: "compressing",
    value: function compressing(img) {
      var canvas = this.props.canvas;

      if (!canvas) {
        throw new Error("require canvas");
      } //res代表上传的图片，fileSize大小图片的大小
      // let canvas = document.createElement("canvas");


      var ctx = canvas.getContext("2d");
      var width = img.width,
          height = img.height,
          degreeCount = 0,
          x = 0,
          y = 0; // 只有当图片格式为jpeg格式时，orientation才有值
      // orientation＝1的情况图片是正的，不用处理

      if (orientation && orientation != 1) {
        switch (orientation) {
          case 6:
            width = img.height;
            height = img.width;
            x = 0;
            y = -width;
            degreeCount = 1;
            break;

          case 3:
            x = -img.width;
            y = -img.height;
            degreeCount = 2;
            break;

          case 8:
            width = img.height;
            height = img.width;
            x = -height;
            y = 0;
            degreeCount = 3;
            break;
        }
      }

      var initSize = img.src.length,
          twoHundred = 266763 * 2,
          scale = 0.1,
          // 判断是否进行长宽缩放处理
      isScale = width > 2000 || height > 2000 || initSize * scale > twoHundred; // 进行长宽缩放

      if (isScale) {
        scale = twoHundred / initSize; //width = width * scale;
        //height = height * scale;
      } // 若图片平身就小于50K缩放0.2了，若图片*0.1小于50K则压缩0.5


      var fifty = 66690;

      if (initSize < fifty) {
        scale = 0.2;
      } else if (initSize * 0.1 < fifty) {
        scale = 0.5;
      }

      if (isScale) {
        width = width * scale;
        height = height * scale;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degreeCount * 90 * Math.PI / 180);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      if (isScale) {
        ctx.scale(scale, scale); // 若是拍照的大图，先用长宽压缩，再用canvas.toDataURL压缩

        scale = 0.5;
      } // drawImage在IOS7上的兼容问题处理
      // if (/ipad|iphone os 7/i.test(navigator.userAgent)) {
      //   this._drawImageIOSFix(ctx, img, x, y);
      // } else {
      // }


      ctx.drawImage(img, x, y); // 压缩

      var base64data = canvas.toDataURL("image/jpeg", scale);
      ctx = null;
      return base64data;
    } // _detectVerticalSquash(img) {
    //   let iw = img.naturalWidth,
    //     ih = img.naturalHeight;
    //   let canvas = document.createElement("canvas");
    //   canvas.width = 1;
    //   canvas.height = ih;
    //   let ctx = canvas.getContext("2d");
    //   ctx.drawImage(img, 0, 0);
    //   let data = ctx.getImageData(0, 0, 1, ih).data;
    //   // search image edge pixel position in case it is squashed vertically.
    //   let sy = 0;
    //   let ey = ih;
    //   let py = ih;
    //   while (py > sy) {
    //     let alpha = data[(py - 1) * 4 + 3];
    //     if (alpha === 0) {
    //       ey = py;
    //     } else {
    //       sy = py;
    //     }
    //     py = (ey + sy) >> 1;
    //   }
    //   let ratio = py / ih;
    //   return ratio === 0 ? 1 : ratio;
    // }
    // _drawImageIOSFix(ctx, img, sx, sy) {
    //   let vertSquashRatio = this._detectVerticalSquash(img);
    //   ctx.drawImage(img, sx, sy, img.width, img.height / vertSquashRatio);
    // }

  }]);

  return ImgBase64Compress;
}();