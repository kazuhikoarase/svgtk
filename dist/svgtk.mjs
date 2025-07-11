function h(t, n, e) {
  return t[n] = e, t;
}
function f(t, n) {
  for (let e in n)
    t[e] = n[e];
  return t;
}
const d = function() {
  let t = null;
  return {
    trigger: function(n, e) {
      if (!t) return;
      const o = t[n];
      if (!o) return;
      const r = { type: n };
      o.forEach(function(i) {
        i(r, e);
      });
    },
    on: function(n, e) {
      t = t || (t = {}), (t[n] || (t[n] = [])).push(e);
    },
    off: function(n, e) {
      if (!t) return;
      const o = t[n];
      o && (t[n] = o.filter(function(r) {
        return r != e;
      }));
    }
  };
}, g = function() {
  const t = {};
  return "svg g path rect circle text".split(/\s+/g).forEach(function(n) {
    t[n] = !0;
  }), function(n) {
    return typeof n == "string" && (n = t[n] ? document.createElementNS("http://www.w3.org/2000/svg", n) : document.createElement(n)), {
      $el: n,
      on: function(e, o) {
        return this.$el.addEventListener(e, o), this;
      },
      off: function(e, o) {
        return this.$el.removeEventListener(e, o), this;
      },
      attrs: function(e) {
        for (let o in e)
          this.$el.setAttribute(o, "" + e[o]);
        return this;
      },
      props: function(e) {
        for (let o in e)
          this.$el[o] = e[o];
        return this;
      },
      style: function(e) {
        for (let o in e)
          this.$el.style[o] = "" + e[o];
        return this;
      },
      append: function(e) {
        return this.$el.appendChild(e.$el), this;
      },
      remove: function(e) {
        return this.$el.removeChild(e.$el), this;
      }
    };
  };
}(), p = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  domWrapper: g,
  eventTarget: d,
  extend: f,
  testoo: h
}, Symbol.toStringTag, { value: "Module" }));
function v(t) {
  return t / 180 * Math.PI;
}
function u(t) {
  return t / Math.PI * 180;
}
function b(t) {
  const n = t[0] * t[3] - t[1] * t[2];
  return [t[3] / n, -t[1] / n, -t[2] / n, t[0] / n];
}
function l(t, n, e, o) {
  const r = b([n[0], -o[0], n[1], -o[1]]), i = [e[0] - t[0], e[1] - t[1]], c = r[0] * i[0] + r[1] * i[1];
  return [t[0] + n[0] * c, t[1] + n[1] * c];
}
function y(t) {
  t = f({
    fn: function(r) {
      return [r, r];
    },
    min: 0,
    max: 1,
    n: 10,
    dt: 0.1
  }, t);
  const n = [];
  (function() {
    for (let r = 0; r <= t.n; r += 1) {
      const i = (t.max - t.min) * r / t.n + t.min;
      n.push([t.fn(i), t.fn(i + t.dt)]);
    }
  })();
  const e = [];
  (function() {
    for (let r = 0; r < t.n; r += 1) {
      let i = l(
        [
          n[r][0][0],
          n[r][0][1]
        ],
        [
          n[r][1][0] - n[r][0][0],
          n[r][1][1] - n[r][0][1]
        ],
        [
          n[r + 1][0][0],
          n[r + 1][0][1]
        ],
        [
          n[r + 1][1][0] - n[r + 1][0][0],
          n[r + 1][1][1] - n[r + 1][0][1]
        ]
      );
      r == 0 && e.push([n[r][0][0], n[r][0][1]]), isNaN(i[0]) && (i = n[r][0]), e.push([i[0], i[1], n[r + 1][0][0], n[r + 1][0][1]]);
    }
  })();
  const o = e;
  return o.points = n, e;
}
const M = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  d2r: v,
  getCrossPoint: l,
  getQuadPoints: y,
  r2d: u
}, Symbol.toStringTag, { value: "Module" })), a = {
  concat: function(t) {
    const n = this, e = [];
    e.length = 16;
    for (let o = 0; o < e.length; o += 1) {
      let r = 0;
      for (let i = 0; i < 4; i += 1)
        r += n[~~(o / 4) * 4 + i] * t[o % 4 + i * 4];
      e[o] = r;
    }
    return s(e);
  },
  transform: function(t) {
    const n = this, e = [];
    e.length = t.length;
    for (let o = 0; o < e.length; o += 1) {
      let r = 0;
      for (let i = 0; i < t.length; i += 1)
        r += n[i * 4 + o] * t[i];
      e[o] = r;
    }
    return e;
  },
  translateX: function(t) {
    return this.concat([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      t,
      0,
      0,
      1
    ]);
  },
  translateY: function(t) {
    return this.concat([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      t,
      0,
      1
    ]);
  },
  translateZ: function(t) {
    return this.concat([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      t,
      1
    ]);
  },
  scaleX: function(t) {
    return this.concat([
      t,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
  },
  scaleY: function(t) {
    return this.concat([
      1,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
  },
  scaleZ: function(t) {
    return this.concat([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      1
    ]);
  },
  rotateX: function(t) {
    const n = Math.cos(t), e = Math.sin(t);
    return this.concat([
      1,
      0,
      0,
      0,
      0,
      n,
      e,
      0,
      0,
      -e,
      n,
      0,
      0,
      0,
      0,
      1
    ]);
  },
  rotateY: function(t) {
    const n = Math.cos(t), e = Math.sin(t);
    return this.concat([
      n,
      0,
      -e,
      0,
      0,
      1,
      0,
      0,
      e,
      0,
      n,
      0,
      0,
      0,
      0,
      1
    ]);
  },
  rotateZ: function(t) {
    const n = Math.cos(t), e = Math.sin(t);
    return this.concat([
      n,
      e,
      0,
      0,
      -e,
      n,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
  },
  translate: function(t) {
    return this.translateX(t.x || 0).translateY(t.y || 0).translateZ(t.z || 0);
  },
  scale: function(t) {
    return typeof t == "number" ? this.scale({ x: t, y: t, z: t }) : this.scaleX(t.x || 1).scaleY(t.y || 1).scaleZ(t.z || 1);
  },
  transpose: function() {
    const t = this;
    return t.map(function(n, e) {
      return t[e % 4 * 4 + ~~(e / 4)];
    });
  },
  invert: function() {
    const t = this, n = [
      t[5] * t[10] * t[15] - t[5] * t[11] * t[14] - t[9] * t[6] * t[15] + t[9] * t[7] * t[14] + t[13] * t[6] * t[11] - t[13] * t[7] * t[10],
      -t[1] * t[10] * t[15] + t[1] * t[11] * t[14] + t[9] * t[2] * t[15] - t[9] * t[3] * t[14] - t[13] * t[2] * t[11] + t[13] * t[3] * t[10],
      t[1] * t[6] * t[15] - t[1] * t[7] * t[14] - t[5] * t[2] * t[15] + t[5] * t[3] * t[14] + t[13] * t[2] * t[7] - t[13] * t[3] * t[6],
      -t[1] * t[6] * t[11] + t[1] * t[7] * t[10] + t[5] * t[2] * t[11] - t[5] * t[3] * t[10] - t[9] * t[2] * t[7] + t[9] * t[3] * t[6],
      -t[4] * t[10] * t[15] + t[4] * t[11] * t[14] + t[8] * t[6] * t[15] - t[8] * t[7] * t[14] - t[12] * t[6] * t[11] + t[12] * t[7] * t[10],
      t[0] * t[10] * t[15] - t[0] * t[11] * t[14] - t[8] * t[2] * t[15] + t[8] * t[3] * t[14] + t[12] * t[2] * t[11] - t[12] * t[3] * t[10],
      -t[0] * t[6] * t[15] + t[0] * t[7] * t[14] + t[4] * t[2] * t[15] - t[4] * t[3] * t[14] - t[12] * t[2] * t[7] + t[12] * t[3] * t[6],
      t[0] * t[6] * t[11] - t[0] * t[7] * t[10] - t[4] * t[2] * t[11] + t[4] * t[3] * t[10] + t[8] * t[2] * t[7] - t[8] * t[3] * t[6],
      t[4] * t[9] * t[15] - t[4] * t[11] * t[13] - t[8] * t[5] * t[15] + t[8] * t[7] * t[13] + t[12] * t[5] * t[11] - t[12] * t[7] * t[9],
      -t[0] * t[9] * t[15] + t[0] * t[11] * t[13] + t[8] * t[1] * t[15] - t[8] * t[3] * t[13] - t[12] * t[1] * t[11] + t[12] * t[3] * t[9],
      t[0] * t[5] * t[15] - t[0] * t[7] * t[13] - t[4] * t[1] * t[15] + t[4] * t[3] * t[13] + t[12] * t[1] * t[7] - t[12] * t[3] * t[5],
      -t[0] * t[5] * t[11] + t[0] * t[7] * t[9] + t[4] * t[1] * t[11] - t[4] * t[3] * t[9] - t[8] * t[1] * t[7] + t[8] * t[3] * t[5],
      -t[4] * t[9] * t[14] + t[4] * t[10] * t[13] + t[8] * t[5] * t[14] - t[8] * t[6] * t[13] - t[12] * t[5] * t[10] + t[12] * t[6] * t[9],
      t[0] * t[9] * t[14] - t[0] * t[10] * t[13] - t[8] * t[1] * t[14] + t[8] * t[2] * t[13] + t[12] * t[1] * t[10] - t[12] * t[2] * t[9],
      -t[0] * t[5] * t[14] + t[0] * t[6] * t[13] + t[4] * t[1] * t[14] - t[4] * t[2] * t[13] - t[12] * t[1] * t[6] + t[12] * t[2] * t[5],
      t[0] * t[5] * t[10] - t[0] * t[6] * t[9] - t[4] * t[1] * t[10] + t[4] * t[2] * t[9] + t[8] * t[1] * t[6] - t[8] * t[2] * t[5]
    ], e = t[0] * n[0] + t[1] * n[4] + t[2] * n[8] + t[3] * n[12];
    return s(n.map(function(o) {
      return o / e;
    }));
  }
};
Object.setPrototypeOf(a, Object.getPrototypeOf(Array));
const _ = function() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};
function s(t) {
  return t = t || _(), Object.setPrototypeOf(t, a), t;
}
function m() {
  let t = "";
  return {
    moveTo(n, e) {
      return t += "M" + n + " " + e, this;
    },
    lineTo(n, e) {
      return t += "L" + n + " " + e, this;
    },
    quadTo(n, e, o, r) {
      return t += "Q" + n + " " + e + " " + o + " " + r, this;
    },
    cubicTo(n, e, o, r, i, c) {
      return t += "C" + n + " " + e + " " + o + " " + r + " " + i + " " + c, this;
    },
    close() {
      return t += "Z", this;
    },
    build() {
      return t;
    }
  };
}
function O() {
  let t = "";
  return {
    translate(n, e) {
      return t += "translate(" + n + " " + e + ")", this;
    },
    rotate(n) {
      return t += "rotate(" + u(n) + ")", this;
    },
    scale(n, e) {
      return t += "scale(" + n + " " + e + ")", this;
    },
    skewX(n) {
      return t += "skewX(" + u(n) + ")", this;
    },
    skewY(n) {
      return t += "skewY(" + u(n) + ")", this;
    },
    build() {
      return t;
    }
  };
}
const j = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  pathBuilder: m,
  tranBuilder: O
}, Symbol.toStringTag, { value: "Module" })), P = {
  core: p,
  math: M,
  util: j,
  mat4: s
};
export {
  P as default
};
//# sourceMappingURL=svgtk.mjs.map
