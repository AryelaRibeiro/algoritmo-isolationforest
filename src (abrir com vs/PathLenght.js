export function computePathLength(node, point, depth = 0) {
    if (node.feature === null ||
        node.threshold === null ||
        !node.left ||
        !node.right) {
        return depth;
    }
    const value = point[node.feature];
    if (value === undefined) {
        return depth;
    }
    if (value < node.threshold) {
        return computePathLength(node.left, point, depth + 1);
    }
    else {
        return computePathLength(node.right, point, depth + 1);
    }
}
