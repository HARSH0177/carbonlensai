import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { estimateFromItems, getGrade } from '../src/services/carbon-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testsetPath = path.join(__dirname, 'testset.json');
const resultsPath = path.join(__dirname, 'results.md');

if (!fs.existsSync(testsetPath)) {
  console.error(`[ERROR] Testset file not found at: ${testsetPath}`);
  process.exit(1);
}

const rawData = fs.readFileSync(testsetPath, 'utf8');
const testCases = JSON.parse(rawData);

console.log(`[EVAL] Loaded ${testCases.length} ground-truth test cases.`);

let totalAbsPctError = 0;
let totalAbsError = 0;
let correctGrades = 0;
const evaluatedCases = [];

for (const tc of testCases) {
  const predKg = parseFloat(estimateFromItems(tc.items, tc.category).toFixed(2));
  const predGrade = getGrade(predKg, tc.category);
  const absError = Math.abs(predKg - tc.trueCarbonKg);
  const pctError = tc.trueCarbonKg > 0 ? (absError / tc.trueCarbonKg) * 100 : 0;
  const gradeMatch = predGrade === tc.trueGrade;

  totalAbsError += absError;
  totalAbsPctError += pctError;
  if (gradeMatch) correctGrades++;

  evaluatedCases.push({
    ...tc,
    predKg,
    predGrade,
    absError: parseFloat(absError.toFixed(2)),
    pctError: parseFloat(pctError.toFixed(2)),
    gradeMatch
  });
}

const n = testCases.length;
const mape = parseFloat((totalAbsPctError / n).toFixed(2));
const mae = parseFloat((totalAbsError / n).toFixed(2));
const gradeAccuracy = parseFloat(((correctGrades / n) * 100).toFixed(1));

// Compute pairwise ranking accuracy (does lower true carbon predict lower estimated carbon?)
let concordantPairs = 0;
let totalPairs = 0;

for (let i = 0; i < evaluatedCases.length; i++) {
  for (let j = i + 1; j < evaluatedCases.length; j++) {
    const a = evaluatedCases[i];
    const b = evaluatedCases[j];
    if (a.trueCarbonKg !== b.trueCarbonKg) {
      totalPairs++;
      const trueDiff = a.trueCarbonKg - b.trueCarbonKg;
      const predDiff = a.predKg - b.predKg;
      if ((trueDiff > 0 && predDiff > 0) || (trueDiff < 0 && predDiff < 0)) {
        concordantPairs++;
      }
    }
  }
}

const pairwiseAccuracy = totalPairs > 0 ? parseFloat(((concordantPairs / totalPairs) * 100).toFixed(1)) : 100;

console.log('--------------------------------------------------');
console.log(`Evaluated Cases       : ${n}`);
console.log(`Sum of Abs Error (kg) : ${parseFloat(totalAbsError.toFixed(4))} kg`);
console.log(`MAE (kg CO2e)         : ${mae}`);
console.log(`Sum of Abs % Error    : ${parseFloat(totalAbsPctError.toFixed(2))}%`);
console.log(`MAPE (%)              : ${mape}%`);
console.log(`Grade Accuracy (%)    : ${gradeAccuracy}% (${correctGrades}/${n})`);
console.log(`Pairwise Ranking Acc  : ${pairwiseAccuracy}% (${concordantPairs}/${totalPairs})`);
console.log('--------------------------------------------------');

// Generate results.md
let markdown = `# CarbonLens Evaluation Results

Measured performance of CarbonLens deterministic emission-factor estimation against curated ground-truth Life Cycle Assessment (LCA) benchmarks.

- **Generated**: ${new Date().toISOString()}
- **Evaluation Set**: \`eval/testset.json\` (${n} benchmark cases)
- **Methodology**: Deterministic item/factor lookup from published agricultural and energy LCA reference databases (Poore & Nemecek 2018, Agribalyse 3.1.1, CEA India v19).

## Summary Metrics

| Metric | Measured Value | Definition / Importance |
| :--- | :--- | :--- |
| **Total Test Cases** | ${n} | Real dietary, grocery, and utility scenarios |
| **MAE (Mean Absolute Error)** | **${mae} kg CO₂e** | Average absolute deviation from ground truth |
| **MAPE (Mean Abs % Error)** | **${mape}%** | Average percentage error across items |
| **Grade Accuracy (A–E)** | **${gradeAccuracy}%** | Correct classification into carbon tiers |
| **Pairwise Ranking Concordance** | **${pairwiseAccuracy}%** | Accuracy of identifying the lower-carbon alternative for swaps |

## Detailed Benchmark Results

| ID | Case / Item Name | Category | True (kg) | Pred (kg) | Error (%) | True Grade | Pred Grade | Match | LCA Reference |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
`;

for (const c of evaluatedCases) {
  markdown += `| \`${c.id}\` | ${c.name} | ${c.category} | ${c.trueCarbonKg.toFixed(2)} | ${c.predKg.toFixed(2)} | ${c.pctError.toFixed(1)}% | ${c.trueGrade} | ${c.predGrade} | ${c.gradeMatch ? '[YES]' : '[DIFF]'} | ${c.sourceLCA} |\n`;
}

markdown += `
## Known Limitations & Evaluation Boundary

1. **Volume & Portion Estimation**: Without physical scales or 3D depth sensors, visual zero-shot extraction estimates standard single-serving portions. Actual emissions scale proportionally with portion mass.
2. **Hidden Ingredients**: Food prepared with excess butter, ghee, or hidden oils can have higher real life-cycle intensities than visible surface ingredients indicate.
3. **Regional Grid Variations**: Energy factors use the Indian national average (~0.82 kg CO₂e/kWh); state-specific coal-vs-renewable mixes vary between 0.55 and 0.95 kg/kWh.
`;

fs.writeFileSync(resultsPath, markdown, 'utf8');
console.log(`[EVAL] Results written to: ${resultsPath}`);
