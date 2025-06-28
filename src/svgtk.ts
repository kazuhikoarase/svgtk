//
// svgtk
//
// Copyright (c) 2023 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//


type EventListener = (event : {type : string}, detail : any) => void;
type ElementParams = {[k : string] : any};

interface DOMWrapper {
  $el : HTMLElement | SVGElement;
  on(type : string, l : EventListener) : DOMWrapper;
  off(type : string, l : EventListener) : DOMWrapper;
  attrs(params : ElementParams) : DOMWrapper;
  props(params : ElementParams) : DOMWrapper;
  style(params : ElementParams) : DOMWrapper;
  append($elm : DOMWrapper) : DOMWrapper;
  remove($elm : DOMWrapper) : DOMWrapper;
};

interface PathBuilder {
  moveTo(x : number, y : number) : PathBuilder;
  lineTo(x : number, y : number) : PathBuilder;
  quadTo(cx : number, cy : number, x : number, y : number) : PathBuilder;
  cubicTo(cx1 : number, cy1 : number, cx2 : number, cy2 : number, x : number, y : number) : PathBuilder;
  close() : PathBuilder;
  build() : string;
}

interface TranBuilder {
  translate(x : number, y : number) : TranBuilder;
  rotate(rad : number) : TranBuilder;
  scale(x : number, y : number) : TranBuilder;
  skewX(rad : number) : TranBuilder;
  skewY(rad : number) : TranBuilder;
  build() : string;
}

const extend = function(o : any, ...args : any[]) {
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    for (let k in a) {
      o[k] = a[k];
    }
  }
  return o;
};

const r2d = function(rad : number) { return rad * 180 / Math.PI; };

const eventTarget = function() {
  let listenersMap : { [type : string] : EventListener[]} | null  = null;
  return {
    trigger: function(type : string, detail : any) {
      if (!listenersMap) return;
      const listeners = listenersMap[type];
      if (!listeners) return;
      const event = { type : type };
      listeners.forEach(function(l) {
        l(event, detail);
      });
    },
    on: function(type : string, l : EventListener) {
      listenersMap = (listenersMap || (listenersMap = {}) );
      (listenersMap[type] || (listenersMap[type] = []) ).push(l);
    },
    off: function(type : string, l : EventListener) {
      if (!listenersMap) return;
      const listeners = listenersMap[type];
      if (!listeners) return;
      listenersMap[type] = listeners.filter(function(_l) {
        return _l != l;
      });
    }
  };
};

const domWrapper = function() {

  const svgTagNames : { [tagName : string] : boolean } = {};
  'svg g path rect circle text'.split(/\s+/g).forEach(function(tagName) {
    svgTagNames[tagName] = true;
  });

  return function(elm : HTMLElement | SVGElement | string) : DOMWrapper {
    if (typeof elm == 'string') {
      //elm = elm.toLowerCase();
      elm = svgTagNames[elm]?
          document.createElementNS('http://www.w3.org/2000/svg', elm) :
            document.createElement(elm);
    }
    return {
      $el: elm,
      on: function(type, l) {
        this.$el.addEventListener(type, <any>l);
        return this;
      },
      off: function(type, l) {
        this.$el.removeEventListener(type, <any>l);
        return this;
      },
      attrs: function(params) {
        for (let k in params) {
          this.$el.setAttribute(k, '' + params[k]);
        }
        return this
      },
      props: function(params) {
        for (let k in params) {
          (<any>this).$el[k] = params[k];
        }
        return this
      },
      style: function(params) {
        for (let k in params) {
          (<any>this).$el.style[k] = '' + params[k];
        }
        return this
      },
      append: function($elm) {
        this.$el.appendChild($elm.$el);
        return this;
      },
      remove: function($elm) {
        this.$el.removeChild($elm.$el);
        return this;
      }
    };
  };
}();

const pathBuilder : () => PathBuilder = function() {
  let d = '';
  return {
    moveTo : function(x, y) { d += 'M' + x + ' ' + y; return this; },
    lineTo : function(x, y) { d += 'L' + x + ' ' + y; return this; },
    quadTo : function(cx, cy, x, y) {
      d += 'Q' + cx + ' ' + cy +' ' + x + ' ' + y; return this; },
    cubicTo : function(cx1, cy1, cx2, cy2, x, y) {
      d += 'C' + cx1 + ' ' + cy1 +' ' + cx2 + ' ' + cy2 +' ' +
        x + ' ' + y; return this; },
    close : function() { d += 'Z'; return this; },
    build : function() { return d; }
  };
};


const tranBuilder : () => TranBuilder = function() {
  let t = '';
  return {
    translate : function(x, y) {
      t += 'translate(' + x + ' ' + y + ')'; return this; },
    rotate : function(rad) { t += 'rotate(' + r2d(rad) + ')'; return this; },
    scale : function(x, y) {
      t += 'scale(' + x + ' ' + y + ')'; return this; },
    skewX : function(rad) {
      t += 'skewX(' + r2d(rad) + ')'; return this; },
    skewY : function(rad) {
      t += 'skewY(' + r2d(rad) + ')'; return this; },
    build : function() { return t; }
  };
};

type Mat4Array = number[];

type Mat4Funcs = {
  concat(m : Mat4Array) : Mat4;
  transform(m : Mat4Array) : Mat4Array;
  translateX(t : number) : Mat4;
  translateY(t : number) : Mat4;
  translateZ(t : number) : Mat4;
  scaleX(s : number) : Mat4;
  scaleY(s : number) : Mat4;
  scaleZ(s : number) : Mat4;
  rotateX(r : number) : Mat4;
  rotateY(r : number) : Mat4;
  rotateZ(r : number) : Mat4;
  translate(t : { x : number, y : number, z : number}) : Mat4;
  scale(s : { x : number, y : number, z : number} | number) : Mat4;
}

interface Mat4 extends Mat4Array, Mat4Funcs {
  concat(m : Mat4Array) : Mat4;
  transform(m : Mat4Array) : Mat4Array;
  translateX(t : number) : Mat4;
  translateY(t : number) : Mat4;
  translateZ(t : number) : Mat4;
  scaleX(s : number) : Mat4;
  scaleY(s : number) : Mat4;
  scaleZ(s : number) : Mat4;
  rotateX(r : number) : Mat4;
  rotateY(r : number) : Mat4;
  rotateZ(r : number) : Mat4;
  translate(t : { x : number, y : number, z : number}) : Mat4;
  scale(s : { x : number, y : number, z : number} | number) : Mat4;
}

export const svgtk = function() {

  const mat4 : (m? : Mat4Array) => Mat4 = function() {
    const fn : Mat4Funcs = {
      concat : function(n) {
        const o = [];
        o.length = 16;
        for (let i = 0; i < o.length; i += 1) {
          let v = 0;
          for (let j = 0; j < 4; j += 1) {
            v += (<Mat4>this)[~~(i / 4) * 4 + j] * n[i % 4 + j * 4];
          }
          o[i] = v;
        }
        return mat4(o);
      },
      transform : function(n) {
        const o = [];
        o.length = n.length;
        for (let i = 0; i < o.length; i += 1) {
          let v = 0;
          for (let j = 0; j < n.length; j += 1) {
            v += (<Mat4>this)[j * 4 + i] * n[j];
          }
          o[i] = v;
        }
        return o;
      },
      translateX : function(t) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           t, 0, 0, 1 ]);
      },
      translateY : function(t) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, t, 0, 1 ]);
      },
      translateZ : function(t) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, t, 1 ]);
      },
      scaleX : function(s) {
        return this.concat([
                           s, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1 ]);
      },
      scaleY : function(s) {
        return this.concat([
                           1, 0, 0, 0,
                           0, s, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1 ]);
      },
      scaleZ : function(s) {
        return this.concat([
                           1, 0, 0, 0,
                           0, 1, 0, 0,
                           0, 0, s, 0,
                           0, 0, 0, 1 ]);
      },
      rotateX : function(r) {
        const c = Math.cos(r);
        const s = Math.sin(r);
        return this.concat([
                           1, 0, 0, 0,
                           0, c, s, 0,
                           0,-s, c, 0,
                           0, 0, 0, 1 ]);
      },
      rotateY : function(r) {
        const c = Math.cos(r);
        const s = Math.sin(r);
        return this.concat([
                           c, 0,-s, 0,
                           0, 1, 0, 0,
                           s, 0, c, 0,
                           0, 0, 0, 1 ]);
      },
      rotateZ : function(r) {
        const c = Math.cos(r);
        const s = Math.sin(r);
        return this.concat([
                           c, s, 0, 0,
                          -s, c, 0, 0,
                           0, 0, 1, 0,
                           0, 0, 0, 1 ]);
      },
      translate : function(t) {
        return this
          .translateX(t.x || 0)
          .translateY(t.y || 0)
          .translateZ(t.z || 0);
      },
      scale : function(s) {
        if (typeof s == 'number') {
          return this.scale({ x: s, y: s, z: s });
        }
        return this
          .scaleX(s.x || 1)
          .scaleY(s.y || 1)
          .scaleZ(s.z || 1);
      }
    };
  
    (<any>fn).__proto__ = (<any>[]).__proto__;
  
    const identity : () => Mat4Array = function() {
      return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
    };
  
    return function(m?) {
      m = m || identity();
      (<any>m).__proto__ = fn;
      return <Mat4>m;
    };
  }();

  const inv = function(m : number[]) {
    const det = m[0] * m[3] - m[1] * m[2];
    return [m[3] / det, -m[1] / det, -m[2] / det, m[0] / det];
  };

  const getCrossPoint = function(a : number[], va : number[], b : number[], vb : number[]) {
    const m = inv([va[0], -vb[0], va[1], -vb[1]]);
    const v = [b[0] - a[0], b[1] - a[1]];
    //const st = [m[0] * v[0] + m[1] * v[1], m[2] * v[0] + m[3] * v[1]];
    //return [a[0] + va[0] * st[0], a[1] + va[1] * st[0]];
    const s = m[0] * v[0] + m[1] * v[1];
    return [a[0] + va[0] * s, a[1] + va[1] * s];
  };

  interface QuadPointsOpts {
    fn? : (t : number) => number[];
    min? : number;
    max? : number;
    n? : number;
    dt? : number;
  }

    const getQuadPoints = function(opts : QuadPointsOpts) {

    opts = extend(<QuadPointsOpts>{
      fn : function(t) { return [t, t] },
      min : 0, max : 1, n : 10, dt : 0.1
    }, opts);

    // delta points
    const points = [];
    !function() : any {
      for (let i = 0; i <= opts.n!; i += 1) {
        const t = (opts.max! - opts.min!) * i / opts.n! + opts.min!;
        points.push([opts.fn!(t), opts.fn!(t + opts.dt!)]);
      }
    }();

    const quadPoints = [];
    !function() : any {
      for (let i = 0; i < opts.n!; i += 1) {
        let z = getCrossPoint(
          [points[i][0][0],
           points[i][0][1]],
          [points[i][1][0] - points[i][0][0],
           points[i][1][1] - points[i][0][1]],
          [points[i + 1][0][0],
           points[i + 1][0][1]],
          [points[i + 1][1][0] - points[i + 1][0][0],
           points[i + 1][1][1] - points[i + 1][0][1]]
        );
        if (i == 0) {
          quadPoints.push([points[i][0][0], points[i][0][1]]);
          
        }
        if (isNaN(z[0]) ) {
          z = points[i][0];
        }
        quadPoints.push([z[0], z[1], points[i + 1][0][0], points[i + 1][0][1]]);
      }
    }();
    (<any>quadPoints).points = points;
    return quadPoints;
  };

  return {
    extend : extend,
    eventTarget : eventTarget,
    domWrapper : domWrapper,
    pathBuilder : pathBuilder,
    tranBuilder : tranBuilder,
    math : {
      mat4 : mat4,
      getCrossPoint : getCrossPoint,
      getQuadPoints : getQuadPoints
    }
  };
}();
