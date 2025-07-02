//
// core
//
// Copyright (c) 2025 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

type EventListener = (event : {type : string}, detail? : any) => void;

type ElementParams = {[k : string] : any};

/*
export const testoo = function<O, K extends keyof O>(o : O, k : K, v : any) => O;

export const testoo  = function(o : O, k : string, v : any) {
  o[k] = v;
  return o;
};
*/


export function testoo<O extends HTMLElement | SVGElement, K extends keyof O>(o : O, k : K, v : O[K]) : O;
export function testoo(o : any, k : string, v : any) {
  o[k] = v;
  return o;
};


type ELType = HTMLElement | SVGElement;

export interface DOMWrapper {
  $el : ELType;
  on(type : string, l : EventListener) : DOMWrapper;
  off(type : string, l : EventListener) : DOMWrapper;
  attrs(params : ElementParams) : DOMWrapper;
  props(params : ElementParams) : DOMWrapper;
  style(params : ElementParams) : DOMWrapper;
  append($elm : DOMWrapper) : DOMWrapper;
  remove($elm : DOMWrapper) : DOMWrapper;
};

export const extend = function(o : any, a : any) {
  for (let k in a) {
    o[k] = a[k];
  }
  return o;
};

export const eventTarget = function() {
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


export const domWrapper = function() {

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
      props: function(this : any, params) {
        for (let k in params) {
          this.$el[k] = params[k];
        }
        return this
      },
      style: function(this : any, params) {
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
