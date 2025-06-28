import { extend as f } from "./core.mjs";
const e = (t) => t / 180 * Math.PI, d = (t) => t / Math.PI * 180, h = function(t) {
  const i = t[0] * t[3] - t[1] * t[2];
  return [t[3] / i, -t[1] / i, -t[2] / i, t[0] / i];
}, u = function(t, i, c, r) {
  const n = h([i[0], -r[0], i[1], -r[1]]), o = [c[0] - t[0], c[1] - t[1]], s = n[0] * o[0] + n[1] * o[1];
  return [t[0] + i[0] * s, t[1] + i[1] * s];
}, P = function(t) {
  t = f({
    fn: function(n) {
      return [n, n];
    },
    min: 0,
    max: 1,
    n: 10,
    dt: 0.1
  }, t);
  const i = [];
  (function() {
    for (let n = 0; n <= t.n; n += 1) {
      const o = (t.max - t.min) * n / t.n + t.min;
      i.push([t.fn(o), t.fn(o + t.dt)]);
    }
  })();
  const c = [];
  (function() {
    for (let n = 0; n < t.n; n += 1) {
      let o = u(
        [
          i[n][0][0],
          i[n][0][1]
        ],
        [
          i[n][1][0] - i[n][0][0],
          i[n][1][1] - i[n][0][1]
        ],
        [
          i[n + 1][0][0],
          i[n + 1][0][1]
        ],
        [
          i[n + 1][1][0] - i[n + 1][0][0],
          i[n + 1][1][1] - i[n + 1][0][1]
        ]
      );
      n == 0 && c.push([i[n][0][0], i[n][0][1]]), isNaN(o[0]) && (o = i[n][0]), c.push([o[0], o[1], i[n + 1][0][0], i[n + 1][0][1]]);
    }
  })();
  const r = c;
  return r.points = i, c;
}, l = {
  r2d: d,
  d2r: e,
  getCrossPoint: u,
  getQuadPoints: P
};
export {
  e as d2r,
  l as default,
  u as getCrossPoint,
  P as getQuadPoints,
  d as r2d
};
//# sourceMappingURL=math.mjs.map
