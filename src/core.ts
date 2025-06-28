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

type EventListener = (event : {type : string}, detail : any) => void;

export const extend = function(o : any, ...args : any[]) {
  for (let i = 0; i < args.length; i += 1) {
    const a = args[i];
    for (let k in a) {
      o[k] = a[k];
    }
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
