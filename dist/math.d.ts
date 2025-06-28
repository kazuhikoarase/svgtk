export declare const d2r: (deg: number) => number;

declare const _default: {
    r2d: (rad: number) => number;
    d2r: (deg: number) => number;
    getCrossPoint: (a: number[], va: number[], b: number[], vb: number[]) => number[];
    getQuadPoints: (opts: QuadPointsOpts) => number[][];
};
export default _default;

export declare const getCrossPoint: (a: number[], va: number[], b: number[], vb: number[]) => number[];

export declare const getQuadPoints: (opts: QuadPointsOpts) => number[][];

declare interface QuadPointsOpts {
    fn: (t: number) => number[];
    min: number;
    max: number;
    n: number;
    dt: number;
}

export declare const r2d: (rad: number) => number;

export { }
