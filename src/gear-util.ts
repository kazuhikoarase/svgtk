//
// gear-util
//
// Copyright (c) 2023 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

'use strict'

import { svgtk } from './svgtk';


const $pb = svgtk.pathBuilder;
const $math = svgtk.math;

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

interface GearOpts {
  m? : number;
  z? : number;
  a? : number;
}

const createGear = function(opts : GearOpts) {

  opts = svgtk.extend({ m : 20, z : 20, a : Math.PI * 20 / 180 }, opts);

  const m = opts.m!;
  const z = opts.z!;

  const d = z! * m;
  const d1 = d - 2.5 * m;
  const d2 = d + 2 * m;
  const db = d * Math.cos(opts.a!);

  let r = db / 2;
  r = Math.max(r, d1 / 2); // fix - r
  const tMin = Math.PI * 2 * 0;
  const tMax = get_t(r, d2 / 2);

  const p = get_fn(r, 0)(get_t(r, d / 2) );
  const t0 = -Math.atan(p[1] / p[0]);

  const pb = $pb();

  let i, qPts, tOffset = 0;

  for (let m = 0; m < z; m += 1) {

    qPts = $math.getQuadPoints({ fn : get_fn(r, t0 + tOffset),
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

    qPts = $math.getQuadPoints({ fn : get_fn(r, -t0 + tOffset),
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

const createInnerGear = function(opts : GearOpts) {

  opts = svgtk.extend({ m : 20, z : 20, a : Math.PI * 20 / 180 }, opts);

  const m = opts.m!;
  const z = opts.z!;

  const d = z * m;
  const d1 = d + 2.5 * m;
  const d2 = d - 2 * m;
  const db = d * Math.cos(opts.a!);

  let r = db / 2;
  r = Math.max(r, d2 / 2); // fix - r
  const tMin = Math.PI * 2 * 0;
  const tMax = get_t(r, d1 / 2);

  const p = get_fn(r, 0)(get_t(r, d / 2) );
  const t0 = -Math.atan(p[1] / p[0]);

  const pb = $pb();

  let i, qPts, tOffset = 0;

  for (let m = 0; m < z; m += 1) {

    qPts = $math.getQuadPoints({ fn : get_fn(r, -t0 + tOffset),
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

    qPts = $math.getQuadPoints({ fn : get_fn(r, t0 + tOffset),
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

interface PieOpts {
  r1? : number;
r2? : number;
r3? : number;
r4? : number;
w? : number;
a? : number;
offsetAngle? : number;
}

const createPie = function(opts : PieOpts) {

  opts = svgtk.extend({
    r1 : 100, r2 : 200, r3 : 10, r4 : 10,
    w : 10, a : Math.PI / 2, offsetAngle : 0
  }, opts);

  const arcs : { order : number, cx : number, cy : number, r : number, t0 : number, t1 : number }[] = [];

  const r1 =  opts.r1!;
  const r2 =  opts.r2!;
  const r3 =  opts.r3!;
  const r4 =  opts.r4!;
  const w =  opts.w!;
  const a =  opts.a!;
  const offsetAngle =  opts.offsetAngle!;
  
  !function() : any {
    const a = Math.asin( (w / 2 + r3) / (r1 + r3) );
    const x = r1 * Math.cos(a);
    const y = r1 * Math.sin(a);
    const t = Math.atan2(y, x);
    arcs.push({ order : 0, cx : 0, cy : 0,
      r : r1, t0 : a - t, t1 : t });
  }();

  !function() : any {
    let dt;
    !function(a) : any {
      const x = r1 * Math.cos(a);
      const y = r1 * Math.sin(a);
      const cx = (r1 + r3) * Math.cos(a);
      const cy = (r1 + r3) * Math.sin(a);
      const t0 = Math.atan2(y - cy, x - cx);
      const t1 = Math.atan2(w / 2 - cy, 0);
      arcs.push({ order : 1, cx : cx, cy : cy,
        r : r3, t0 : t0, t1 : t1 });
      dt = t1 - t0;
    }(Math.asin( (w / 2 + r3) / (r1 + r3) ) );
    !function(a) : any {
      const x = r1 * Math.cos(a);
      const y = r1 * Math.sin(a);
      const cx = (r1 + r3) * Math.cos(a);
      const cy = (r1 + r3) * Math.sin(a);
      const t0 = Math.atan2(y - cy, x - cx);
      const t1 = t0 - dt;
      arcs.push({ order : 5, cx : cx, cy : cy,
        r : r3, t0 : t1, t1 : t0 });
    }(a - Math.asin( (w / 2 + r3) / (r1 + r3) ) );
  }();

  !function() : any {
    const a = Math.asin( (w / 2 + r4) / (r2 - r4) );
    const x = r2 * Math.cos(a);
    const y = r2 * Math.sin(a);
    const t = Math.atan2(y, x);
    arcs.push({ order : 3, cx : 0, cy : 0,
      r : r2, t0 : t, t1 : a - t });
  }();

  !function() : any {
    let dt;
    !function(a) : any {
      const x = r2 * Math.cos(a);
      const y = r2 * Math.sin(a);
      const cx = (r2 - r4) * Math.cos(a);
      const cy = (r2 - r4) * Math.sin(a);
      const t0 = Math.atan2(w / 2 - cy, 0);
      const t1 = Math.atan2(y - cy, x - cx);
      arcs.push({ order : 2, cx : cx, cy : cy,
        r : r4, t0 : t0, t1 : t1 });
      dt = t1 - t0;
    }(Math.asin( (w / 2 + r4) / (r2 - r4) ) );
    !function(a) : any {
      const x = r2 * Math.cos(a);
      const y = r2 * Math.sin(a);
      const cx = (r2 - r4) * Math.cos(a);
      const cy = (r2 - r4) * Math.sin(a);
      const t1 = Math.atan2(y - cy, x - cx);
      const t0 = t1 + dt;
      arcs.push({ order : 4, cx : cx, cy : cy,
        r : r4, t0 : t1, t1 : t0 });
    }(a - Math.asin( (w / 2 + r4) / (r2 - r4) ) );
  }();

  arcs.sort(function(a1, a2) {
    return a1.order < a2.order ? -1 : 1;
  });

  const mat = $math.mat4().rotateZ(offsetAngle);

  const pb = $pb();
  arcs.forEach(function(arc) {
    const fn =function(t : number) {
      return [
        arc.r * Math.cos(t) + arc.cx,
        arc.r * Math.sin(t) + arc.cy
      ];
    };
    const d = $math.getQuadPoints({ fn : fn,
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

export default {
  createGear,
  createInnerGear,
  createPie
};
