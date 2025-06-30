import { extend as w } from "./core.mjs";
import { pathBuilder as z } from "./svgtk.mjs";
import { getQuadPoints as b } from "./math.mjs";
import { mat4 as v } from "./mat4.mjs";
const g = function(n, e) {
  return Math.sqrt(e * e / (n * n) - 1);
}, q = function(n, e) {
  return function(i) {
    return [
      n * Math.cos(i + e) + n * i * Math.sin(i + e),
      n * Math.sin(i + e) - n * i * Math.cos(i + e)
    ];
  };
}, y = { n: 3, dt: 0.05 }, B = function(n) {
  n = w({ m: 20, z: 20, a: Math.PI * 20 / 180 }, n);
  const e = n.m, i = n.z, u = i * e, h = u - 2.5 * e, c = u + 2 * e;
  let t = u * Math.cos(n.a) / 2;
  t = Math.max(t, h / 2);
  const f = Math.PI * 2 * 0, M = g(t, c / 2), d = q(t, 0)(g(t, u / 2)), s = -Math.atan(d[1] / d[0]), l = z();
  let a, r, I = 0;
  for (let x = 0; x < i; x += 1) {
    for (r = b({
      fn: q(t, s + I),
      min: f,
      max: M,
      n: y.n,
      dt: y.dt
    }), a = 0; a < r.length; a += 1)
      a == 0 ? x == 0 && l.moveTo(r[a][0], r[a][1]) : l.quadTo(r[a][0], r[a][1], r[a][2], r[a][3]);
    for (I += Math.PI / i, r = b({
      fn: q(t, -s + I),
      min: -M,
      max: f,
      n: y.n,
      dt: y.dt
    }), a = 0; a < r.length; a += 1)
      a == 0 ? l.lineTo(r[a][0], r[a][1]) : l.quadTo(r[a][0], r[a][1], r[a][2], r[a][3]);
    I += Math.PI / i, function() {
      let m;
      const T = h / 2, P = [];
      m = Math.PI / i * (x * 2 + 1) - s, P.push([T * Math.cos(m), T * Math.sin(m)]), m = Math.PI / i * (x * 2 + 1.5), P.push([T * Math.cos(m), T * Math.sin(m)]), m = Math.PI / i * (x * 2 + 2) + s, P.push([T * Math.cos(m), T * Math.sin(m)]), m = Math.PI / i * (x * 2 + 2) + s, P.push([t * Math.cos(m), t * Math.sin(m)]), l.quadTo(P[0][0], P[0][1], P[1][0], P[1][1]), l.quadTo(P[2][0], P[2][1], P[3][0], P[3][1]);
    }();
  }
  return l.close(), {
    m: e,
    z: i,
    d: u,
    d1: h,
    d2: c,
    r: t,
    tMin: f,
    tMax: M,
    t0: s,
    path: l.build()
  };
}, E = function(n) {
  n = w({ m: 20, z: 20, a: Math.PI * 20 / 180 }, n);
  const e = n.m, i = n.z, u = i * e, h = u + 2.5 * e, c = u - 2 * e;
  let t = u * Math.cos(n.a) / 2;
  t = Math.max(t, c / 2);
  const f = Math.PI * 2 * 0, M = g(t, h / 2), d = q(t, 0)(g(t, u / 2)), s = -Math.atan(d[1] / d[0]), l = z();
  let a, r, I = 0;
  for (let x = 0; x < i; x += 1) {
    for (r = b({
      fn: q(t, -s + I),
      min: -M,
      max: f,
      n: y.n,
      dt: y.dt
    }), a = 0; a < r.length; a += 1)
      a == 0 ? x == 0 && l.moveTo(r[a][0], r[a][1]) : l.quadTo(r[a][0], r[a][1], r[a][2], r[a][3]);
    for (I += Math.PI / i, r = b({
      fn: q(t, s + I),
      min: f,
      max: M,
      n: y.n,
      dt: y.dt
    }), a = 0; a < r.length; a += 1)
      a == 0 ? l.lineTo(r[a][0], r[a][1]) : l.quadTo(r[a][0], r[a][1], r[a][2], r[a][3]);
    I += Math.PI / i, function() {
      let m;
      const T = h / 2;
      m = Math.PI / i * (x * 2 + 1.5) - s, l.lineTo(T * Math.cos(m), T * Math.sin(m));
    }();
  }
  return l.close(), {
    m: e,
    z: i,
    d: u,
    d1: h,
    d2: c,
    r: t,
    tMin: f,
    tMax: M,
    t0: s,
    path: l.build()
  };
}, Q = function(n) {
  n = w({
    r1: 100,
    r2: 200,
    r3: 10,
    r4: 10,
    w: 10,
    a: Math.PI / 2,
    offsetAngle: 0
  }, n);
  const e = [];
  (function() {
    const h = Math.asin((n.w / 2 + n.r3) / (n.r1 + n.r3)), c = n.r1 * Math.cos(h), o = n.r1 * Math.sin(h), t = Math.atan2(o, c);
    e.push({
      order: 0,
      cx: 0,
      cy: 0,
      r: n.r1,
      t0: n.a - t,
      t1: t
    });
  })(), function() {
    let h;
    (function(c) {
      const o = n.r1 * Math.cos(c), t = n.r1 * Math.sin(c), f = (n.r1 + n.r3) * Math.cos(c), M = (n.r1 + n.r3) * Math.sin(c), d = Math.atan2(t - M, o - f), s = Math.atan2(n.w / 2 - M, 0);
      e.push({
        order: 1,
        cx: f,
        cy: M,
        r: n.r3,
        t0: d,
        t1: s
      }), h = s - d;
    })(Math.asin((n.w / 2 + n.r3) / (n.r1 + n.r3))), function(c) {
      const o = n.r1 * Math.cos(c), t = n.r1 * Math.sin(c), f = (n.r1 + n.r3) * Math.cos(c), M = (n.r1 + n.r3) * Math.sin(c), d = Math.atan2(t - M, o - f), s = d - h;
      e.push({
        order: 5,
        cx: f,
        cy: M,
        r: n.r3,
        t0: s,
        t1: d
      });
    }(n.a - Math.asin((n.w / 2 + n.r3) / (n.r1 + n.r3)));
  }(), function() {
    const h = Math.asin((n.w / 2 + n.r4) / (n.r2 - n.r4)), c = n.r2 * Math.cos(h), o = n.r2 * Math.sin(h), t = Math.atan2(o, c);
    e.push({
      order: 3,
      cx: 0,
      cy: 0,
      r: n.r2,
      t0: t,
      t1: n.a - t
    });
  }(), function() {
    let h;
    (function(c) {
      const o = n.r2 * Math.cos(c), t = n.r2 * Math.sin(c), f = (n.r2 - n.r4) * Math.cos(c), M = (n.r2 - n.r4) * Math.sin(c), d = Math.atan2(n.w / 2 - M, 0), s = Math.atan2(t - M, o - f);
      e.push({
        order: 2,
        cx: f,
        cy: M,
        r: n.r4,
        t0: d,
        t1: s
      }), h = s - d;
    })(Math.asin((n.w / 2 + n.r4) / (n.r2 - n.r4))), function(c) {
      const o = n.r2 * Math.cos(c), t = n.r2 * Math.sin(c), f = (n.r2 - n.r4) * Math.cos(c), M = (n.r2 - n.r4) * Math.sin(c), d = Math.atan2(t - M, o - f), s = d + h;
      e.push({
        order: 4,
        cx: f,
        cy: M,
        r: n.r4,
        t0: d,
        t1: s
      });
    }(n.a - Math.asin((n.w / 2 + n.r4) / (n.r2 - n.r4)));
  }(), e.sort(function(h, c) {
    return h.order < c.order ? -1 : 1;
  });
  const i = v().rotateZ(n.offsetAngle), u = z();
  return e.forEach(function(h) {
    const o = b({
      fn: function(t) {
        return [
          h.r * Math.cos(t) + h.cx,
          h.r * Math.sin(t) + h.cy
        ];
      },
      min: h.t0,
      max: h.t1,
      n: 4,
      dt: 0.05
    });
    for (let t = 0; t < o.length; t += 1)
      o[t] = i.transform([o[t][0], o[t][1]]).concat(i.transform([o[t][2], o[t][3]])), t == 0 ? h.order == 0 ? u.moveTo(o[t][0], o[t][1]) : (h.order == 2 || h.order == 5) && u.lineTo(o[t][0], o[t][1]) : u.quadTo(o[t][0], o[t][1], o[t][2], o[t][3]);
  }), u.close(), { path: u.build() };
};
export {
  B as createGear,
  E as createInnerGear,
  Q as createPie
};
//# sourceMappingURL=gear-util.mjs.map
