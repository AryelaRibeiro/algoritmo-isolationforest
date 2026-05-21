import { buildIsolationTree } from "./TreeBuilder.js";
import { computePathLength } from "./PathLenght.js";
import { sampleWithReplacement } from "./Sample.js";
import { mean, stdDev, percentile } from "./Stats.js";
export class IsolationForest {
    nTrees;
    sampleSize;
    maxBufferSize;
    trees = [];
    buffer = [];
    maxDepth;
    threshold = 0;
    constructor(nTrees = 100, sampleSize = 256, maxBufferSize = 10000) {
        this.nTrees = nTrees;
        this.sampleSize = sampleSize;
        this.maxBufferSize = maxBufferSize;
        this.maxDepth = Math.ceil(Math.log2(sampleSize));
    }
    fit(data) {
        this.trees = [];
        for (let i = 0; i < this.nTrees; i++) {
            const sample = sampleWithReplacement(data, this.sampleSize);
            this.trees.push(buildIsolationTree(sample, 0, this.maxDepth));
        }
        this.buffer = [...data];
        const scores = data.map(p => this.score(p));
        const pThreshold = percentile(scores, 0.01);
        const statThreshold = mean(scores) + 0.5 * stdDev(scores);
        this.threshold = Math.max(pThreshold, statThreshold);
    }
    score(point) {
        const total = this.trees.reduce((sum, tree) => {
            return sum + computePathLength(tree, point);
        }, 0);
        const avgPath = total / this.trees.length;
        return Math.pow(2, -avgPath / this.c(this.sampleSize));
    }
    process(point) {
        const score = this.score(point);
        const isAnomaly = score >= this.threshold;
        if (!isAnomaly)
            this.update(point);
        return { score, isAnomaly };
    }
    update(point) {
        this.buffer.push(point);
        if (this.buffer.length > this.maxBufferSize) {
            this.buffer.shift();
        }
        const sample = sampleWithReplacement(this.buffer, this.sampleSize);
        const newTree = buildIsolationTree(sample, 0, this.maxDepth);
        this.trees.shift();
        this.trees.push(newTree);
    }
    c(n) {
        if (n <= 1)
            return 0;
        return 2 * (Math.log(n - 1) + 0.5772156649) - (2 * (n - 1)) / n;
    }
}
