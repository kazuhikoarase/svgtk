declare const _default: {
    createGear: (opts: GearOpts) => {
        m: number;
        z: number;
        d: number;
        d1: number;
        d2: number;
        r: number;
        tMin: number;
        tMax: number;
        t0: number;
        path: string;
    };
    createInnerGear: (opts: GearOpts) => {
        m: number;
        z: number;
        d: number;
        d1: number;
        d2: number;
        r: number;
        tMin: number;
        tMax: number;
        t0: number;
        path: string;
    };
    createPie: (opts: PieOpts) => {
        path: string;
    };
};
export default _default;

declare interface GearOpts {
    m: number;
    z: number;
    a: number;
}

declare interface PieOpts {
    r1: number;
    r2: number;
    r3: number;
    r4: number;
    w: number;
    a: number;
    offsetAngle: number;
}

export { }
