const f = function(n, ...t) {
  for (let e = 0; e < t.length; e += 1) {
    const r = t[e];
    for (let i in r)
      n[i] = r[i];
  }
  return n;
}, u = function() {
  let n = null;
  return {
    trigger: function(t, e) {
      if (!n) return;
      const r = n[t];
      if (!r) return;
      const i = { type: t };
      r.forEach(function(o) {
        o(i, e);
      });
    },
    on: function(t, e) {
      n = n || (n = {}), (n[t] || (n[t] = [])).push(e);
    },
    off: function(t, e) {
      if (!n) return;
      const r = n[t];
      r && (n[t] = r.filter(function(i) {
        return i != e;
      }));
    }
  };
};
export {
  u as eventTarget,
  f as extend
};
//# sourceMappingURL=core.mjs.map
