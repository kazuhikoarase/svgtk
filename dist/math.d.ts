declare const _default: {
    r2d: (rad: number) => number;
    getCrossPoint: (a: number[], va: number[], b: number[], vb: number[]) => number[];
    getQuadPoints: (opts: QuadPointsOpts) => number[][];
};
export default _default;

declare interface QuadPointsOpts {
    fn: (t: number) => number[];
    min: number;
    max: number;
    n: number;
    dt: number;
}

export { }
