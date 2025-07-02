//
// util
//
// Copyright (c) 2025 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//

import * as math from './math';

export interface PathBuilder {
  moveTo(x : number, y : number) : PathBuilder;
  lineTo(x : number, y : number) : PathBuilder;
  quadTo(cx : number, cy : number, x : number, y : number) : PathBuilder;
  cubicTo(cx1 : number, cy1 : number, cx2 : number, cy2 : number, x : number, y : number) : PathBuilder;
  close() : PathBuilder;
  build() : string;
}

export interface TranBuilder {
  translate(x : number, y : number) : TranBuilder;
  rotate(rad : number) : TranBuilder;
  scale(x : number, y : number) : TranBuilder;
  skewX(rad : number) : TranBuilder;
  skewY(rad : number) : TranBuilder;
  build() : string;
}


export const pathBuilder : () => PathBuilder = function() {
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

export const tranBuilder : () => TranBuilder = function() {
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
