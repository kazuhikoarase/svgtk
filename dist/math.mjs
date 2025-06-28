import { extend as e } from "./core.mjs";
const s = function(i) {
  return i * 180 / Math.PI;
}, d = function(i) {
  const t = i[0] * i[3] - i[1] * i[2];
  return [i[3] / t, -i[1] / t, -i[2] / t, i[0] / t];
}, f = function(i, t, c, u) {
  const n = d([t[0], -u[0], t[1], -u[1]]), o = [c[0] - i[0], c[1] - i[1]], r = n[0] * o[0] + n[1] * o[1];
  return [i[0] + t[0] * r, i[1] + t[1] * r];
}, h = function(i) {
  i = e({
    fn: function(n) {
      return [n, n];
    },
    min: 0,
    max: 1,
    n: 10,
    dt: 0.1
  }, i);
  const t = [];
  (function() {
    for (let n = 0; n <= i.n; n += 1) {
      const o = (i.max - i.min) * n / i.n + i.min;
      t.push([i.fn(o), i.fn(o + i.dt)]);
    }
  })();
  const c = [];
  (function() {
    for (let n = 0; n < i.n; n += 1) {
      let o = f(
        [
          t[n][0][0],
          t[n][0][1]
        ],
        [
          t[n][1][0] - t[n][0][0],
          t[n][1][1] - t[n][0][1]
        ],
        [
          t[n + 1][0][0],
          t[n + 1][0][1]
        ],
        [
          t[n + 1][1][0] - t[n + 1][0][0],
          t[n + 1][1][1] - t[n + 1][0][1]
        ]
      );
      n == 0 && c.push([t[n][0][0], t[n][0][1]]), isNaN(o[0]) && (o = t[n][0]), c.push([o[0], o[1], t[n + 1][0][0], t[n + 1][0][1]]);
    }
  })();
  const u = c;
  return u.points = t, c;
}, x = {
  r2d: s,
  getCrossPoint: f,
  getQuadPoints: h
};
export {
  x as default
};
//# sourceMappingURL=math.mjs.map
