!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.hermimg=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//name: Hermite resize
//about: Fast image resize/resample using Hermite filter with JavaScript.
//author: ViliusL
//demo: http://viliusle.github.io/miniPaint/
function resample(canvas, width, height) {
  var W = canvas.width;
  var H = canvas.height;
  var time1 = Date.now();
  width = Math.round(width);
  height = Math.round(height);
  var img = canvas.getContext("2d").getImageData(0, 0, W, H);
  var img2 = canvas.getContext("2d").getImageData(0, 0, width, height);
  var data = img.data;
  var data2 = img2.data;
  var ratio_w = W / width;
  var ratio_h = H / height;
  var ratio_w_half = Math.ceil(ratio_w/2);
  var ratio_h_half = Math.ceil(ratio_h/2);

  for(var j = 0; j < height; j++){
    for(var i = 0; i < width; i++){
      var x2 = (i + j*width) * 4;
      var weight = 0;
      var weights = 0;
      var weights_alpha = 0;
      var gx_r = 0, gx_g = 0, gx_b = 0, gx_a = 0;
      var center_y = (j + 0.5) * ratio_h;
      for(var yy = Math.floor(j * ratio_h); yy < (j + 1) * ratio_h; yy++){
        var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
        var center_x = (i + 0.5) * ratio_w;
        var w0 = dy*dy //pre-calc part of w
        for(var xx = Math.floor(i * ratio_w); xx < (i + 1) * ratio_w; xx++){
          var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
          var w = Math.sqrt(w0 + dx*dx);
          if(w >= -1 && w <= 1){
            //hermite filter
            weight = 2 * w*w*w - 3*w*w + 1;
            if(weight > 0){
              dx = 4*(xx + yy*W);
              //alpha
              gx_a += weight * data[dx + 3];
              weights_alpha += weight;
              //colors
              if(data[dx + 3] < 255)
                weight = weight * data[dx + 3] / 250;
              gx_r += weight * data[dx];
              gx_g += weight * data[dx + 1];
              gx_b += weight * data[dx + 2];
              weights += weight;
            }
          }
        }
      }
      data2[x2]     = gx_r / weights;
      data2[x2 + 1] = gx_g / weights;
      data2[x2 + 2] = gx_b / weights;
      data2[x2 + 3] = gx_a / weights_alpha;
    }
  }

  return img2;
}

function resizeTo(canvas, width, height){
  var resampled = resample(canvas, width, height);
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").putImageData(resampled, 0, 0);
}

function resizeWidth(canvas, width) {
  return resizeTo(canvas, width, canvas.height * (width / canvas.width));
}

function scale(canvas, wScale, hScale) {
  hScale = hScale || wScale;
  return resizeTo(canvas, canvas.width * wScale, canvas.height * hScale);
}

module.exports = {
  resample: resample,
  resizeTo: resizeTo,
  resizeWidth: resizeWidth,
  scale: scale
};

},{}]},{},[1])(1)
});