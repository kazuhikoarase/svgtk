declare interface Mat4 extends Mat4Array, Mat4Funcs {
    concat(m: Mat4Array): Mat4;
    transform(m: Mat4Array): Mat4Array;
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
    transpose(): Mat4Array;
    invert(): Mat4;
}

declare const mat4: (m?: Mat4Array) => Mat4;
export default mat4;

declare type Mat4Array = number[];

declare type Mat4Funcs = {
    concat(m: Mat4Array): Mat4;
    transform(m: Mat4Array): Mat4Array;
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
    transpose(): Mat4Array;
    invert(): Mat4;
};

export { }
