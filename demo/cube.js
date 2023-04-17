//
// cube
//
// Copyright (c) 2023 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

'use strict'

var cube = function() {

  var $ = svgtk.domWrapper;
  var $pb = svgtk.pathBuilder;
  var $tb = svgtk.tranBuilder;
  var $mat4 = svgtk.math.mat4;

  var d2r = function(d) { return d * Math.PI / 180; };
  var r2d = function(r) { return r * 180 / Math.PI; };

  var create = function(model) {

    model = svgtk.extend({
      width : 960, height : 540,
      cubeScale : 32,
      viewPoint : 800,
      surfaceOpacity : 0.8,
      surfaceDistance : 0.5,
      cubeDistance : 1,
      defaultAngles : { t : 0, p : 0, z : 0 },
      angles : { t : 0, p : 0, z : 0 },
      getColor : function(rect) {
        return rect != null? '#ccc' : '#666';
      },
      rectMap : null,
      rots : [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ],
      overlay : null
    }, model || {});

    var sw = model.width;
    var sh = model.height;

    var $s = $('svg').attrs({
        width : sw, height : sh,
        viewBox : (-sw / 2) + ' ' + (-sh / 2) + ' ' + sw + ' ' + sh } );

    var forEachXYZ = function(cb) {
      for (var z = -1; z <= 1; z += 1) {
        for (var y = -1; y <= 1; y += 1) {
          for (var x = -1; x <= 1; x += 1) {
            cb(x, y, z);
          }
        }
      }
    };

    var reset = function() {
      var angles = svgtk.extend({}, model.defaultAngles);
      var rectMap = [];

      forEachXYZ(function(x, y, z) {
        var rects = [];
        for (var i = 0; i < 6; i += 1) {
          var rect = null;
          if (x != -1 && i == 1) {
          } else if (x != 1 && i == 0) {
          } else if (y != -1 && i == 3) {
          } else if (y != 1 && i == 2) {
          } else if (z != -1 && i == 5) {
          } else if (z != 1 && i == 4) {
          } else {
            rect = { r : i, uid : rectMap.length + '-' + i,
              x : x, y : y, z : z };
          }
          rects.push(rect);
        }
        rectMap.push(rects);
      });

      model.angles = angles;
      model.rectMap = rectMap;
    };

    var applyPerspective = function(vec) {
      var vp = model.viewPoint;
      var perScale = vp / (vp - vec[2]);
      return [
        vec[0] * perScale,
        vec[1] * perScale,
        vec[2] * perScale,
        vec[3]
      ];
    };

    var update = function() {

      // remove all
      while($s.$el.firstChild) {
        $s.$el.removeChild($s.$el.firstChild);
      }

      // global matrix
      var globalMat = $mat4().
        rotateY(d2r(model.angles.p) ).
        rotateX(d2r(model.angles.t) ).
        rotateZ(d2r(model.angles.z) ).
        scaleX(model.cubeScale).
        scaleY(model.cubeScale).
        scaleZ(model.cubeScale);

      var appendDebugRectElm = function(elms, mat, vec, rot, rect) {

        var localMat = $mat4().
          rotateX(rot[0]).rotateY(rot[1]).rotateZ(rot[2]).
          translateX(vec[0]).translateY(vec[1]).translateZ(vec[2]).
          concat(mat).concat(globalMat);

        var r = 0.5;
        var sum = [0, 0, 0, 0];
        var pb = $pb();

        [
          [-r, -r, 0, 1], [-r, r, 0, 1], [r, r, 0, 1], [r, -r, 0, 1],
          [0, -r, 0, 1]
        ].forEach(function(vec, i) {
          vec = localMat.transform(vec);
          vec = applyPerspective(vec);
          if (i == 0) {
            pb.moveTo(vec[0], vec[1]);
          } else {
            pb.lineTo(vec[0], vec[1]);
          }
          sum[0] += vec[0];
          sum[1] += vec[1];
          sum[2] += vec[2];
          sum[3] += 1; // count
        });

        elms.push({
          $el : $('path').attrs({ d : pb.build(),
            stroke : model.getColor(rect),
            'stroke-width' : 2, 'stroke-linejoin' : 'round',
            fill : 'none' }),
          depth : sum[2] / sum[3],
          inner : rect == null ? 1 : 0
        });
      };

      var appendRectElm = function(elms, mat, vec, rot, rect) {

        var localMat = $mat4().
          rotateX(rot[0]).rotateY(rot[1]).rotateZ(rot[2]).
          translateX(vec[0]).translateY(vec[1]).translateZ(vec[2]).
          concat(mat).concat(globalMat);

        var norm = [ [0, 0, 0, 1], [0, 0, 1, 1] ].map(function(vec) {
          return localMat.transform(vec);
        });

        var opacity = model.surfaceOpacity;
        var r = 0.5;
        var sum = [0, 0, 0, 0];
        var pb = $pb();

        [
          [-r, -r, 0, 1], [-r, r, 0, 1], [r, r, 0, 1], [r, -r, 0, 1]
        ].forEach(function(vec, i) {
          vec = localMat.transform(vec);
          vec = applyPerspective(vec);
          if (i == 0) {
            pb.moveTo(vec[0], vec[1]);
          } else {
            pb.lineTo(vec[0], vec[1]);
          }
          sum[0] += vec[0];
          sum[1] += vec[1];
          sum[2] += vec[2];
          sum[3] += 1; // count
        });
        var label = rect != null ? rect.uid : '?';
        var $path = $('path').attrs({ d : pb.close().build(),
          stroke : '#333', 'stroke-width' : 2, 'stroke-linejoin' : 'round',
          fill : model.getColor(rect), opacity : opacity });
        var $label = $('text').props({ textContent : label }).attrs({
            x : sum[0] / sum[3], y : sum[1] / sum[3],
            stroke : 'null', fill : '#000',
            'font-size' : 16,
            'text-anchor' : 'middle', 'font-family' : 'sans-serif' });

        var inner = -1;
        if (norm[1][2] - norm[0][2] < 0) {
          // back
          inner = rect == null ? 2 : 3;
        } else {
          // front
          inner = rect == null ? 1 : 0;
        }
        if (inner < 0) {
          return;
        }

        elms.push({
          $el : $path,
          //$el : $('g').append($path).append($label),
          depth : sum[2] / sum[3],
          inner : inner
        });
      };

      var appendCube = function(elms, mat, rectsIndex) {
        var rectMap = model.rectMap;
        var rects = rectMap[rectsIndex];
        var r = Math.PI / 2;
        var d = model.surfaceDistance;
//        var fn = appendDebugRectElm;
        var fn = appendRectElm;
        [
          { vec : [ d, 0, 0], rot : [0, r, 0] },
          { vec : [-d, 0, 0], rot : [0, r * 3, 0] },
          { vec : [ 0, d, 0], rot : [r, 0, r * 2] },
          { vec : [ 0,-d, 0], rot : [r, 0, 0] },
          { vec : [ 0, 0, d], rot : [0, 0, 0] },
          { vec : [ 0, 0,-d], rot : [0, r * 2, 0] }
        ].forEach(function(param, i) {
          fn(elms, mat, param.vec, param.rot, rects[i]);
        });
      };

      var elms = [];

      // org
      //appendDebugRectElm(elms, $mat4(), [0, 0, 0], [0, 0, 0], '#f00');

      if (model.overlay) {
        model.overlay(elms, globalMat);
      }

      //appendDebugGuide(elms, globalMat)

      var rots = model.rots;

      !function() {

        var d = model.cubeDistance;
        var rectsIndex = 0;

        forEachXYZ(function(x, y, z) {

          var mat = $mat4().
            translateX(d * x).
            translateY(d * y).
            translateZ(d * z);

          if (x == -1) {
            mat = mat.rotateX(rots[0][0]);
          } else if (x == 0) {
            mat = mat.rotateX(rots[0][1]);
          } else if (x == 1) {
            mat = mat.rotateX(rots[0][2]);
          }

          if (y == -1) {
            mat = mat.rotateY(rots[1][0]);
          } else if (y == 0) {
            mat = mat.rotateY(rots[1][1]);
          } else if (y == 1) {
            mat = mat.rotateY(rots[1][2]);
          }

          if (z == -1) {
            mat = mat.rotateZ(rots[2][0]);
          } else if (z == 0) {
            mat = mat.rotateZ(rots[2][1]);
          } else if (z == 1) {
            mat = mat.rotateZ(rots[2][2]);
          }

          appendCube(elms, mat, rectsIndex);
          rectsIndex += 1;
        });
      }();

      // bg
      $s.append($('rect').attrs({
        x : -sw / 2, y : -sh / 2, width : sw, height : sh,
        stroke : '#666', fill : '#eee' }) );

      // sort by depth
      elms.sort(function(e1, e2) {
        if (e1.inner != e2.inner) {
          return !(e1.inner < e2.inner) ? -1 : 1;
        }
        return e1.depth < e2.depth ? -1 : 1;
      });

      // render
      elms.forEach(function(elm) {
        $s.append(elm.$el);
      });
    };

    var parseCmd = function(cmd) {
      return cmd.match(/^(\w)('?)$/) ?
        { cmd : RegExp.$1, rev : !!RegExp.$2 } : null;
    };

    var rotsForCmd = function(cmd) {
      var rots = [ [0, 0, 0], [0, 0, 0], [0, 0, 0] ];
      var parsed = parseCmd(cmd);
      if (parsed) {
        var dr = (parsed.rev? -1 : 1) * d2r(15);
        if (parsed.cmd == "F") {
          rots[0][0] = -dr;
        } else if (parsed.cmd == "S") {
          rots[0][1] = -dr;
        } else if (parsed.cmd == "B") {
          rots[0][2] = dr;
        } else if (parsed.cmd == "U") {
          rots[1][0] = -dr;
        } else if (parsed.cmd == "E") {
          rots[1][1] = dr;
        } else if (parsed.cmd == "D") {
          rots[1][2] = dr;
        } else if (parsed.cmd == "L") {
          rots[2][0] = -dr;
        } else if (parsed.cmd == "M") {
          rots[2][1] = -dr;
        } else if (parsed.cmd == "R") {
          rots[2][2] = dr;
        }
      }
      return rots;
    };

    var appendDebugGuide = function(elms, globalMat) {
      var localMat = $mat4().concat(globalMat);
      var w = 3;
      var d = 1;
      var numBars = 16 + 1;
      var barOff = ~~(numBars / 2);

      for (var i = 0; i < numBars; i += 1) {
        var pb = $pb();
        [
          [ w, 0, d * (i - barOff), 1],
          [-w, 0, d * (i - barOff), 1]
        ].forEach(function(vec, i) {
          vec = localMat.transform(vec);
          vec = applyPerspective(vec);
          if (i == 0) {
            pb.moveTo(vec[0], vec[1]);
          } else {
            pb.lineTo(vec[0], vec[1]);
          }
        });
        elms.push({
          $el : $('path').attrs({ d : pb.build(),
            stroke : i == 0? '#f00' : i == numBars - 1? '#00f' :
              i == (numBars - 1) / 2? '#0f0' : '#999',
            'stroke-width' : 2, 'stroke-linejoin' : 'miter',
            fill : 'none', opacity : 0.8 }),
          depth : 1000
        });
      }
    };

    var appendArrowElm = function(elms, globalMat, mat, vec, rot, color) {

      var localMat = $mat4().
        rotateX(rot[0]).rotateY(rot[1]).rotateZ(rot[2]).
        translateX(vec[0]).translateY(vec[1]).translateZ(vec[2]).
        concat(mat).concat(globalMat);

      var transform = function(vec) {
        return applyPerspective(localMat.transform(vec) );
      }

      var sum = [0, 0, 0, 0];
      var r = 0.5;
      var w1 = 0.1;
      var w2 = 0.2;
      var w3 = 0.35;
      var w4 = 0.65;
      var w5 = 0.1;
      var pb = $pb();

      var vec;
      var vec2;

      vec = transform([-r, -r * w4, w1, 1]);
      pb.moveTo(vec[0], vec[1]);
      vec = transform([-r, r, w1, 1]);
      vec2 = transform([r * w5, r, w1, 1]);
      pb.quadTo(vec[0], vec[1], vec2[0], vec2[1]);

      vec = transform([r * w5, r, w2, 1]);
      pb.lineTo(vec[0], vec[1]);
      vec = transform([r * w5 + w3, r, 0, 1]);
      pb.lineTo(vec[0], vec[1]);
      vec = transform([r * w5, r, -w2, 1]);
      pb.lineTo(vec[0], vec[1]);

      vec = transform([r * w5, r, -w1, 1]);
      pb.lineTo(vec[0], vec[1]);
      vec = transform([-r, r, -w1, 1]);
      vec2 = transform([-r, -r * w4, -w1, 1]);
      pb.quadTo(vec[0], vec[1], vec2[0], vec2[1]);

      pb.close();

      elms.push({
        $el : $('path').attrs({ d : pb.build(),
          stroke : color, 'stroke-width' : 2, 'stroke-linejoin' : 'miter',
          fill : '#fff', opacity : 0.8 }),
        depth : 1000//sum[2] / sum[3]
      });
    };

    var overlay = function(cmd) {

      var rots = {
        "L"  : { index : 0 },
        "M"  : { index : 1 },
        "R'" : { index : 2 },

        "L'" : { index : 3 },
        "M'" : { index : 4 },
        "R"  : { index : 5 },

        "F"  : { index : 6 },
        "S"  : { index : 7 },
        "B'" : { index : 8 },

        "F'" : { index : 9 },
        "S'" : { index : 10 },
        "B"  : { index : 11 },

        "U"  : { index : 12 },
        "E'" : { index : 13 },
        "D'" : { index : 14 },

        "U'" : { index : 15 },
        "E"  : { index : 16 },
        "D"  : { index : 17 }
      };

      var rot = rots[cmd];

      if (!rot) {
        return null;
      }

      return function(elms, globalMat) {

        var arrowScale = 2;
        var d = this.cubeDistance;
        var index = 0;

        [
          { vecs : [ [ -d, -d, -d ], [ -d, -d, 0 ], [ -d, -d, d ] ],
            rot : [0, 0, d2r(90)] },
          { vecs : [ [ -d, -d, -d ], [ -d, -d, 0 ], [ -d, -d, d ] ],
            rot : [0, d2r(180), d2r(180)] },
          { vecs : [ [ -d, -d, d ], [ 0, -d, d ], [ d, -d, d ] ],
            rot : [d2r(90), 0, d2r(90)] },
          { vecs : [ [ -d, -d, d ], [ 0, -d, d ], [ d, -d, d ] ],
            rot : [d2r(-90), d2r(90), d2r(90)] },
          { vecs : [ [ -d, -d, d ], [ -d, 0, d ], [ -d, d, d ] ],
            rot : [d2r(90), d2r(90), d2r(180)] },
          { vecs : [ [ -d, -d, d ], [ -d, 0, d ], [ -d, d, d ] ],
            rot : [d2r(-90), d2r(-180), d2r(180)] }
        ].forEach(function(pat) {
          pat.vecs.forEach(function(vec) {
            if (rot.index == index) {
              appendArrowElm(elms, globalMat, $mat4().
                scaleX(arrowScale).scaleY(arrowScale).scaleZ(arrowScale).
                translateX(vec[0]).translateY(vec[1]).translateZ(vec[2]),
                [0, 0, 0], pat.rot, '#000');
            }
            index += 1;
          });
        });
      };
    };

    var execRotation = function() {

      var rotTbl = {
        F : [
          { s : 3, m : 1, c : [0, 9, 18] },
          { s : 4, m : 1, c : [18, 21, 24] },
          { s : 2, m : 1, c : [24, 15, 6] },
          { s : 5, m : 1, c : [6, 3, 0] },
        ],
        S : [
          { s : 3, c : [1, 10, 19] },
          { s : 4, c : [19, 22, 25] },
          { s : 2, c : [25, 16, 7] },
          { s : 5, c : [7, 4, 1] },
        ],
        B : [
          { s : 3, m : 0, c : [20, 11, 2] },
          { s : 5, m : 0, c : [2, 5, 8] },
          { s : 2, m : 0, c : [8, 17, 26] },
          { s : 4, m : 0, c : [26, 23, 20] },
        ],
        L : [
          { s : 3, m : 5, c : [2, 1, 0] },
          { s : 1, m : 5, c : [0, 3, 6] },
          { s : 2, m : 5, c : [6, 7, 8] },
          { s : 0, m : 5, c : [8, 5, 2] },
        ],
        M : [
          { s : 3, c : [11, 10, 9] },
          { s : 1, c : [9, 12, 15] },
          { s : 2, c : [15, 16, 17] },
          { s : 0, c : [17, 14, 11] },
        ],
        R : [
          { s : 3, m : 4, c : [18, 19, 20] },
          { s : 0, m : 4, c : [20, 23, 26] },
          { s : 2, m : 4, c : [26, 25, 24] },
          { s : 1, m : 4, c : [24, 21, 18] },
        ],
        U : [
          { s : 1, m : 3, c : [18, 9, 0] },
          { s : 5, m : 3, c : [0, 1, 2] },
          { s : 0, m : 3, c : [2, 11, 20] },
          { s : 4, m : 3, c : [20, 19, 18] },
        ],
        E : [
          { s : 1, c : [3, 12, 21] },
          { s : 4, c : [21, 22, 23] },
          { s : 0, c : [23, 14, 5] },
          { s : 5, c : [5, 4, 3] },
        ],
        D : [
          { s : 1, m : 2, c : [6, 15, 24] },
          { s : 4, m : 2, c : [24, 25, 26] },
          { s : 0, m : 2, c : [26, 17, 8] },
          { s : 5, m : 2, c : [8, 7, 6] },
        ],
      };

      return function(cmd) {
        // parse
        var parsed = parseCmd(cmd);
        var tbl = rotTbl[parsed.cmd];
        if (tbl) {
          var sbuf = [];
          var mbuf = [];
          tbl.forEach(function(pat) {
            pat.c.forEach(function(i) {
              sbuf.push(model.rectMap[i][pat.s]);
              if (typeof pat.m != 'undefined') {
                mbuf.push(model.rectMap[i][pat.m]);
              }
            });
          });
          var inc = parsed.rev? -1 : 1;
          var index = 0;
          tbl.forEach(function(pat) {
            pat.c.forEach(function(i) {
              model.rectMap[i][pat.s] =
                sbuf[(index + sbuf.length - 3 * inc) % sbuf.length];
              if (mbuf.length) {
                model.rectMap[i][pat.m] =
                  mbuf[(index + mbuf.length - 3 * inc) % mbuf.length];
              }
              index += 1;
            });
          });
        }
      };
    }();

    var execCommand = function(cmd) {
      if (cmd == '0') {
        reset();
      }
      model.rots = rotsForCmd(cmd);
      model.overlay = overlay(cmd);
      update();
    };

    reset();
    update();

    return {
      $el : $s.$el, model : model, reset : reset, update : update,
      execRotation : execRotation, execCommand : execCommand
    };
  };

  return { create : create };
}();
