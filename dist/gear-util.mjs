import w from "./svgtk.mjs";
const z = w.core.extend, b = w.math.getQuadPoints, v = w.pathBuilder, A = w.mat4, q = function(n, e) {
  return Math.sqrt(e * e / (n * n) - 1);
}, g = function(n, e) {
  return function(s) {
    return [
      n * Math.cos(s + e) + n * s * Math.sin(s + e),
      n * Math.sin(s + e) - n * s * Math.cos(s + e)
    ];
  };
}, y = { n: 3, dt: 0.05 }, O = function(n) {
  n = z({ m: 20, z: 20, a: Math.PI * 20 / 180 }, n);
  const e = n.m, s = n.z, u = s * e, h = u - 2.5 * e, r = u + 2 * e;
  let t = u * Math.cos(n.a) / 2;
  t = Math.max(t, h / 2);
  const f = Math.PI * 2 * 0, i = q(t, r / 2), d = g(t, 0)(q(t, u / 2)), M = -Math.atan(d[1] / d[0]), l = v();
  let a, c, I = 0;
  for (let x = 0; x < s; x += 1) {
    for (c = b({
      fn: g(t, M + I),
      min: f,
      max: i,
      n: y.n,
      dt: y.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? x == 0 && l.moveTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    for (I += Math.PI / s, c = b({
      fn: g(t, -M + I),
      min: -i,
      max: f,
      n: y.n,
      dt: y.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? l.lineTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    I += Math.PI / s, function() {
      let m;
      const T = h / 2, P = [];
      m = Math.PI / s * (x * 2 + 1) - M, P.push([T * Math.cos(m), T * Math.sin(m)]), m = Math.PI / s * (x * 2 + 1.5), P.push([T * Math.cos(m), T * Math.sin(m)]), m = Math.PI / s * (x * 2 + 2) + M, P.push([T * Math.cos(m), T * Math.sin(m)]), m = Math.PI / s * (x * 2 + 2) + M, P.push([t * Math.cos(m), t * Math.sin(m)]), l.quadTo(P[0][0], P[0][1], P[1][0], P[1][1]), l.quadTo(P[2][0], P[2][1], P[3][0], P[3][1]);
    }();
  }
  return l.close(), {
    m: e,
    z: s,
    d: u,
    d1: h,
    d2: r,
    r: t,
    tMin: f,
    tMax: i,
    t0: M,
    path: l.build()
  };
}, Q = function(n) {
  n = z({ m: 20, z: 20, a: Math.PI * 20 / 180 }, n);
  const e = n.m, s = n.z, u = s * e, h = u + 2.5 * e, r = u - 2 * e;
  let t = u * Math.cos(n.a) / 2;
  t = Math.max(t, r / 2);
  const f = Math.PI * 2 * 0, i = q(t, h / 2), d = g(t, 0)(q(t, u / 2)), M = -Math.atan(d[1] / d[0]), l = v();
  let a, c, I = 0;
  for (let x = 0; x < s; x += 1) {
    for (c = b({
      fn: g(t, -M + I),
      min: -i,
      max: f,
      n: y.n,
      dt: y.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? x == 0 && l.moveTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    for (I += Math.PI / s, c = b({
      fn: g(t, M + I),
      min: f,
      max: i,
      n: y.n,
      dt: y.dt
    }), a = 0; a < c.length; a += 1)
      a == 0 ? l.lineTo(c[a][0], c[a][1]) : l.quadTo(c[a][0], c[a][1], c[a][2], c[a][3]);
    I += Math.PI / s, function() {
      let m;
      const T = h / 2;
      m = Math.PI / s * (x * 2 + 1.5) - M, l.lineTo(T * Math.cos(m), T * Math.sin(m));
    }();
  }
  return l.close(), {
    m: e,
    z: s,
    d: u,
    d1: h,
    d2: r,
    r: t,
    tMin: f,
    tMax: i,
    t0: M,
    path: l.build()
  };
}, _ = function(n) {
  n = z({
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
    const h = Math.asin((n.w / 2 + n.r3) / (n.r1 + n.r3)), r = n.r1 * Math.cos(h), o = n.r1 * Math.sin(h), t = Math.atan2(o, r);
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
    (function(r) {
      const o = n.r1 * Math.cos(r), t = n.r1 * Math.sin(r), f = (n.r1 + n.r3) * Math.cos(r), i = (n.r1 + n.r3) * Math.sin(r), d = Math.atan2(t - i, o - f), M = Math.atan2(n.w / 2 - i, 0);
      e.push({
        order: 1,
        cx: f,
        cy: i,
        r: n.r3,
        t0: d,
        t1: M
      }), h = M - d;
    })(Math.asin((n.w / 2 + n.r3) / (n.r1 + n.r3))), function(r) {
      const o = n.r1 * Math.cos(r), t = n.r1 * Math.sin(r), f = (n.r1 + n.r3) * Math.cos(r), i = (n.r1 + n.r3) * Math.sin(r), d = Math.atan2(t - i, o - f), M = d - h;
      e.push({
        order: 5,
        cx: f,
        cy: i,
        r: n.r3,
        t0: M,
        t1: d
      });
    }(n.a - Math.asin((n.w / 2 + n.r3) / (n.r1 + n.r3)));
  }(), function() {
    const h = Math.asin((n.w / 2 + n.r4) / (n.r2 - n.r4)), r = n.r2 * Math.cos(h), o = n.r2 * Math.sin(h), t = Math.atan2(o, r);
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
    (function(r) {
      const o = n.r2 * Math.cos(r), t = n.r2 * Math.sin(r), f = (n.r2 - n.r4) * Math.cos(r), i = (n.r2 - n.r4) * Math.sin(r), d = Math.atan2(n.w / 2 - i, 0), M = Math.atan2(t - i, o - f);
      e.push({
        order: 2,
        cx: f,
        cy: i,
        r: n.r4,
        t0: d,
        t1: M
      }), h = M - d;
    })(Math.asin((n.w / 2 + n.r4) / (n.r2 - n.r4))), function(r) {
      const o = n.r2 * Math.cos(r), t = n.r2 * Math.sin(r), f = (n.r2 - n.r4) * Math.cos(r), i = (n.r2 - n.r4) * Math.sin(r), d = Math.atan2(t - i, o - f), M = d + h;
      e.push({
        order: 4,
        cx: f,
        cy: i,
        r: n.r4,
        t0: d,
        t1: M
      });
    }(n.a - Math.asin((n.w / 2 + n.r4) / (n.r2 - n.r4)));
  }(), e.sort(function(h, r) {
    return h.order < r.order ? -1 : 1;
  });
  const s = A().rotateZ(n.offsetAngle), u = v();
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
      o[t] = s.transform([o[t][0], o[t][1]]).concat(s.transform([o[t][2], o[t][3]])), t == 0 ? h.order == 0 ? u.moveTo(o[t][0], o[t][1]) : (h.order == 2 || h.order == 5) && u.lineTo(o[t][0], o[t][1]) : u.quadTo(o[t][0], o[t][1], o[t][2], o[t][3]);
  }), u.close(), { path: u.build() };
};
export {
  O as createGear,
  Q as createInnerGear,
  _ as createPie
};
//# sourceMappingURL=gear-util.mjs.map
