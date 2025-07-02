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

export type PathBuilder = {
  moveTo(x : number, y : number) : PathBuilder;
  lineTo(x : number, y : number) : PathBuilder;
  quadTo(cx : number, cy : number, x : number, y : number) : PathBuilder;
  cubicTo(cx1 : number, cy1 : number, cx2 : number, cy2 : number, x : number, y : number) : PathBuilder;
  close() : PathBuilder;
  build() : string;
}

export type TranBuilder = {
  translate(x : number, y : number) : TranBuilder;
  rotate(rad : number) : TranBuilder;
  scale(x : number, y : number) : TranBuilder;
  skewX(rad : number) : TranBuilder;
  skewY(rad : number) : TranBuilder;
  build() : string;
}

export function pathBuilder() : PathBuilder {
  let d = '';
  return {
    moveTo(x, y) { d += 'M' + x + ' ' + y; return this; },
    lineTo(x, y) { d += 'L' + x + ' ' + y; return this; },
    quadTo(cx, cy, x, y) {
      d += 'Q' + cx + ' ' + cy +' ' + x + ' ' + y; return this; },
    cubicTo(cx1, cy1, cx2, cy2, x, y) {
      d += 'C' + cx1 + ' ' + cy1 +' ' + cx2 + ' ' + cy2 +' ' +
        x + ' ' + y; return this; },
    close() { d += 'Z'; return this; },
    build() { return d; }
  };
};

export function tranBuilder() :TranBuilder {
  let t = '';
  return {
    translate(x, y) {
      t += 'translate(' + x + ' ' + y + ')'; return this; },
    rotate(rad) { t += 'rotate(' + math.r2d(rad) + ')'; return this; },
    scale(x, y) {
      t += 'scale(' + x + ' ' + y + ')'; return this; },
    skewX(rad) {
      t += 'skewX(' + math.r2d(rad) + ')'; return this; },
    skewY(rad) {
      t += 'skewY(' + math.r2d(rad) + ')'; return this; },
    build() { return t; }
  };
};
