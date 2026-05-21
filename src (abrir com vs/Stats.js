export function mean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
}
export function stdDev(values) {
    const m = mean(values);
    const variance = values.reduce((sum, v) => {
        const d = v - m;
        return sum + d * d;
    }, 0) / values.length;
    return Math.sqrt(variance);
}
export function percentile(values, p) {
    const sorted = [...values].sort((a, b) => b - a);
    const idx = Math.floor(sorted.length * p);
    return sorted[idx];
}
