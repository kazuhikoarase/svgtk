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

var gearUtil = function() {

  var $pb = svgtk.pathBuilder;
  var $math = svgtk.math;

  // t = sqrt(rr^2 / r^2 - 1)
  var get_t = function(r, rr) {
    return Math.sqrt( (rr * rr) / (r * r) - 1);
  };

  var get_fn = function(r, t0) {
    return function(t) {
      return [
        r * Math.cos(t + t0) + r * t * Math.sin(t + t0),
        r * Math.sin(t + t0) - r * t * Math.cos(t + t0)
      ];
    };
  };

  var createGear = function(opts) {

    opts = svgtk.extend({ m : 20, z : 20 }, opts);

    var a = Math.PI * 20 / 180;
    var n = 3;

    var m = opts.m;
    var z = opts.z;

    var d = z * m;
    var d1 = d - 2.5 * m;
    var d2 = d + 2 * m;
    var db = d * Math.cos(a);

    var r = db / 2;
    r = Math.max(r, d1 / 2); // fix - r
    var tMin = Math.PI * 2 * 0;
    var tMax = get_t(r, d2 / 2);

    var p = get_fn(r, 0)(get_t(r, d / 2) );
    var t0 = -Math.atan(p[1] / p[0]);

    var pb = $pb();

    var i, qPts, tOffset = 0;

    for (var m = 0; m < z; m += 1) {

      qPts = $math.getQuadPoints({ fn : get_fn(r, t0 + tOffset),
        min : tMin, max : tMax, n : n, dt : 0.05 });
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
        min : -tMax, max : tMin, n : n, dt : 0.05 });
      for (i = 0; i < qPts.length; i += 1) {
        if (i == 0) {
          pb.lineTo(qPts[i][0], qPts[i][1]);
        } else {
          pb.quadTo(qPts[i][0], qPts[i][1], qPts[i][2], qPts[i][3]);
        }
      }
      tOffset += Math.PI / z;

      !function() {
        var t1;
        var r1 = d1 / 2;
        var pts1 = [];
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

  var createInnerGear = function(opts) {

    opts = svgtk.extend({ m : 20, z : 20 }, opts);

    var a = Math.PI * 20 / 180;
    var n = 3;

    var m = opts.m;
    var z = opts.z;

    var d = z * m;
    var d1 = d + 2.5 * m;
    var d2 = d - 2 * m;
    var db = d * Math.cos(a);

    var r = db / 2;
    r = Math.max(r, d2 / 2); // fix - r
    var tMin = Math.PI * 2 * 0;
    var tMax = get_t(r, d1 / 2);

    var p = get_fn(r, 0)(get_t(r, d / 2) );
    var t0 = -Math.atan(p[1] / p[0]);

    var pb = $pb();

    var i, qPts, tOffset = 0;

    for (var m = 0; m < z; m += 1) {

      qPts = $math.getQuadPoints({ fn : get_fn(r, -t0 + tOffset),
        min : -tMax, max : tMin, n : n, dt : 0.05 });
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
        min : tMin, max : tMax, n : n, dt : 0.05 });
      for (i = 0; i < qPts.length; i += 1) {
        if (i == 0) {
          pb.lineTo(qPts[i][0], qPts[i][1]);
        } else {
          pb.quadTo(qPts[i][0], qPts[i][1], qPts[i][2], qPts[i][3]);
        }
      }
      tOffset += Math.PI / z;

      !function() {
        var t1;
        var r1 = d1 / 2;
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

  return {
    createGear : createGear,
    createInnerGear : createInnerGear
  };
}();
