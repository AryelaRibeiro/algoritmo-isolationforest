import { writeFileSync, readFileSync, existsSync } from "fs";

export function saveModel(path: string, forest: any) {
    writeFileSync(path, JSON.stringify({
        timestamp: Date.now(),
        data: forest
    }));
}

export function loadModel(path: string, maxAge: number): any | null {
    if (!existsSync(path)) return null;

    const raw = JSON.parse(readFileSync(path, "utf-8"));

    if (Date.now() - raw.timestamp > maxAge) return null;

    return raw.data;
}