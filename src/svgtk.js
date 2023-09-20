//
// svgtk
//
// Copyright (c) 2023 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

'use strict'

export var svgtk = function() {

  var extend = function(o) {
    for (var i = 1; i < arguments.length; i += 1) {
      var a = arguments[i];
      for (var k in a) {
        o[k] = a[k];
      }
    }
    return o;
  };

  var eventTarget = function() {
    var listenersMap = null;
    return {
      trigger: function(type, detail) {
        if (!listenersMap) return;
        var listeners = listenersMap[type];
        if (!listeners) return;
        var event = { type : type };
        listeners.forEach(function(l) {
          l(event, detail);
        });
      },
      on: function(type, l) {
        listenersMap = (listenersMap || (listenersMap = {}) );
        (listenersMap[type] || (listenersMap[type] = []) ).push(l);
      },
      off: function(type, l) {
        if (!listenersMap) return;
        var listeners = listenersMap[type];
        if (!listeners) return;
        listenersMap[type] = listeners.filter(function(_l) {
          return _l != l;
        });
      }
    };
  };

  var domWrapper = function() {

    var svgTagNames = {};
    'svg g path rect circle text'.split(/\s+/g).forEach(function(tagName) {
      svgTagNames[tagName] = true;
    });

    return function(elm) {
      if (typeof elm == 'string') {
        //elm = elm.toLowerCase();
        elm = svgTagNames[elm]?
            document.createElementNS('http://www.w3.org/2000/svg', elm) :
              document.createElement(elm);
      }
      return {
        $el: elm,
        on: function(type, l) {
          this.$el.addEventListener(type, l);
          return this;
        },
        off: function(type, l) {
          this.$el.removeEventListener(type, l);
          return this;
        },
        attrs: function(params) {
          for (var k in params) {
            this.$el.setAttribute(k, '' + params[k]);
          }
          return this
        },
        props: function(params) {
          for (var k in params) {
            this.$el[k] = params[k];
          }
          return this
        },
        style: function(params) {
          for (var k in params) {
            this.$el.style[k] = '' + params[k];
          }
          return this
        },
        append: function($elm) {
          this.$el.appendChild($elm.$el);
          return this;
        },
        remove: function($elm) {
          this.$el.removeChild($elm.$el);
          return this;
        }
      };
    };
  }();

  var pathBuilder = function() {
    var d = '';
    return {
      moveTo : function(x, y) { d += 'M' + x + ' ' + y; return this; },
      lineTo : function(x, y) { d += 'L' + x + ' ' + y; return this; },
      quadTo : function(cx, cy, x, y) {
        d += 'Q' + cx + ' ' + cy +' ' + x + ' ' + y; return this; },
      cubicTo : function(cx1, cy1, cx2, cy2, x, y) {
        d += 'C' + cx1 + ' ' + cy1 +' ' + cx2 + ' ' + cy2 +' ' +
          x + ' ' + y; return this; },
      close : function() { d += 'Z'; return this; },
      build : function() { return d; }
    };
  };

  var r2d = function(rad) { return rad * 180 / Math.PI; };

  var tranBuilder = function() {
    var t = '';
    return {
      translate : function(x, y) {
        t += 'translate(' + x + ' ' + y + ')'; return this; },
      rotate : function(rad) { t += 'rotate(' + r2d(rad) + ')'; return this; },
      scale : function(x, y) {
        t += 'scale(' + x + ' ' + y + ')'; return this; },
      skewX : function(rad) {
        t += 'skewX(' + r2d(rad) + ')'; return this; },
      skewY : function(rad) {
        t += 'skewY(' + r2d(rad) + ')'; return this; },
      build : function() { return t; }
    };
  };

  var mat4 = function() {
    var fn = {
      concat : function(n) {
        var o = [];
        o.length = 16;
        for (var i = 0; i < o.length; i += 1) {
          var v = 0;
          for (var j = 0; j < 4; j += 1) {
            v += this[~~(i / 4) * 4 + j] * n[i % 4 + j * 4];
          }
          o[i] = v;
        }
        return mat4(o);
      },
      transform : function(n) {
        var o = [];
        o.length = n.length;
        for (var i = 0; i < o.length; i += 1) {
          var v = 0;
          for (var j = 0; j < n.length; j += 1) {
            v += this[j * 4 + i] * n[j];
          }
          o[i] = v;
        }
        return o;
      },
      translateX : function(t) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           t, 0, 0, 1 ]);
      },
      translateY : function(t) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, t, 0, 1 ]);
      },
      translateZ : function(t) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, t, 1 ]);
      },
      scaleX : function(s) {
        return this.concat([
                           s, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1 ]);
      },
      scaleY : function(s) {
        return this.concat([
                           1, 0, 0, 0,
                           0, s, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1 ]);
      },
      scaleZ : function(s) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, s, 0,
                           0, 0, 0, 1 ]);
      },
      rotateX : function(r) {
        var c = Math.cos(r);
        var s = Math.sin(r);
        return this.concat([
                           1, 0, 0, 0,
                           0, c, s, 0,
                           0,-s, c, 0,
                           0, 0, 0, 1 ]);
      },
      rotateY : function(r) {
        var c = Math.cos(r);
        var s = Math.sin(r);
        return this.concat([
                           c, 0,-s, 0,
                           0, 1, 0, 0,
                           s, 0, c, 0,
                           0, 0, 0, 1 ]);
      },
      rotateZ : function(r) {
        var c = Math.cos(r);
        var s = Math.sin(r);
        return this.concat([
                           c, s, 0, 0,
                          -s, c, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1 ]);
      },
      translate : function(t) {
        return this
          .translateX(t.x || 0)
          .translateY(t.y || 0)
          .translateZ(t.z || 0);
      },
      scale : function(s) {
        if (typeof s == 'number') {
          return this.scale({ x: s, y: s, z: s });
        }
        return this
          .scaleX(s.x || 1)
          .scaleY(s.y || 1)
          .scaleZ(s.z || 1);
      }
    };
  
    fn.__proto__ = [].__proto__;
  
    var identity = function() {
      return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    };
  
    return function(m) {
      m = m || identity();
      m.__proto__ = fn;
      return m;
    };
  }();

  var inv = function(m) {
    var det = m[0] * m[3] - m[1] * m[2];
    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det];
  };

  var getCrossPoint = function(a, va, b, vb) {
    var m = inv([va[0], -vb[0], va[1], -vb[1]]);
    var v = [b[0] - a[0], b[1] - a[1]];
    //var st = [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
    //return [a[0] + va[0] * st[0], a[1] + va[1] * st[0]];
    var s = m[0] * v[0] + m[1] * v[1];
    return [a[0] + va[0] * s, a[1] + va[1] * s];
  };

  var getQuadPoints = function(opts) {

    opts = extend({
      fn : function(t) { return [t, t] },
      min : 0, max : 1, n : 10, dt : 0.1
    }, opts);

    // delta points
    var points = [];
    !function() {
      for (var i = 0; i <= opts.n; i += 1) {
        var t = (opts.max - opts.min) * i / opts.n + opts.min;
        points.push([opts.fn(t), opts.fn(t + opts.dt)]);
      }
    }();

    var quadPoints = [];
    !function() {
      for (var i = 0; i < opts.n; i += 1) {
        var z = getCrossPoint(
          [points[i][0][0],
           points[i][0][1]],
          [points[i][1][0] - points[i][0][0],
           points[i][1][1] - points[i][0][1]],
          [points[i + 1][0][0],
           points[i + 1][0][1]],
          [points[i + 1][1][0] - points[i + 1][0][0],
           points[i + 1][1][1] - points[i + 1][0][1]]
        );
        if (i == 0) {
          quadPoints.push([points[i][0][0], points[i][0][1]]);
          
        }
        if (isNaN(z[0]) ) {
          z = points[i][0];
        }
        quadPoints.push([z[0], z[1], points[i + 1][0][0], points[i + 1][0][1]]);
      }
    }();
    quadPoints.points = points;
    return quadPoints;
  };

  return {
    extend : extend,
    eventTarget : eventTarget,
    domWrapper : domWrapper,
    pathBuilder : pathBuilder,
    tranBuilder : tranBuilder,
    math : {
      mat4 : mat4,
      getCrossPoint : getCrossPoint,
      getQuadPoints : getQuadPoints
    }
  };
}();
