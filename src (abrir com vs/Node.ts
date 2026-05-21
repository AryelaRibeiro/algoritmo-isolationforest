export type Node = {
    feature: number | null;
    threshold: number | null;
    left: Node | null;
    right: Node | null;
};