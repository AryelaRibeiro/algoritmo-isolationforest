import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { exit } from "node:process";

import { IsolationForest } from "./IsolationForest.ts";

type Point = { x: number; y: number };

const MODEL_PATH = "model.json";
const DATA_PATH = "src/data.json";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

const forest = new IsolationForest(100, 512);

const loaded = loadModelSafe(forest);

if (!loaded) {
    console.log("Treinando modelo...");

    const dataset = loadDataset();

    forest.fit(dataset);

    warmup(forest, dataset, dataset.length <= 3000 ? dataset.length : 3000);

    saveModelSafe(forest);
}

runTests(forest);

function loadDataset(): number[][] {
    if (!existsSync(DATA_PATH)) {
        console.log("Arquivo data.json não encontrado");
        exit();
    }

    const raw = JSON.parse(readFileSync(DATA_PATH, "utf-8")) as Point[];

    return raw.map(p => [p.x, p.y]);
}

function warmup(forest: IsolationForest, data: number[][], steps: number) {
    for (let i = 0; i < steps; i++) {
        forest.process(data[i]);
    }
}

function runTests(forest: IsolationForest) {
    const tests = [
        [1.01, 2.02],   // normal
        [1.11, 2.02],   // normal
        [1.01, 2.22],   // normal
        [2.1, 1],       // borderline
        [-1.1, 1],      // estranho
        [-10, 2000]     // absurdo
    ];

    for (const t of tests) {
        const res = forest.process(t);
        console.log("INPUT:", t, "→", res);
    }
}

function saveModelSafe(forest: any) {
    const data = {
        timestamp: Date.now(),
        model: forest
    };

    writeFileSync(MODEL_PATH, JSON.stringify(data));
}

function loadModelSafe(forest: any): boolean {
    if (!existsSync(MODEL_PATH)) return false;

    const raw = JSON.parse(readFileSync(MODEL_PATH, "utf-8"));

    const age = Date.now() - raw.timestamp;

    if (age > ONE_WEEK) {
        console.log("Modelo expirado");
        return false;
    }

    Object.assign(forest, raw.model);

    console.log("Modelo carregado ✔️");

    return true;
}