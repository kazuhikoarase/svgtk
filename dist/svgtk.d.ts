import { Mat4 } from './mat4';
import { Mat4Array } from './mat4';
import { PathBuilder } from './svg-util';
import { TranBuilder } from './svg-util';

declare namespace core {
    export {
        DOMWrapper,
        extend,
        eventTarget,
        domWrapper
    }
}

declare const d2r: (deg: number) => number;

declare const _default: {
    core: typeof core;
    math: typeof math;
    mat4: (m?: Mat4Array) => Mat4;
    pathBuilder: () => PathBuilder;
    tranBuilder: () => TranBuilder;
};
export default _default;

declare interface DOMWrapper {
    $el: HTMLElement | SVGElement | any;
    on(type: string, l: EventListener_2): DOMWrapper;
    off(type: string, l: EventListener_2): DOMWrapper;
    attrs(params: ElementParams): DOMWrapper;
    props(params: ElementParams): DOMWrapper;
    style(params: ElementParams): DOMWrapper;
    append($elm: DOMWrapper): DOMWrapper;
    remove($elm: DOMWrapper): DOMWrapper;
}

declare const domWrapper: (elm: HTMLElement | SVGElement | string) => DOMWrapper;

declare type ElementParams = {
    [k: string]: any;
};

declare type EventListener_2 = (event: {
    type: string;
}, detail: any) => void;

declare const eventTarget: () => {
    trigger: (type: string, detail: any) => void;
    on: (type: string, l: EventListener_2) => void;
    off: (type: string, l: EventListener_2) => void;
};

declare const extend: (o: any, ...args: any[]) => any;

declare const getCrossPoint: (a: number[], va: number[], b: number[], vb: number[]) => number[];

declare const getQuadPoints: (opts: QuadPointsOpts) => number[][];

declare namespace math {
    export {
        d2r,
        r2d,
        getCrossPoint,
        QuadPointsOpts,
        getQuadPoints
    }
}

declare interface QuadPointsOpts {
    fn: (t: number) => number[];
    min: number;
    max: number;
    n: number;
    dt: number;
}

declare const r2d: (rad: number) => number;

export { }
