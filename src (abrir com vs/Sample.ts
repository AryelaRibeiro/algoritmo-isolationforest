export function sampleWithReplacement(
    data: number[][],
    size: number
): number[][] {
    const result: number[][] = [];

    for (let i = 0; i < size; i++) {
        const idx = Math.floor(Math.random() * data.length);
        result.push(data[idx]);
    }

    return result;
}