
'use strict'

import { svgtk } from '../src/svgtk.js';
import { gearUtil } from '../src/gear-util.js';

window.addEventListener('load', function() {

  var $ = svgtk.domWrapper;
  var $pb = svgtk.pathBuilder;
  var $tb = svgtk.tranBuilder;
  var $math = svgtk.math;

  var drawDebugPoints = function($s, d) {
    var points = d.points;
    var n = points.length - 1;
    !function() {
      for (var i = 0; i < n; i += 1) {
        var z = $math.getCrossPoint(
          [points[i][0][0],
           points[i][0][1]],
          [points[i][1][0] - points[i][0][0],
           points[i][1][1] - points[i][0][1]],
          [points[i + 1][0][0],
           points[i + 1][0][1]],
          [points[i + 1][1][0] - points[i + 1][0][0],
           points[i + 1][1][1] - points[i + 1][0][1]]
        );
        var $cz = $('circle').attrs({ cx : z[0], cy : z[1],
          r : 4, fill : 'none', stroke : sc1 });
        $s.append($cz);
      }
    }();
    !function() {
      for (var i = 0; i <= n; i += 1) {
        var $cz1 = $('circle').attrs({
          cx : points[i][0][0], cy : points[i][0][1],
          r : 4, fill : sc1, stroke : 'none' });
        $s.append($cz1);
        var $cz2 = $('circle').attrs({
          cx : points[i][1][0], cy : points[i][1][1],
          r : 2, fill : 'none', stroke : sc1 });
        $s.append($cz2);
      }
    }();
  };

  var createStage = function(width, height) {
    var $svg = $('svg').attrs({ width: width, height: height,
      style: 'user-select: none;' });
    $svg.append($('rect').attrs({
      x: 0, y: 0, width: width, height: height,
      fill: '#fcfcfc', stroke: '#666' }) );
    /*
    $svg.append($('path').attrs({
      d: $pb().moveTo(0, 0).lineTo(width, height).build(),
      fill: 'none', stroke: '#ccc' }) );
    $svg.append($('path').attrs({
      d: $pb().moveTo(0, height).lineTo(width, 0).build(),
      fill: 'none', stroke: '#ccc' }) );
    */
    return $svg;
  };

  var createPoint = function(opts) {

    opts = svgtk.extend({ x : 0, y : 0, r : 4,
      color : '#000', label : '', fontSize : 16 }, opts);

    var $p = $('g').append($('circle').attrs({
        r: opts.r, fill: opts.color, stroke: 'none' }) );

    if (opts.label) {
      var $label = $('text').attrs({
          x: opts.r + 4,
          y: opts.r + opts.fontSize - 4,
          fill: '#000', stroke: 'none',
          'font-size': opts.fontSize,
          'font-family': 'sans-serif',
          'pointer-events': 'none'
        });
      $label.$el.textContent = opts.label;
      $p.append($label);
    }

    $p.on('mousedown', function(event) {
      var mousemoveHandler = function(event) {
        model.setLocation(event.pageX - dragPoint.x, event.pageY - dragPoint.y);
        model.trigger('move');
      };
      var mouseupHandler = function(event) {
        $(document).off('mousemove', mousemoveHandler); 
        $(document).off('mouseup', mouseupHandler); 
      };
      var dragPoint = { x: event.pageX - model.x, y: event.pageY - model.y };
      $(document).on('mousemove', mousemoveHandler); 
      $(document).on('mouseup', mouseupHandler); 
    });

    var model = svgtk.extend(svgtk.eventTarget(),
      {
        x : 0,
        y : 0,
        setLocation : function(x, y) {
          this.x = x;
          this.y = y;
          $p.attrs({ transform :
            'translate(' + this.x + ' ' + this.y + ')' });
        }
      }
    );
    model.setLocation(opts.x, opts.y);

    return svgtk.extend($p, { model : model });
  };

  var sc1 = '#f00';
  var sc2 = '#00f';

  !function() {
    var $s = createStage(200, 200);
    var $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    var moveHandler = function() {
      var p1 = $p1.model;
      var p2 = $p2.model;
      $path.attrs({ d: $pb().moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).build() });
    };
    var appendPoint = function(opts) {
      var $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    var $p1 = appendPoint({ x : 30, y : 30, label : 'A' });
    var $p2 = appendPoint({ x : 150, y : 120, label : 'B' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {
    var $s = createStage(200, 200);
    var $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    var moveHandler = function() {
      var p1 = $p1.model;
      var p2 = $p2.model;
      var p3 = $p3.model;
      $path.attrs({ d: $pb().moveTo(p1.x, p1.y).
        lineTo(p3.x, p3.y).lineTo(p2.x, p2.y).build() });
    };
    var appendPoint = function(opts) {
      var $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    var $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    var $p2 = appendPoint({ x : 170, y : 100, label : 'B' });
    var $p3 = appendPoint({ x : 100, y : 30, label : 'C' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {
    var $s = createStage(200, 200);
    var $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    var $pathf = $('path').attrs({ fill : sc1, stroke : 'none',
      opacity : 0.1 });
    $s.append($pathf);
    var moveHandler = function() {
      var p1 = $p1.model;
      var p2 = $p2.model;
      var p3 = $p3.model;
      var d = $pb().moveTo(p1.x, p1.y).
        lineTo(p3.x, p3.y).lineTo(p2.x, p2.y).close().build();
      $path.attrs({ d : d });
      $pathf.attrs({ d : d });
    };
    var appendPoint = function(opts) {
      var $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    var $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    var $p2 = appendPoint({ x : 170, y : 100, label : 'B' });
    var $p3 = appendPoint({ x : 100, y : 30, label : 'C' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {

    var quad = function(p0, p1, p2, t) {
      return {
        x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
        y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
      };
    };

    var $s = createStage(200, 200);
    var $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    var $cpath = $('path').attrs({ fill : 'none', stroke : sc2 });
    $s.append($cpath);

    var d = 4;
    var ps = [];
    !function() {
      for (var i = 1; i < d; i += 1) {
        var $ps = $('circle').attrs({ r : 4, fill : sc1, stroke : 'none' });
        $s.append($ps);
        ps.push($ps);
      }
    }();

    var moveHandler = function() {
      var p1 = $p1.model;
      var p2 = $p2.model;
      var p3 = $p3.model;
      $path.attrs({ d: $pb().moveTo(p1.x, p1.y).
        lineTo(p2.x, p2.y).lineTo(p3.x, p3.y).build() });
      $cpath.attrs({ d: $pb().moveTo(p1.x, p1.y).
        quadTo(p2.x, p2.y, p3.x, p3.y).build() });
      for (var i = 1; i < d; i += 1) {
        var p = quad(p1, p2, p3, i / d);
        ps[i - 1].attrs({ cx: p.x, cy: p.y });
      }
    };
    var appendPoint = function(opts) {
      var $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    var $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    var $p2 = appendPoint({ x : 100, y : 30, label : 'c', color : sc1 });
    var $p3 = appendPoint({ x : 170, y : 100, label : 'B' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {

    var cubic = function(p0, p1, p2, p3, t) {
      return {
        x: (1 - t) * (1 - t) * (1 - t) * p0.x +
            3 * (1 - t) * (1 - t) * t * p1.x +
            3 * (1 - t) * t * t * p2.x + t * t * t * p3.x,
        y: (1 - t) * (1 - t) * (1 - t) * p0.y +
            3 * (1 - t) * (1 - t) * t * p1.y +
            3 * (1 - t) * t * t * p2.y + t * t * t * p3.y
      };
    };

    var $s = createStage(200, 200);
    var $path1 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path1);
    var $path2 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path2);
    var $cpath = $('path').attrs({ fill : 'none', stroke : sc2 });
    $s.append($cpath);

    var d = 4;
    var ps = [];
    !function() {
      for (var i = 1; i < d; i += 1) {
        var $ps = $('circle').attrs({ r : 4, fill : sc1, stroke : 'none' });
        $s.append($ps);
        ps.push($ps);
      }
    }();

    var moveHandler = function() {
      var p1 = $p1.model;
      var p2 = $p2.model;
      var p3 = $p3.model;
      var p4 = $p4.model;
      $path1.attrs({ d: $pb().moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).build() });
      $path2.attrs({ d: $pb().moveTo(p3.x, p3.y).lineTo(p4.x, p4.y).build() });
      $cpath.attrs({ d: $pb().moveTo(p1.x, p1.y).
        cubicTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y).build() });
      for (var i = 1; i < d; i += 1) {
        var p = cubic(p1, p2, p3, p4, i / d);
        ps[i - 1].attrs({ cx: p.x, cy: p.y });
      }
    };
    var appendPoint = function(opts) {
      var $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    var $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    var $p2 = appendPoint({ x : 70, y : 30, label : 'c1', color : sc1 });
    var $p3 = appendPoint({ x : 150, y : 40, label : 'c2', color : sc1 });
    var $p4 = appendPoint({ x : 170, y : 100, label : 'B' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {
    var $s = createStage(200, 200);
    var $path1 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path1);
    var $path2 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path2);
    var $cpath = $('path').attrs({ fill : 'none', stroke : sc2 });
    $s.append($cpath);
    var $cz = $('circle').attrs({ r : 4, fill : 'none', stroke : sc1 });
    $s.append($cz);
    var moveHandler = function() {
      var p1 = $p1.model;
      var p2 = $p2.model;
      var p3 = $p3.model;
      var p4 = $p4.model;
      var p21 = [p2.x - p1.x, p2.y - p1.y];
      var p43 = [p4.x - p3.x, p4.y - p3.y];
      var p5 = $math.getCrossPoint([p1.x, p1.y], p21, [p3.x, p3.y], p43);
      $cz.attrs({ cx : p5[0], cy : p5[1] });
      $path1.attrs({ d: $pb().moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).build() });
      $path2.attrs({ d: $pb().moveTo(p3.x, p3.y).lineTo(p4.x, p4.y).build() });
      $cpath.attrs({ d: $pb().moveTo(p1.x, p1.y).
        quadTo(p5[0], p5[1], p3.x, p3.y).build() });
    };
    var appendPoint = function(opts) {
      var $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    var $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    var $p2 = appendPoint({ x : 40, y : 160, label : 'A\'', color : sc1 });
    var $p3 = appendPoint({ x : 160, y : 100, label : 'B' });
    var $p4 = appendPoint({ x : 170, y : 102, label : 'B\'', color : sc1 });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {

    var $s = createStage(600, 300);

    var n = 8;
    var a = 100;

    var fn = function(t) {
      return [50 + 500 * t / (Math.PI * 2), -a * Math.sin(t) + 150];
    };

    var $path = $('path').attrs({
      d : $pb().moveTo(10, 150).lineTo(590, 150).build(),
      fill : 'none', stroke : sc1 });
    $s.append($path);

    !function() {
      var d = $math.getQuadPoints({ fn : fn,
        min : 0, max : Math.PI * 2, n : n, dt : 0.1 });
      drawDebugPoints($s, d);
      var pb = $pb();
      for (var i = 0; i < d.length; i += 1) {
        if (i == 0) {
          pb.moveTo(d[i][0], d[i][1]);
        } else {
          pb.quadTo(d[i][0], d[i][1], d[i][2], d[i][3]);
        }
      }
      var $path = $('path').attrs({
        d : pb.build(), fill : 'none', stroke : sc2 });
      $s.append($path);
    }();

    $(document.body).append($s);
  }();

  !function() {

    var w = 600;
    var h = 400;
    var $s = createStage(w, h);
    var $base = $('g').attrs({
      transform : $tb().translate(w / 2 - 190, h / 2 - 150).build() });
    $s.append($base);

    var drawPie = function(opts) {
      opts = svgtk.extend({
        r1 : 100, r2 : 200, r3 : 10, r4 : 10,
        w : 10, a : Math.PI / 4
      }, opts);
      var $tmp = $('g').attrs({ fill : 'none',
        stroke : '#000', 'stroke-width' : '0.5' });
      $base.append($tmp);

      var l = function(a) {
        var rx = opts.r2 * Math.cos(a);
        var ry = opts.r2 * Math.sin(a);
        var wx = opts.w / 2 * Math.cos(a + Math.PI / 2);
        var wy = opts.w / 2 * Math.sin(a + Math.PI / 2);
        $tmp.append($('path').attrs({ d :
          $pb().moveTo(0, 0).lineTo(rx, ry).build() }) );
        $tmp.append($('path').attrs({ d :
          $pb().moveTo(-wx, -wy).lineTo(rx - wx, ry - wy).build() }) );
        $tmp.append($('path').attrs({ d :
          $pb().moveTo(wx, wy).lineTo(rx + wx, ry + wy).build() }) );
      };
      l(0);
      l(opts.a);

      var arcs = [];

      !function() {
        var a = Math.asin( (opts.w / 2 + opts.r3) / (opts.r1 + opts.r3) );
        var x = opts.r1 * Math.cos(a);
        var y = opts.r1 * Math.sin(a);
        var t = Math.atan2(y, x);
        arcs.push({ order : 0, cx : 0, cy : 0,
          r : opts.r1, t0 : opts.a - t, t1 : t });
      }();

      !function() {
        var dt;
        !function(a) {
          var x = opts.r1 * Math.cos(a);
          var y = opts.r1 * Math.sin(a);
          var cx = (opts.r1 + opts.r3) * Math.cos(a);
          var cy = (opts.r1 + opts.r3) * Math.sin(a);
          var t0 = Math.atan2(y - cy, x - cx);
          var t1 = Math.atan2(opts.w / 2 - cy, 0);
          arcs.push({ order : 1, cx : cx, cy : cy,
            r : opts.r3, t0 : t0, t1 : t1 });
          dt = t1 - t0;
        }(Math.asin( (opts.w / 2 + opts.r3) / (opts.r1 + opts.r3) ) );
        !function(a) {
          var x = opts.r1 * Math.cos(a);
          var y = opts.r1 * Math.sin(a);
          var cx = (opts.r1 + opts.r3) * Math.cos(a);
          var cy = (opts.r1 + opts.r3) * Math.sin(a);
          var t0 = Math.atan2(y - cy, x - cx);
          var t1 = t0 - dt;
          arcs.push({ order : 5, cx : cx, cy : cy,
            r : opts.r3, t0 : t1, t1 : t0 });
        }(opts.a - Math.asin( (opts.w / 2 + opts.r3) / (opts.r1 + opts.r3) ) );
      }();

      !function() {
        var a = Math.asin( (opts.w / 2 + opts.r4) / (opts.r2 - opts.r4) );
        var x = opts.r2 * Math.cos(a);
        var y = opts.r2 * Math.sin(a);
        var t = Math.atan2(y, x);
        arcs.push({ order : 3, cx : 0, cy : 0,
          r : opts.r2, t0 : t, t1 : opts.a - t });
      }();

      !function() {
        var dt;
        !function(a) {
          var x = opts.r2 * Math.cos(a);
          var y = opts.r2 * Math.sin(a);
          var cx = (opts.r2 - opts.r4) * Math.cos(a);
          var cy = (opts.r2 - opts.r4) * Math.sin(a);
          var t0 = Math.atan2(opts.w / 2 - cy, 0);
          var t1 = Math.atan2(y - cy, x - cx);
          arcs.push({ order : 2, cx : cx, cy : cy,
            r : opts.r4, t0 : t0, t1 : t1 });
          dt = t1 - t0;
        }(Math.asin( (opts.w / 2 + opts.r4) / (opts.r2 - opts.r4) ) );
        !function(a) {
          var x = opts.r2 * Math.cos(a);
          var y = opts.r2 * Math.sin(a);
          var cx = (opts.r2 - opts.r4) * Math.cos(a);
          var cy = (opts.r2 - opts.r4) * Math.sin(a);
          var t1 = Math.atan2(y - cy, x - cx);
          var t0 = t1 + dt;
          arcs.push({ order : 4, cx : cx, cy : cy,
            r : opts.r4, t0 : t1, t1 : t0 });
        }(opts.a - Math.asin( (opts.w / 2 + opts.r4) / (opts.r2 - opts.r4) ) );
      }();

      arcs.sort(function(a1, a2) {
        return a1.order < a2.order ? -1 : 1;
      });

      !function() {
        var tr1 = 8;
        var tr2 = 5;
        arcs.forEach(function(arc, i) {
          var color = sc1;
          $tmp.append($('path').attrs({ d :
            $pb().moveTo(arc.cx, arc.cy).lineTo(
              arc.cx + arc.r * Math.cos(arc.t0) ,
              arc.cy + arc.r * Math.sin(arc.t0) ).build() }) );
          $tmp.append($('path').attrs({ d :
            $pb().moveTo(arc.cx, arc.cy).lineTo(
              arc.cx + arc.r * Math.cos(arc.t1) ,
              arc.cy + arc.r * Math.sin(arc.t1) ).build() }) );
          $tmp.append($('circle').attrs({
            cx : arc.cx, cy : arc.cy, r : arc.r }) );
          $tmp.append($('circle').attrs({
            cx : arc.cx + arc.r * Math.cos(arc.t0),
            cy : arc.cy + arc.r * Math.sin(arc.t0), r : tr1,
            fill : 'none', stroke : color }) );
          $tmp.append($('circle').attrs({
            cx : arc.cx + arc.r * Math.cos(arc.t1),
            cy : arc.cy + arc.r * Math.sin(arc.t1), r : tr2,
            fill : color, stroke : 'none' }) );
        });
      }();

      !function() {
        var pb = $pb();
        arcs.forEach(function(arc) {
          var fn =function(t) {
            return [
              arc.r * Math.cos(t) + arc.cx,
              arc.r * Math.sin(t) + arc.cy
            ];
          };
          var d = $math.getQuadPoints({ fn : fn,
            min : arc.t0, max : arc.t1, n : 4, dt : 0.05 });
          for (var i = 0; i < d.length; i += 1) {
            if (i == 0) {
              if (arc.order == 0) {
                pb.moveTo(d[i][0], d[i][1]);
              } else if (arc.order == 2) {
                pb.lineTo(d[i][0], d[i][1]);
              } else if (arc.order == 5) {
                pb.lineTo(d[i][0], d[i][1]);
              }
            } else {
              pb.quadTo(d[i][0], d[i][1], d[i][2], d[i][3]);
            }
          }
        });
        pb.close();
        var $path = $('path').attrs({
          d : pb.build(), fill : 'none', stroke : sc2 });
        $base.append($path);
      }();
    };

    drawPie({
      r1 : 200, r2 : 420, r3 : 40, r4 : 60,
      w : 80, a : Math.PI / 3
    });

    $(document.body).append($s);
  }();

  !function() {

    var w = 600;
    var h = 400;
    var $s = createStage(w, h);
    var $base = $('g').attrs({
      transform : $tb().translate(w / 2, h / 2).build() });
    $s.append($base);

    var n = 15;
    var r = 25;
    var tMin = Math.PI * 2 * 0;
    var tMax = Math.PI * 2 * 1.25;

    var t0 = 0;

    var fn = function(t) {
      var x = r * Math.cos(t + t0) + r * t * Math.sin(t + t0);
      var y = r * Math.sin(t + t0) - r * t * Math.cos(t + t0);
      return [x, y];
    };

    var fn0 = function(t) {
      var x = r * Math.cos(t + t0);
      var y = r * Math.sin(t + t0);
      var ix = r * t * Math.sin(t + t0);
      var iy = -r * t * Math.cos(t + t0);
      return [x, y, ix, iy];
    };

    var $c = $('circle').attrs({ r : r, fill : 'none', stroke : sc1 });
    $base.append($c);

    !function() {
      for (var i = 0; i <= n; i += 1) {
        var t = tMin + (tMax - tMin) * i / n;
        var p = fn0(t);
        var $path = $('path').attrs({
          d : $pb().moveTo(0, 0).lineTo(p[0], p[1]).
              lineTo(p[0] + p[2], p[1] + p[3]).build(),
          fill : 'none', stroke : '#ccc'/*i % 2 == 0? '#6c6' : '#c96'*/ });
        $base.append($path);
      }
    }();

    !function() {
      var d = $math.getQuadPoints({ fn : fn,
        min : tMin, max : tMax, n : n, dt : 0.05 });
      drawDebugPoints($base, d);
      var pb = $pb();
      for (var i = 0; i < d.length; i += 1) {
        if (i == 0) {
          pb.moveTo(d[i][0], d[i][1]);
        } else {
          pb.quadTo(d[i][0], d[i][1], d[i][2], d[i][3]);
        }
      }
      var $path = $('path').attrs({
        d : pb.build(), fill : 'none', stroke : sc2 });
      $base.append($path);
    }();

    $(document.body).append($s);
  }();

  !function() {

    var get_fn0 = function(r, t0) {
      return function(t) {
        return [
          r * Math.cos(t + t0), r * Math.sin(t + t0),
          r * t * Math.sin(t + t0), -r * t * Math.cos(t + t0)
        ];
      };
    };

    var w = 600;
    var h = 400;
    var $s = createStage(w, h);
    var $base = $('g').attrs({
      transform : $tb().translate(w / 2, h / 2).build() });
    $s.append($base);

    var m = 20;
    var gear1 = gearUtil.createGear({ m : m, z : 20 });
    var gear2 = gearUtil.createGear({ m : m, z : 16 });
    var gear3 = gearUtil.createInnerGear({ m : m, z : 48 });

    $base.append($('g').append($('path').attrs({
      d : gear1.path, fill : 'none', stroke : sc2 }) ) );

    $base.append($('g').attrs({ transform : $tb().
        translate( (gear3.d - gear1.d) / 2, 0).
        rotate(Math.PI/gear3.z).build() }).
      append($('path').attrs({
      d : gear3.path, fill : 'none', stroke : '#999' }) ) );

    $base.append($('g').
      attrs({ transform : $tb().translate(
        (gear1.d + gear2.d) / 2, 0).build() }).
      append($('path').attrs({
      d : gear2.path, fill : 'none', stroke : '#999' }) ) );

    var drawDebugInfo = function() {
      $base.append($('circle').attrs({
        r : gear1.r, fill : 'none', stroke : sc1 }) );

      !function() {
        var r = gear1.d2 / 2;
        var n = gear1.z * 2;
        for (var i = 0; i < n; i += 1) {
          var t = Math.PI * 2 * i / n;
          var $c = $('path').attrs({
            d : $pb().moveTo(0, 0).
              lineTo(gear1.r * Math.cos(t), gear1.r * Math.sin(t) ).build(),
            fill : 'none', stroke : '#eee' });
          $base.append($c);
        }
      }();

      $base.append($('circle').attrs({
        r : gear1.d / 2, fill : 'none', stroke : sc2 }) );
      $base.append($('circle').attrs({
        r : gear1.d1 / 2, fill : 'none', stroke : '#ccc' }) );
      $base.append($('circle').attrs({
        r : gear1.d2 / 2, fill : 'none', stroke : '#ccc' }) );

      !function() {
        var n = 3;
        var fn0 = get_fn0(gear1.r, gear1.t0);
        for (var i = 0; i <= n; i += 1) {
          var t = gear1.tMin + (gear1.tMax - gear1.tMin) * i / n;
          var p = fn0(t);
          var $path = $('path').attrs({
            d : $pb().moveTo(0, 0).lineTo(p[0], p[1]).
                lineTo(p[0] + p[2], p[1] + p[3]).build(),
            fill : 'none', stroke : '#ccc'//i % 2 == 0? '#6c6' : '#c96'
             });
          $base.append($path);
        }
      }();
    };

    drawDebugInfo();

    $(document.body).append($s);
  }();

  !function() {

    var w = 600;
    var h = 400;
    var $s = createStage(w, h);
    var $base = $('g').attrs({
      transform : $tb().translate(w / 2, h / 2).build() });
    $s.append($base);

    var m = 6;
    var gear1 = gearUtil.createGear({ m : m, z : 16 });
    var gear2 = gearUtil.createGear({ m : m, z : 22 });
    var gear3 = gearUtil.createInnerGear({ m : m, z : 60 });

    var g1 = $('g').append($('path').attrs({
      d : gear1.path, fill : 'none', stroke : '#666' }) );
    var g2 = [];
    !function() {
      for (var i = 0; i < 4; i += 1) {
        g2.push($('g').append($('path').attrs({
          d : gear2.path, fill : 'none', stroke : '#666' }) ) );
      }
    }();
    var g3 = $('g').append($('path').attrs({
      d : gear3.path, fill : 'none', stroke : '#666' }) );

    $base.append(g1);
    g2.forEach(function(g) {
      $base.append(g);
    });
    $base.append(g3);

    var model = {
      angle : 0
    };
    var update = function() {
      g1.attrs({ transform : $tb().rotate(model.angle).build() });
      g2.forEach(function(g, i) {
        g.attrs({ transform : $tb().
          rotate(Math.PI / 2 * i).
          translate( (gear1.d + gear2.d) / 2, 0).
          rotate(-model.angle * gear1.z / gear2.z).build() });
      });
      g3.attrs({ transform : $tb().
        rotate(Math.PI / gear3.z).
        rotate(-model.angle * gear1.z / gear3.z).build() });
    };

    var enterFrame = function(t) {
      if (typeof t != 'undefined') {
        model.angle = t / 5000;
        update();
      }
      window.requestAnimationFrame(enterFrame);
    };
    enterFrame();

    $(document.body).append($s);
  }();

});
