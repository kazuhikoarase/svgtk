//
// math
//
// Copyright (c) 2025 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

import { extend } from './core';

export const d2r = (deg : number) => deg / 180 * Math.PI;
export const r2d = (rad : number) => rad / Math.PI * 180;

const inv = function(m : number[]) {
  const det = m[0] * m[3] - m[1] * m[2];
  return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det];
};

export const getCrossPoint = function(a : number[], va : number[], b : number[], vb : number[]) {
  const m = inv([va[0], -vb[0], va[1], -vb[1]]);
  const v = [b[0] - a[0], b[1] - a[1]];
  //const st = [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
  //return [a[0] + va[0] * st[0], a[1] + va[1] * st[0]];
  const s = m[0] * v[0] + m[1] * v[1];
  return [a[0] + va[0] * s, a[1] + va[1] * s];
};

interface QuadPointsOpts {
  fn : (t : number) => number[];
  min : number;
  max : number;
  n : number;
  dt : number;
}

export const getQuadPoints = function(opts : QuadPointsOpts) {

  opts = extend({
    fn : function(t : number) { return [t, t] },
    min : 0, max : 1, n : 10, dt : 0.1
  }, opts);

  // delta points
  const points = [];
  !function() : any {
    for (let i = 0; i <= opts.n; i += 1) {
      const t = (opts.max - opts.min) * i / opts.n + opts.min;
      points.push([opts.fn(t), opts.fn(t + opts.dt)]);
    }
  }();

  const quadPoints = [];
  !function() : any {
    for (let i = 0; i < opts.n; i += 1) {
      let z = getCrossPoint(
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
  const qp : any = quadPoints;
  qp.points = points;
  return quadPoints;
};

export default {
  r2d,
  d2r,
  getCrossPoint,
  getQuadPoints
};
