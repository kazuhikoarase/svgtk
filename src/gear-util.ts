//
// gear-util
//
// Copyright (c) 2025 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

import { extend } from './core';
import { pathBuilder as $pb } from './svgtk';
import { getQuadPoints } from './math';
import { mat4 } from './mat4';

// t = sqrt(rr^2 / r^2 - 1)
const get_t = function(r : number, rr : number) {
  return Math.sqrt( (rr * rr) / (r * r) - 1);
};

const get_fn = function(r : number, t0 : number) {
  return function(t : number) {
    return [
      r * Math.cos(t + t0) + r * t * Math.sin(t + t0),
      r * Math.sin(t + t0) - r * t * Math.cos(t + t0)
    ];
  };
};

const quadParams = { n : 3, dt : 0.05 };

export interface GearOpts {
  m : number;
  z : number;
  a : number;
}

export interface PieOpts {
  r1 : number;
  r2 : number;
  r3 : number;
  r4 : number;
  w : number;
  a : number;
  offsetAngle : number;
}

export const createGear = function(opts : GearOpts) {

  opts = extend({ m : 20, z : 20, a : Math.PI * 20 / 180 }, opts);

  const m = opts.m;
  const z = opts.z;

  const d = z * m;
  const d1 = d - 2.5 * m;
  const d2 = d + 2 * m;
  const db = d * Math.cos(opts.a);

  let r = db / 2;
  r = Math.max(r, d1 / 2); // fix - r
  const tMin = Math.PI * 2 * 0;
  const tMax = get_t(r, d2 / 2);

  const p = get_fn(r, 0)(get_t(r, d / 2) );
  const t0 = -Math.atan(p[1] / p[0]);

  const pb = $pb();

  let i, qPts, tOffset = 0;

  for (let m = 0; m < z; m += 1) {

    qPts = getQuadPoints({ fn : get_fn(r, t0 + tOffset),
      min : tMin, max : tMax, n : quadParams.n, dt : quadParams.dt });
    for (i = 0; i < qPts.length; i += 1) {
      if (i == 0) {
        if (m == 0) {
          pb.moveTo(qPts[i][0], qPts[i][1]);
        }
      } else {
        pb.quadTo(qPts[i][0], qPts[i][1], qPts[i][2], qPts[i][3]);
      }
    }
    tOffset += Math.PI / z;

    qPts = getQuadPoints({ fn : get_fn(r, -t0 + tOffset),
      min : -tMax, max : tMin, n : quadParams.n, dt : quadParams.dt });
    for (i = 0; i < qPts.length; i += 1) {
      if (i == 0) {
        pb.lineTo(qPts[i][0], qPts[i][1]);
      } else {
        pb.quadTo(qPts[i][0], qPts[i][1], qPts[i][2], qPts[i][3]);
      }
    }
    tOffset += Math.PI / z;

    !function() : any {
      let t1;
      const r1 = d1 / 2;
      const pts1 = [];
      t1 = Math.PI / z * (m * 2 + 1) - t0;
      pts1.push([r1 * Math.cos(t1), r1 * Math.sin(t1)]);
      t1 = Math.PI / z * (m * 2 + 1.5);
      pts1.push([r1 * Math.cos(t1), r1 * Math.sin(t1)]);
      t1 = Math.PI / z * (m * 2 + 2) + t0;
      pts1.push([r1 * Math.cos(t1), r1 * Math.sin(t1)]);
      t1 = Math.PI / z * (m * 2 + 2) + t0;
      pts1.push([r * Math.cos(t1), r * Math.sin(t1)]);
      pb.quadTo(pts1[0][0], pts1[0][1], pts1[1][0], pts1[1][1]);
      pb.quadTo(pts1[2][0], pts1[2][1], pts1[3][0], pts1[3][1]);
    }();
  }

  pb.close();

  return {
    m : m, z : z, d : d, d1 : d1, d2 : d2, r : r,
    tMin : tMin, tMax : tMax, t0 : t0,
    path : pb.build()
  };
};

export const createInnerGear = function(opts : GearOpts) {

  opts = extend({ m : 20, z : 20, a : Math.PI * 20 / 180 }, opts);

  const m = opts.m;
  const z = opts.z;

  const d = z * m;
  const d1 = d + 2.5 * m;
  const d2 = d - 2 * m;
  const db = d * Math.cos(opts.a);

  let r = db / 2;
  r = Math.max(r, d2 / 2); // fix - r
  const tMin = Math.PI * 2 * 0;
  const tMax = get_t(r, d1 / 2);

  const p = get_fn(r, 0)(get_t(r, d / 2) );
  const t0 = -Math.atan(p[1] / p[0]);

  const pb = $pb();

  let i, qPts, tOffset = 0;

  for (let m = 0; m < z; m += 1) {

    qPts = getQuadPoints({ fn : get_fn(r, -t0 + tOffset),
      min : -tMax, max : tMin, n : quadParams.n, dt : quadParams.dt });
    for (i = 0; i < qPts.length; i += 1) {
      if (i == 0) {
        if (m == 0) {
          pb.moveTo(qPts[i][0], qPts[i][1]);
        }
      } else {
        pb.quadTo(qPts[i][0], qPts[i][1], qPts[i][2], qPts[i][3]);
      }
    }
    tOffset += Math.PI / z;

    qPts = getQuadPoints({ fn : get_fn(r, t0 + tOffset),
      min : tMin, max : tMax, n : quadParams.n, dt : quadParams.dt });
    for (i = 0; i < qPts.length; i += 1) {
      if (i == 0) {
        pb.lineTo(qPts[i][0], qPts[i][1]);
      } else {
        pb.quadTo(qPts[i][0], qPts[i][1], qPts[i][2], qPts[i][3]);
      }
    }
    tOffset += Math.PI / z;

    !function() : any {
      let t1;
      const r1 = d1 / 2;
      t1 = Math.PI / z * (m * 2 + 1.5) - t0;
      pb.lineTo(r1 * Math.cos(t1), r1 * Math.sin(t1));
    }();
  }

  pb.close();

  return {
    m : m, z : z, d : d, d1 : d1, d2 : d2, r : r,
    tMin : tMin, tMax : tMax, t0 : t0,
    path : pb.build()
  };
};

export const createPie = function(opts : PieOpts) {

  opts = extend({
    r1 : 100, r2 : 200, r3 : 10, r4 : 10,
    w : 10, a : Math.PI / 2, offsetAngle : 0
  }, opts);

  const arcs : { order : number, cx : number, cy : number, r : number, t0 : number, t1 : number }[] = [];

  !function() : any {
    const a = Math.asin( (opts.w / 2 + opts.r3) / (opts.r1 + opts.r3) );
    const x = opts.r1 * Math.cos(a);
    const y = opts.r1 * Math.sin(a);
    const t = Math.atan2(y, x);
    arcs.push({ order : 0, cx : 0, cy : 0,
      r : opts.r1, t0 : opts.a - t, t1 : t });
  }();

  !function() : any {
    let dt;
    !function(a) : any {
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
    !function(a) : any {
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

  !function() : any {
    const a = Math.asin( (opts.w / 2 + opts.r4) / (opts.r2 - opts.r4) );
    const x = opts.r2 * Math.cos(a);
    const y = opts.r2 * Math.sin(a);
    const t = Math.atan2(y, x);
    arcs.push({ order : 3, cx : 0, cy : 0,
      r : opts.r2, t0 : t, t1 : opts.a - t });
  }();

  !function() : any {
    let dt;
    !function(a) : any {
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
    !function(a) : any {
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

  const mat = mat4().rotateZ(opts.offsetAngle);

  const pb = $pb();
  arcs.forEach(function(arc) {
    const fn =function(t : number) {
      return [
        arc.r * Math.cos(t) + arc.cx,
        arc.r * Math.sin(t) + arc.cy
      ];
    };
    const d = getQuadPoints({ fn : fn,
      min : arc.t0, max : arc.t1, n : 4, dt : 0.05 });
    for (let i = 0; i < d.length; i += 1) {
      d[i] = mat.transform([d[i][0], d[i][1]]).
        concat(mat.transform([d[i][2], d[i][3]]) );
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

  return { path : pb.build() };
};
