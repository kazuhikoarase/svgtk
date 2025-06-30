export declare const createGear: (opts: GearOpts) => {
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

export declare const createInnerGear: (opts: GearOpts) => {
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

export declare const createPie: (opts: PieOpts) => {
    path: string;
};

export declare interface GearOpts {
    m: number;
    z: number;
    a: number;
}

export declare interface PieOpts {
    r1: number;
    r2: number;
    r3: number;
    r4: number;
    w: number;
    a: number;
    offsetAngle: number;
}

export { }
