export declare type Mat4 = NumArray & Mat4Funcs;

export declare function mat4(m?: NumArray): Mat4;

export declare type Mat4Funcs = {
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

export declare type NumArray = number[];

export { }
