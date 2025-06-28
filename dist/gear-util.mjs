import { extend as w } from "./core.mjs";
import Q from "./svgtk.mjs";
import b from "./math.mjs";
import v from "./mat4.mjs";
const z = Q.pathBuilder, q = function(t, e) {
  return Math.sqrt(e * e / (t * t) - 1);
}, y = function(t, e) {
  return function(i) {
    return [
      t * Math.cos(i + e) + t * i * Math.sin(i + e),
      t * Math.sin(i + e) - t * i * Math.cos(i + e)
    ];
  };
}, T = { n: 3, dt: 0.05 }, A = function(t) {
  t = w({ m: 20, z: 20, a: Math.PI * 20 / 180 }, t);
  const e = t.m, i = t.z, u = i * e, o = u - 2.5 * e, r = u + 2 * e;
  let n = u * Math.cos(t.a) / 2;
  n = Math.max(n, o / 2);
  const f = Math.PI * 2 * 0, s = q(n, r / 2), d = y(n, 0)(q(n, u / 2)), M = -Math.atan(d[1] / d[0]), l = z();
  let a, c, g = 0;
  for (let x = 0; x < i; x += 1) {
    for (c = b.getQuadPoints({
      fn: y(n, M + g),
      min: f,
      max: s,
      n: T.n,
      dt: T.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? x == 0 && l.moveTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    for (g += Math.PI / i, c = b.getQuadPoints({
      fn: y(n, -M + g),
      min: -s,
      max: f,
      n: T.n,
      dt: T.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? l.lineTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    g += Math.PI / i, function() {
      let m;
      const I = o / 2, P = [];
      m = Math.PI / i * (x * 2 + 1) - M, P.push([I * Math.cos(m), I * Math.sin(m)]), m = Math.PI / i * (x * 2 + 1.5), P.push([I * Math.cos(m), I * Math.sin(m)]), m = Math.PI / i * (x * 2 + 2) + M, P.push([I * Math.cos(m), I * Math.sin(m)]), m = Math.PI / i * (x * 2 + 2) + M, P.push([n * Math.cos(m), n * Math.sin(m)]), l.quadTo(P[0][0], P[0][1], P[1][0], P[1][1]), l.quadTo(P[2][0], P[2][1], P[3][0], P[3][1]);
    }();
  }
  return l.close(), {
    m: e,
    z: i,
    d: u,
    d1: o,
    d2: r,
    r: n,
    tMin: f,
    tMax: s,
    t0: M,
    path: l.build()
  };
}, G = function(t) {
  t = w({ m: 20, z: 20, a: Math.PI * 20 / 180 }, t);
  const e = t.m, i = t.z, u = i * e, o = u + 2.5 * e, r = u - 2 * e;
  let n = u * Math.cos(t.a) / 2;
  n = Math.max(n, r / 2);
  const f = Math.PI * 2 * 0, s = q(n, o / 2), d = y(n, 0)(q(n, u / 2)), M = -Math.atan(d[1] / d[0]), l = z();
  let a, c, g = 0;
  for (let x = 0; x < i; x += 1) {
    for (c = b.getQuadPoints({
      fn: y(n, -M + g),
      min: -s,
      max: f,
      n: T.n,
      dt: T.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? x == 0 && l.moveTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    for (g += Math.PI / i, c = b.getQuadPoints({
      fn: y(n, M + g),
      min: f,
      max: s,
      n: T.n,
      dt: T.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? l.lineTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    g += Math.PI / i, function() {
      let m;
      const I = o / 2;
      m = Math.PI / i * (x * 2 + 1.5) - M, l.lineTo(I * Math.cos(m), I * Math.sin(m));
    }();
  }
  return l.close(), {
    m: e,
    z: i,
    d: u,
    d1: o,
    d2: r,
    r: n,
    tMin: f,
    tMax: s,
    t0: M,
    path: l.build()
  };
}, O = function(t) {
  t = w({
    r1: 100,
    r2: 200,
    r3: 10,
    r4: 10,
    w: 10,
    a: Math.PI / 2,
    offsetAngle: 0
  }, t);
  const e = [];
  (function() {
    const o = Math.asin((t.w / 2 + t.r3) / (t.r1 + t.r3)), r = t.r1 * Math.cos(o), h = t.r1 * Math.sin(o), n = Math.atan2(h, r);
    e.push({
      order: 0,
      cx: 0,
      cy: 0,
      r: t.r1,
      t0: t.a - n,
      t1: n
    });
  })(), function() {
    let o;
    (function(r) {
      const h = t.r1 * Math.cos(r), n = t.r1 * Math.sin(r), f = (t.r1 + t.r3) * Math.cos(r), s = (t.r1 + t.r3) * Math.sin(r), d = Math.atan2(n - s, h - f), M = Math.atan2(t.w / 2 - s, 0);
      e.push({
        order: 1,
        cx: f,
        cy: s,
        r: t.r3,
        t0: d,
        t1: M
      }), o = M - d;
    })(Math.asin((t.w / 2 + t.r3) / (t.r1 + t.r3))), function(r) {
      const h = t.r1 * Math.cos(r), n = t.r1 * Math.sin(r), f = (t.r1 + t.r3) * Math.cos(r), s = (t.r1 + t.r3) * Math.sin(r), d = Math.atan2(n - s, h - f), M = d - o;
      e.push({
        order: 5,
        cx: f,
        cy: s,
        r: t.r3,
        t0: M,
        t1: d
      });
    }(t.a - Math.asin((t.w / 2 + t.r3) / (t.r1 + t.r3)));
  }(), function() {
    const o = Math.asin((t.w / 2 + t.r4) / (t.r2 - t.r4)), r = t.r2 * Math.cos(o), h = t.r2 * Math.sin(o), n = Math.atan2(h, r);
    e.push({
      order: 3,
      cx: 0,
      cy: 0,
      r: t.r2,
      t0: n,
      t1: t.a - n
    });
  }(), function() {
    let o;
    (function(r) {
      const h = t.r2 * Math.cos(r), n = t.r2 * Math.sin(r), f = (t.r2 - t.r4) * Math.cos(r), s = (t.r2 - t.r4) * Math.sin(r), d = Math.atan2(t.w / 2 - s, 0), M = Math.atan2(n - s, h - f);
      e.push({
        order: 2,
        cx: f,
        cy: s,
        r: t.r4,
        t0: d,
        t1: M
      }), o = M - d;
    })(Math.asin((t.w / 2 + t.r4) / (t.r2 - t.r4))), function(r) {
      const h = t.r2 * Math.cos(r), n = t.r2 * Math.sin(r), f = (t.r2 - t.r4) * Math.cos(r), s = (t.r2 - t.r4) * Math.sin(r), d = Math.atan2(n - s, h - f), M = d + o;
      e.push({
        order: 4,
        cx: f,
        cy: s,
        r: t.r4,
        t0: d,
        t1: M
      });
    }(t.a - Math.asin((t.w / 2 + t.r4) / (t.r2 - t.r4)));
  }(), e.sort(function(o, r) {
    return o.order < r.order ? -1 : 1;
  });
  const i = v().rotateZ(t.offsetAngle), u = z();
  return e.forEach(function(o) {
    const r = function(n) {
      return [
        o.r * Math.cos(n) + o.cx,
        o.r * Math.sin(n) + o.cy
      ];
    }, h = b.getQuadPoints({
      fn: r,
      min: o.t0,
      max: o.t1,
      n: 4,
      dt: 0.05
    });
    for (let n = 0; n < h.length; n += 1)
      h[n] = i.transform([h[n][0], h[n][1]]).concat(i.transform([h[n][2], h[n][3]])), n == 0 ? o.order == 0 ? u.moveTo(h[n][0], h[n][1]) : (o.order == 2 || o.order == 5) && u.lineTo(h[n][0], h[n][1]) : u.quadTo(h[n][0], h[n][1], h[n][2], h[n][3]);
  }), u.close(), { path: u.build() };
}, U = {
  createGear: A,
  createInnerGear: G,
  createPie: O
};
export {
  U as default
};
//# sourceMappingURL=gear-util.mjs.map
