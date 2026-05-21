import { writeFileSync } from "fs";

type Point = { x: number; y: number };

const TOTAL = 10000;

function generateNormal(): Point {
  return {
    x: 1 + (Math.random() - 0.5) * 0.2,
    y: 2 + (Math.random() - 0.5) * 0.2
  };
}

const data: Point[] = [];

for (let i = 0; i < TOTAL; i++) {
  data.push(generateNormal());
}

for (let i = data.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [data[i], data[j]] = [data[j], data[i]];
}

writeFileSync("src/data.json", JSON.stringify(data));

console.log("Gerado data.json SEM anomalias:", data.length);