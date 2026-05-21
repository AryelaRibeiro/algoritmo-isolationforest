import { Node } from "./Node";

export function buildIsolationTree(
    data: number[][],
    depth: number,
    maxDepth: number
): Node {
    if (data.length <= 1 || depth >= maxDepth) {
        return leaf();
    }

    const feature = randomInt(data[0].length);

    const values = data.map(d => d[feature]);
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) return leaf();

    const threshold = randomBetween(min, max);

    const left = data.filter(d => d[feature] < threshold);
    const right = data.filter(d => d[feature] >= threshold);

    return {
        feature,
        threshold,
        left: buildIsolationTree(left, depth + 1, maxDepth),
        right: buildIsolationTree(right, depth + 1, maxDepth)
    };
}

function leaf(): Node {
    return { feature: null, threshold: null, left: null, right: null };
}

function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function randomBetween(min: number, max: number) {
    return Math.random() * (max - min) + min;
}