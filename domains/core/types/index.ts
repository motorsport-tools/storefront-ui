export type Node = {
    key: string;
    value: {
        label: string;
        counter: number;
        link?: string;
        banner?: string;
        bannerTitle?: string;
    };
    children?: Node[];
    isLeaf: boolean;
};