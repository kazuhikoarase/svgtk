declare namespace core {
    export {
        testoo,
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
    util: typeof util;
    mat4: (m?: mat4.NumArray) => mat4.Mat4;
};
export default _default;

declare interface DOMWrapper {
    $el: ELType;
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

declare type ELType = HTMLElement | SVGElement;

declare type EventListener_2 = (event: {
    type: string;
}, detail?: any) => void;

declare const eventTarget: () => {
    trigger: (type: string, detail: any) => void;
    on: (type: string, l: EventListener_2) => void;
    off: (type: string, l: EventListener_2) => void;
};

declare const extend: (o: any, a: any) => any;

declare const getCrossPoint: (a: number[], va: number[], b: number[], vb: number[]) => number[];

declare const getQuadPoints: (opts: QuadPointsOpts) => number[][];

declare type Mat4 = NumArray & Mat4Funcs;

declare namespace mat4 {
    export {
        NumArray,
        Mat4Funcs,
        Mat4,
        mat4_2 as mat4,
        mat4_2 as default
    }
}

declare const mat4_2: (m?: NumArray) => Mat4;

declare type Mat4Funcs = {
    concat(m: NumArray): Mat4;
    transform(m: NumArray): NumArray;
    translateX(t: number): Mat4;
    translateY(t: number): Mat4;
    translateZ(t: number): Mat4;
    scaleX(s: number): Mat4;
    scaleY(s: number): Mat4;
    scaleZ(s: number): Mat4;
    rotateX(r: number): Mat4;
    rotateY(r: number): Mat4;
    rotateZ(r: number): Mat4;
    translate(t: {
        x: number;
        y: number;
        z: number;
    }): Mat4;
    scale(s: {
        x: number;
        y: number;
        z: number;
    } | number): Mat4;
    transpose(): NumArray;
    invert(): Mat4;
};

declare namespace math {
    export {
        d2r,
        r2d,
        getCrossPoint,
        QuadPointsOpts,
        getQuadPoints
    }
}

declare type NumArray = number[];

declare interface PathBuilder {
    moveTo(x: number, y: number): PathBuilder;
    lineTo(x: number, y: number): PathBuilder;
    quadTo(cx: number, cy: number, x: number, y: number): PathBuilder;
    cubicTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): PathBuilder;
    close(): PathBuilder;
    build(): string;
}

declare const pathBuilder: () => PathBuilder;

declare interface QuadPointsOpts {
    fn: (t: number) => number[];
    min: number;
    max: number;
    n: number;
    dt: number;
}

declare const r2d: (rad: number) => number;

declare function testoo<O extends HTMLElement | SVGElement, K extends keyof O>(o: O, k: K, v: O[K]): O;

declare interface TranBuilder {
    translate(x: number, y: number): TranBuilder;
    rotate(rad: number): TranBuilder;
    scale(x: number, y: number): TranBuilder;
    skewX(rad: number): TranBuilder;
    skewY(rad: number): TranBuilder;
    build(): string;
}

declare const tranBuilder: () => TranBuilder;

declare namespace util {
    export {
        PathBuilder,
        TranBuilder,
        pathBuilder,
        tranBuilder
    }
}

export { }
