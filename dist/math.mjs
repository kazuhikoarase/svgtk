import { extend as f } from "./core.mjs";
const h = (t) => t / 180 * Math.PI, P = (t) => t / Math.PI * 180, s = function(t) {
  const i = t[0] * t[3] - t[1] * t[2];
  return [t[3] / i, -t[1] / i, -t[2] / i, t[0] / i];
}, e = function(t, i, c, r) {
  const n = s([i[0], -r[0], i[1], -r[1]]), o = [c[0] - t[0], c[1] - t[1]], u = n[0] * o[0] + n[1] * o[1];
  return [t[0] + i[0] * u, t[1] + i[1] * u];
}, x = function(t) {
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
      let o = e(
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
};
export {
  h as d2r,
  e as getCrossPoint,
  x as getQuadPoints,
  P as r2d
};
//# sourceMappingURL=math.mjs.map
