export declare interface DOMWrapper {
    $el: HTMLElement | SVGElement | any;
    on(type: string, l: EventListener): DOMWrapper;
    off(type: string, l: EventListener): DOMWrapper;
    attrs(params: ElementParams): DOMWrapper;
    props(params: ElementParams): DOMWrapper;
    style(params: ElementParams): DOMWrapper;
    append($elm: DOMWrapper): DOMWrapper;
    remove($elm: DOMWrapper): DOMWrapper;
}

export declare const domWrapper: (elm: HTMLElement | SVGElement | string) => DOMWrapper;

declare type ElementParams = {
    [k: string]: any;
};

export declare interface PathBuilder {
    moveTo(x: number, y: number): PathBuilder;
    lineTo(x: number, y: number): PathBuilder;
    quadTo(cx: number, cy: number, x: number, y: number): PathBuilder;
    cubicTo(cx1: number, cy1: number, cx2: number, cy2: number, x: number, y: number): PathBuilder;
    close(): PathBuilder;
    build(): string;
}

export declare const pathBuilder: () => PathBuilder;

export declare interface TranBuilder {
    translate(x: number, y: number): TranBuilder;
    rotate(rad: number): TranBuilder;
    scale(x: number, y: number): TranBuilder;
    skewX(rad: number): TranBuilder;
    skewY(rad: number): TranBuilder;
    build(): string;
}

export declare const tranBuilder: () => TranBuilder;

export { }
