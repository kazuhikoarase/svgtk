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

import math from './math';

type ElementParams = {[k : string] : any};

interface DOMWrapper {
  $el : HTMLElement | SVGElement | any;
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
        this.$el.addEventListener(type, l);
        return this;
      },
      off: function(type, l) {
        this.$el.removeEventListener(type, l);
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
          this.$el[k] = params[k];
        }
        return this
      },
      style: function(params) {
        for (let k in params) {
          this.$el.style[k] = '' + params[k];
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
    rotate : function(rad) { t += 'rotate(' + math.r2d(rad) + ')'; return this; },
    scale : function(x, y) {
      t += 'scale(' + x + ' ' + y + ')'; return this; },
    skewX : function(rad) {
      t += 'skewX(' + math.r2d(rad) + ')'; return this; },
    skewY : function(rad) {
      t += 'skewY(' + math.r2d(rad) + ')'; return this; },
    build : function() { return t; }
  };
};

export default {
  domWrapper,
  pathBuilder,
  tranBuilder
};
