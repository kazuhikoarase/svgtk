declare type EventListener_2 = (event: {
    type: string;
}, detail: any) => void;

export declare const eventTarget: () => {
    trigger: (type: string, detail: any) => void;
    on: (type: string, l: EventListener_2) => void;
    off: (type: string, l: EventListener_2) => void;
};

export declare const extend: (o: any, ...args: any[]) => any;

export { }
