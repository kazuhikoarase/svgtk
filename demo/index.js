
'use strict'

import { extend, eventTarget } from '../dist/core.mjs';
import { getCrossPoint, getQuadPoints } from '../dist/math.mjs';
import { domWrapper as $, pathBuilder as $pb, tranBuilder as $tb } from '../dist/svgtk.mjs';
import { createGear, createInnerGear, createPie } from '../dist/gear-util.mjs';

window.addEventListener('load', function() {

  const drawDebugPoints = function($s, d) {
    const points = d.points;
    const n = points.length - 1;
    !function() {
      for(let i = 0; i < n; i += 1) {
        const z = getCrossPoint(
          [points[i][0][0],
           points[i][0][1]],
          [points[i][1][0] - points[i][0][0],
           points[i][1][1] - points[i][0][1]],
          [points[i + 1][0][0],
           points[i + 1][0][1]],
          [points[i + 1][1][0] - points[i + 1][0][0],
           points[i + 1][1][1] - points[i + 1][0][1]]
        );
        const $cz = $('circle').attrs({ cx : z[0], cy : z[1],
          r : 4, fill : 'none', stroke : sc1 });
        $s.append($cz);
      }
    }();
    !function() {
      for(let i = 0; i <= n; i += 1) {
        const $cz1 = $('circle').attrs({
          cx : points[i][0][0], cy : points[i][0][1],
          r : 4, fill : sc1, stroke : 'none' });
        $s.append($cz1);
        const $cz2 = $('circle').attrs({
          cx : points[i][1][0], cy : points[i][1][1],
          r : 2, fill : 'none', stroke : sc1 });
        $s.append($cz2);
      }
    }();
  };

  const createStage = function(width, height) {
    const $svg = $('svg').attrs({ width: width, height: height,
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

  const createPoint = function(opts) {

    opts = extend({ x : 0, y : 0, r : 4,
      color : '#000', label : '', fontSize : 16 }, opts);

    const $p = $('g').append($('circle').attrs({
        r: opts.r, fill: opts.color, stroke: 'none' }) );

    if (opts.label) {
      const $label = $('text').attrs({
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
      const mousemoveHandler = function(event) {
        model.setLocation(event.pageX - dragPoint.x, event.pageY - dragPoint.y);
        model.trigger('move');
      };
      const mouseupHandler = function(event) {
        $(document).off('mousemove', mousemoveHandler); 
        $(document).off('mouseup', mouseupHandler); 
      };
      const dragPoint = { x: event.pageX - model.x, y: event.pageY - model.y };
      $(document).on('mousemove', mousemoveHandler); 
      $(document).on('mouseup', mouseupHandler); 
    });

    const model = extend(eventTarget(),
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

    return extend($p, { model : model });
  };

  const sc1 = '#f00';
  const sc2 = '#00f';

  !function() {
    const $s = createStage(200, 200);
    const $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    const moveHandler = function() {
      const p1 = $p1.model;
      const p2 = $p2.model;
      $path.attrs({ d: $pb().moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).build() });
    };
    const appendPoint = function(opts) {
      const $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    const $p1 = appendPoint({ x : 30, y : 30, label : 'A' });
    const $p2 = appendPoint({ x : 150, y : 120, label : 'B' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {
    const $s = createStage(200, 200);
    const $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    const moveHandler = function() {
      const p1 = $p1.model;
      const p2 = $p2.model;
      const p3 = $p3.model;
      $path.attrs({ d: $pb().moveTo(p1.x, p1.y).
        lineTo(p3.x, p3.y).lineTo(p2.x, p2.y).build() });
    };
    const appendPoint = function(opts) {
      const $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    const $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    const $p2 = appendPoint({ x : 170, y : 100, label : 'B' });
    const $p3 = appendPoint({ x : 100, y : 30, label : 'C' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {
    const $s = createStage(200, 200);
    const $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    const $pathf = $('path').attrs({ fill : sc1, stroke : 'none',
      opacity : 0.1 });
    $s.append($pathf);
    const moveHandler = function() {
      const p1 = $p1.model;
      const p2 = $p2.model;
      const p3 = $p3.model;
      const d = $pb().moveTo(p1.x, p1.y).
        lineTo(p3.x, p3.y).lineTo(p2.x, p2.y).close().build();
      $path.attrs({ d : d });
      $pathf.attrs({ d : d });
    };
    const appendPoint = function(opts) {
      const $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    const $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    const $p2 = appendPoint({ x : 170, y : 100, label : 'B' });
    const $p3 = appendPoint({ x : 100, y : 30, label : 'C' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {

    const quad = function(p0, p1, p2, t) {
      return {
        x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x,
        y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
      };
    };

    const $s = createStage(200, 200);
    const $path = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path);
    const $cpath = $('path').attrs({ fill : 'none', stroke : sc2 });
    $s.append($cpath);

    const d = 4;
    const ps = [];
    !function() {
      for(let i = 1; i < d; i += 1) {
        const $ps = $('circle').attrs({ r : 4, fill : sc1, stroke : 'none' });
        $s.append($ps);
        ps.push($ps);
      }
    }();

    const moveHandler = function() {
      const p1 = $p1.model;
      const p2 = $p2.model;
      const p3 = $p3.model;
      $path.attrs({ d: $pb().moveTo(p1.x, p1.y).
        lineTo(p2.x, p2.y).lineTo(p3.x, p3.y).build() });
      $cpath.attrs({ d: $pb().moveTo(p1.x, p1.y).
        quadTo(p2.x, p2.y, p3.x, p3.y).build() });
      for(let i = 1; i < d; i += 1) {
        const p = quad(p1, p2, p3, i / d);
        ps[i - 1].attrs({ cx: p.x, cy: p.y });
      }
    };
    const appendPoint = function(opts) {
      const $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    const $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    const $p2 = appendPoint({ x : 100, y : 30, label : 'c', color : sc1 });
    const $p3 = appendPoint({ x : 170, y : 100, label : 'B' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {

    const cubic = function(p0, p1, p2, p3, t) {
      return {
        x: (1 - t) * (1 - t) * (1 - t) * p0.x +
            3 * (1 - t) * (1 - t) * t * p1.x +
            3 * (1 - t) * t * t * p2.x + t * t * t * p3.x,
        y: (1 - t) * (1 - t) * (1 - t) * p0.y +
            3 * (1 - t) * (1 - t) * t * p1.y +
            3 * (1 - t) * t * t * p2.y + t * t * t * p3.y
      };
    };

    const $s = createStage(200, 200);
    const $path1 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path1);
    const $path2 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path2);
    const $cpath = $('path').attrs({ fill : 'none', stroke : sc2 });
    $s.append($cpath);

    const d = 4;
    const ps = [];
    !function() {
      for(let i = 1; i < d; i += 1) {
        const $ps = $('circle').attrs({ r : 4, fill : sc1, stroke : 'none' });
        $s.append($ps);
        ps.push($ps);
      }
    }();

    const moveHandler = function() {
      const p1 = $p1.model;
      const p2 = $p2.model;
      const p3 = $p3.model;
      const p4 = $p4.model;
      $path1.attrs({ d: $pb().moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).build() });
      $path2.attrs({ d: $pb().moveTo(p3.x, p3.y).lineTo(p4.x, p4.y).build() });
      $cpath.attrs({ d: $pb().moveTo(p1.x, p1.y).
        cubicTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y).build() });
      for(let i = 1; i < d; i += 1) {
        const p = cubic(p1, p2, p3, p4, i / d);
        ps[i - 1].attrs({ cx: p.x, cy: p.y });
      }
    };
    const appendPoint = function(opts) {
      const $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    const $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    const $p2 = appendPoint({ x : 70, y : 30, label : 'c1', color : sc1 });
    const $p3 = appendPoint({ x : 150, y : 40, label : 'c2', color : sc1 });
    const $p4 = appendPoint({ x : 170, y : 100, label : 'B' });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {
    const $s = createStage(200, 200);
    const $path1 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path1);
    const $path2 = $('path').attrs({ fill : 'none', stroke : sc1 });
    $s.append($path2);
    const $cpath = $('path').attrs({ fill : 'none', stroke : sc2 });
    $s.append($cpath);
    const $cz = $('circle').attrs({ r : 4, fill : 'none', stroke : sc1 });
    $s.append($cz);
    const moveHandler = function() {
      const p1 = $p1.model;
      const p2 = $p2.model;
      const p3 = $p3.model;
      const p4 = $p4.model;
      const p21 = [p2.x - p1.x, p2.y - p1.y];
      const p43 = [p4.x - p3.x, p4.y - p3.y];
      const p5 = getCrossPoint([p1.x, p1.y], p21, [p3.x, p3.y], p43);
      $cz.attrs({ cx : p5[0], cy : p5[1] });
      $path1.attrs({ d: $pb().moveTo(p1.x, p1.y).lineTo(p2.x, p2.y).build() });
      $path2.attrs({ d: $pb().moveTo(p3.x, p3.y).lineTo(p4.x, p4.y).build() });
      $cpath.attrs({ d: $pb().moveTo(p1.x, p1.y).
        quadTo(p5[0], p5[1], p3.x, p3.y).build() });
    };
    const appendPoint = function(opts) {
      const $p = createPoint(opts);
      $p.model.on('move', moveHandler);
      $s.append($p);
      return $p;
    };
    const $p1 = appendPoint({ x : 30, y : 170, label : 'A' });
    const $p2 = appendPoint({ x : 40, y : 160, label : 'A\'', color : sc1 });
    const $p3 = appendPoint({ x : 160, y : 100, label : 'B' });
    const $p4 = appendPoint({ x : 170, y : 102, label : 'B\'', color : sc1 });
    moveHandler();
    $(document.body).append($s);
  }();

  !function() {

    const $s = createStage(600, 300);

    const n = 8;
    const a = 100;

    const fn = function(t) {
      return [50 + 500 * t / (Math.PI * 2), -a * Math.sin(t) + 150];
    };

    const $path = $('path').attrs({
      d : $pb().moveTo(10, 150).lineTo(590, 150).build(),
      fill : 'none', stroke : sc1 });
    $s.append($path);

    !function() {
      const d = getQuadPoints({ fn : fn,
        min : 0, max : Math.PI * 2, n : n, dt : 0.1 });
      drawDebugPoints($s, d);
      const pb = $pb();
      for(let i = 0; i < d.length; i += 1) {
        if (i == 0) {
          pb.moveTo(d[i][0], d[i][1]);
        } else {
          pb.quadTo(d[i][0], d[i][1], d[i][2], d[i][3]);
        }
      }
      const $path = $('path').attrs({
        d : pb.build(), fill : 'none', stroke : sc2 });
      $s.append($path);
    }();

    $(document.body).append($s);
  }();

  !function() {

    const w = 600;
    const h = 400;
    const $s = createStage(w, h);
    const $base = $('g').attrs({
      transform : $tb().translate(w / 2 - 190, h / 2 - 150).build() });
    $s.append($base);

    const opts = {
      r1 : 200, r2 : 420, r3 : 40, r4 : 60,
      w : 80, a : Math.PI / 3
    };

    const $tmp = $('g').attrs({ fill : 'none',
      stroke : '#000', 'stroke-width' : '0.5' });
    $base.append($tmp);

    const l = function(a) {
      const rx = opts.r2 * Math.cos(a);
      const ry = opts.r2 * Math.sin(a);
      const wx = opts.w / 2 * Math.cos(a + Math.PI / 2);
      const wy = opts.w / 2 * Math.sin(a + Math.PI / 2);
      $tmp.append($('path').attrs({ d :
        $pb().moveTo(0, 0).lineTo(rx, ry).build() }) );
      $tmp.append($('path').attrs({ d :
        $pb().moveTo(-wx, -wy).lineTo(rx - wx, ry - wy).build() }) );
      $tmp.append($('path').attrs({ d :
        $pb().moveTo(wx, wy).lineTo(rx + wx, ry + wy).build() }) );
    };
    l(0);
    l(opts.a);

    const arcs = [];

    !function() {
      const a = Math.asin( (opts.w / 2 + opts.r3) / (opts.r1 + opts.r3) );
      const x = opts.r1 * Math.cos(a);
      const y = opts.r1 * Math.sin(a);
      const t = Math.atan2(y, x);
      arcs.push({ order : 0, cx : 0, cy : 0,
        r : opts.r1, t0 : opts.a - t, t1 : t });
    }();

    !function() {
      let dt;
      !function(a) {
        const x = opts.r1 * Math.cos(a);
        const y = opts.r1 * Math.sin(a);
        const cx = (opts.r1 + opts.r3) * Math.cos(a);
        const cy = (opts.r1 + opts.r3) * Math.sin(a);
        const t0 = Math.atan2(y - cy, x - cx);
        const t1 = Math.atan2(opts.w / 2 - cy, 0);
        arcs.push({ order : 1, cx : cx, cy : cy,
          r : opts.r3, t0 : t0, t1 : t1 });
        dt = t1 - t0;
      }(Math.asin( (opts.w / 2 + opts.r3) / (opts.r1 + opts.r3) ) );
      !function(a) {
        const x = opts.r1 * Math.cos(a);
        const y = opts.r1 * Math.sin(a);
        const cx = (opts.r1 + opts.r3) * Math.cos(a);
        const cy = (opts.r1 + opts.r3) * Math.sin(a);
        const t0 = Math.atan2(y - cy, x - cx);
        const t1 = t0 - dt;
        arcs.push({ order : 5, cx : cx, cy : cy,
          r : opts.r3, t0 : t1, t1 : t0 });
      }(opts.a - Math.asin( (opts.w / 2 + opts.r3) / (opts.r1 + opts.r3) ) );
    }();

    !function() {
      const a = Math.asin( (opts.w / 2 + opts.r4) / (opts.r2 - opts.r4) );
      const x = opts.r2 * Math.cos(a);
      const y = opts.r2 * Math.sin(a);
      const t = Math.atan2(y, x);
      arcs.push({ order : 3, cx : 0, cy : 0,
        r : opts.r2, t0 : t, t1 : opts.a - t });
    }();

    !function() {
      let dt;
      !function(a) {
        const x = opts.r2 * Math.cos(a);
        const y = opts.r2 * Math.sin(a);
        const cx = (opts.r2 - opts.r4) * Math.cos(a);
        const cy = (opts.r2 - opts.r4) * Math.sin(a);
        const t0 = Math.atan2(opts.w / 2 - cy, 0);
        const t1 = Math.atan2(y - cy, x - cx);
        arcs.push({ order : 2, cx : cx, cy : cy,
          r : opts.r4, t0 : t0, t1 : t1 });
        dt = t1 - t0;
      }(Math.asin( (opts.w / 2 + opts.r4) / (opts.r2 - opts.r4) ) );
      !function(a) {
        const x = opts.r2 * Math.cos(a);
        const y = opts.r2 * Math.sin(a);
        const cx = (opts.r2 - opts.r4) * Math.cos(a);
        const cy = (opts.r2 - opts.r4) * Math.sin(a);
        const t1 = Math.atan2(y - cy, x - cx);
        const t0 = t1 + dt;
        arcs.push({ order : 4, cx : cx, cy : cy,
          r : opts.r4, t0 : t1, t1 : t0 });
      }(opts.a - Math.asin( (opts.w / 2 + opts.r4) / (opts.r2 - opts.r4) ) );
    }();

    arcs.sort(function(a1, a2) {
      return a1.order < a2.order ? -1 : 1;
    });

    !function() {
      const tr1 = 8;
      const tr2 = 5;
      arcs.forEach(function(arc, i) {
        const color = sc1;
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

    $base.append($('path').attrs({ d : createPie(opts).path, fill : 'none', stroke : sc2 }) );

    opts.offsetAngle = Math.PI / 3;
    $base.append($('path').attrs({ d : createPie(opts).path, fill : 'none', stroke : sc2 }) );

    opts.offsetAngle = -Math.PI / 3;
    $base.append($('path').attrs({ d : createPie(opts).path, fill : 'none', stroke : sc2 }) );

    $(document.body).append($s);
  }();

  !function() {

    const w = 600;
    const h = 400;
    const $s = createStage(w, h);
    const $base = $('g').attrs({
      transform : $tb().translate(w / 2, h / 2).build() });
    $s.append($base);

    const n = 15;
    const r = 25;
    const tMin = Math.PI * 2 * 0;
    const tMax = Math.PI * 2 * 1.25;

    const t0 = 0;

    const fn = function(t) {
      const x = r * Math.cos(t + t0) + r * t * Math.sin(t + t0);
      const y = r * Math.sin(t + t0) - r * t * Math.cos(t + t0);
      return [x, y];
    };

    const fn0 = function(t) {
      const x = r * Math.cos(t + t0);
      const y = r * Math.sin(t + t0);
      const ix = r * t * Math.sin(t + t0);
      const iy = -r * t * Math.cos(t + t0);
      return [x, y, ix, iy];
    };

    const $c = $('circle').attrs({ r : r, fill : 'none', stroke : sc1 });
    $base.append($c);

    !function() {
      for(let i = 0; i <= n; i += 1) {
        const t = tMin + (tMax - tMin) * i / n;
        const p = fn0(t);
        const $path = $('path').attrs({
          d : $pb().moveTo(0, 0).lineTo(p[0], p[1]).
              lineTo(p[0] + p[2], p[1] + p[3]).build(),
          fill : 'none', stroke : '#ccc'/*i % 2 == 0? '#6c6' : '#c96'*/ });
        $base.append($path);
      }
    }();

    !function() {
      const d = getQuadPoints({ fn : fn,
        min : tMin, max : tMax, n : n, dt : 0.05 });
      drawDebugPoints($base, d);
      const pb = $pb();
      for(let i = 0; i < d.length; i += 1) {
        if (i == 0) {
          pb.moveTo(d[i][0], d[i][1]);
        } else {
          pb.quadTo(d[i][0], d[i][1], d[i][2], d[i][3]);
        }
      }
      const $path = $('path').attrs({
        d : pb.build(), fill : 'none', stroke : sc2 });
      $base.append($path);
    }();

    $(document.body).append($s);
  }();

  !function() {

    const get_fn0 = function(r, t0) {
      return function(t) {
        return [
          r * Math.cos(t + t0), r * Math.sin(t + t0),
          r * t * Math.sin(t + t0), -r * t * Math.cos(t + t0)
        ];
      };
    };

    const w = 600;
    const h = 400;
    const $s = createStage(w, h);
    const $base = $('g').attrs({
      transform : $tb().translate(w / 2, h / 2).build() });
    $s.append($base);

    const m = 20;
    const gear1 = createGear({ m : m, z : 20 });
    const gear2 = createGear({ m : m, z : 16 });
    const gear3 = createInnerGear({ m : m, z : 48 });

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

    const drawDebugInfo = function() {
      $base.append($('circle').attrs({
        r : gear1.r, fill : 'none', stroke : sc1 }) );

      !function() {
        const r = gear1.d2 / 2;
        const n = gear1.z * 2;
        for(let i = 0; i < n; i += 1) {
          const t = Math.PI * 2 * i / n;
          const $c = $('path').attrs({
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
        const n = 3;
        const fn0 = get_fn0(gear1.r, gear1.t0);
        for(let i = 0; i <= n; i += 1) {
          const t = gear1.tMin + (gear1.tMax - gear1.tMin) * i / n;
          const p = fn0(t);
          const $path = $('path').attrs({
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

    const w = 600;
    const h = 400;
    const $s = createStage(w, h);
    const $base = $('g').attrs({
      transform : $tb().translate(w / 2, h / 2).build() });
    $s.append($base);

    const m = 6;
    const gear1 = createGear({ m : m, z : 16 });
    const gear2 = createGear({ m : m, z : 22 });
    const gear3 = createInnerGear({ m : m, z : 60 });

    const g1 = $('g').append($('path').attrs({
      d : gear1.path, fill : 'none', stroke : '#666' }) );
    !function(numPies) {
      for(let i = 0; i < numPies; i += 1) {
        const a = 2 * Math.PI / numPies;
        g1.append($('path').attrs({
          d : createPie({
            r1 : 10, r2 : gear1.d1 / 2 - 10, r3: 5, r4: 5, w : 10,
            a : a, offsetAngle : a * i }).path,
            fill : 'none', stroke : '#666'
        }) );
      }
    }(4);

    const g2 = [];
    !function() {
      for(let i = 0; i < 4; i += 1) {
        g2.push($('g').append($('path').attrs({
          d : gear2.path, fill : 'none', stroke : '#666' }) ) );
        !function(numPies) {
          for(let i = 0; i < numPies; i += 1) {
            const a = 2 * Math.PI / numPies;
            g2[g2.length - 1].append($('path').attrs({
              d : createPie({
                r1 : 15, r2 : gear2.d1 / 2 - 10, r3: 5, r4: 5, w : 10,
                a : a, offsetAngle : a * i }).path,
                fill : 'none', stroke : '#666'
            }) );
          }
        }(6);
      }
    }();

    const g3 = $('g').append($('path').attrs({
      d : gear3.path, fill : 'none', stroke : '#666' }) );

    $base.append(g1);
    g2.forEach(function(g) {
      $base.append(g);
    });
    $base.append(g3);

    const model = {
      angle : 0
    };
    const update = function() {
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

    const enterFrame = function(t) {
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
