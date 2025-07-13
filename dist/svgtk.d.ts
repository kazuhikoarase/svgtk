declare namespace core {
    export {
        testoo,
        extend,
        eventTarget,
        domWrapper
    }
}

declare function d2r(deg: number): number;

declare const _default: {
    core: typeof core;
    math: typeof math;
    util: typeof util;
};
export default _default;

declare type DOMWrapper = {
    $el: ELType;
    on(type: string, l: EventListener_2): DOMWrapper;
    off(type: string, l: EventListener_2): DOMWrapper;
    attrs(params: ElementParams): DOMWrapper;
    props(params: ElementParams): DOMWrapper;
    style(params: ElementParams): DOMWrapper;
    append($elm: DOMWrapper): DOMWrapper;
    remove($elm: DOMWrapper): DOMWrapper;
};

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

declare function extend<S, T, U extends S & T>(o: S, a: T): U;

declare function getCrossPoint(a: number[], va: number[], b: number[], vb: number[]): number[];

declare function getQuadPoints(opts: QuadPointsOpts): number[][];

declare namespace math {
    export {
        d2r,
        r2d,
        getCrossPoint,
        getQuadPoints,
        QuadPointsOpts
    }
}

declare type PathBuilder = {
    moveTo(x: number, y: number): PathBuilder;
    lineTo(x: number, y: number): PathBuilder;
    quadTo(cx: number, cy: number, x: number, y: number): PathBuilder;
    cubicTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): PathBuilder;
    close(): PathBuilder;
    build(): string;
};

declare function pathBuilder(): PathBuilder;

declare type QuadPointsOpts = {
    fn: (t: number) => number[];
    min: number;
    max: number;
    n: number;
    dt: number;
};

declare function r2d(rad: number): number;

declare function testoo<O extends HTMLElement | SVGElement, K extends keyof O>(o: O, k: K, v: O[K]): O;

declare type TranBuilder = {
    translate(x: number, y: number): TranBuilder;
    rotate(rad: number): TranBuilder;
    scale(x: number, y: number): TranBuilder;
    skewX(rad: number): TranBuilder;
    skewY(rad: number): TranBuilder;
    build(): string;
};

declare function tranBuilder(): TranBuilder;

declare namespace util {
    export {
        pathBuilder,
        tranBuilder,
        PathBuilder,
        TranBuilder
    }
}

export { }
