# CarbonLens Evaluation Results

Measured performance of CarbonLens deterministic emission-factor estimation against curated ground-truth Life Cycle Assessment (LCA) benchmarks.

- **Generated**: 2026-09-26T10:31:39.644Z
- **Evaluation Set**: `eval/testset.json` (10 benchmark cases)
- **Methodology**: Deterministic item/factor lookup from published agricultural and energy LCA reference databases (Poore & Nemecek 2018, Agribalyse 3.1.1, CEA India v19).

## Summary Metrics

| Metric | Measured Value | Definition / Importance |
| :--- | :--- | :--- |
| **Total Test Cases** | 10 | Real dietary, grocery, and utility scenarios |
| **MAE (Mean Absolute Error)** | **0.67 kg CO₂e** | Average absolute deviation from ground truth |
| **MAPE (Mean Abs % Error)** | **8.95%** | Average percentage error across items |
| **Grade Accuracy (A–E)** | **80%** | Correct classification into carbon tiers |
| **Pairwise Ranking Concordance** | **97.8%** | Accuracy of identifying the lower-carbon alternative for swaps |

## Detailed Benchmark Results

| ID | Case / Item Name | Category | True (kg) | Pred (kg) | Error (%) | True Grade | Pred Grade | Match | LCA Reference |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| `case_01` | Dal Tadka with Steamed Basmati Rice | meal | 0.85 | 0.80 | 5.9% | A | A | [YES] | Poore & Nemecek (2018) Science; Agribalyse 3.1.1 (0.85 kg CO2e / 350g serving) |
| `case_02` | Roti with Mixed Vegetable Curry (Aloo Gobi) | meal | 1.10 | 1.10 | 0.0% | B | B | [YES] | Poore & Nemecek (2018); Indian ICMR diet guidelines (1.10 kg CO2e / 300g serving) |
| `case_03` | Chicken Curry with Rice | meal | 3.40 | 3.20 | 5.9% | C | C | [YES] | Poore & Nemecek (2018); DEFRA Food GHG Database (3.40 kg CO2e / 400g serving) |
| `case_04` | Paneer Butter Masala | meal | 1.80 | 1.80 | 0.0% | B | B | [YES] | Agribalyse dairy life-cycle intensity (1.80 kg CO2e / 350g serving) |
| `case_05` | Mutton Biryani (Bone-in Goat Meat) | meal | 8.50 | 8.50 | 0.0% | E | E | [YES] | Poore & Nemecek (2018) ruminant meat factor (8.50 kg CO2e / 400g serving) |
| `case_06` | Fresh Produce Basket (1kg Onions, 1kg Tomatoes, 1kg Potatoes) | grocery | 1.70 | 1.70 | 0.0% | A | A | [YES] | DEFRA Horticultural crop table (0.50 + 0.80 + 0.40 = 1.70 kg CO2e) |
| `case_07` | Dairy Grocery Basket (1L Milk, 250g Paneer, 500g Curd) | grocery | 10.00 | 6.80 | 32.0% | D | C | [DIFF] | Agribalyse Dairy lifecycle table (3.2 + 5.0 + 1.8 = 10.00 kg CO2e) |
| `case_08` | Staples Basket (1kg Rice, 1kg Wheat Flour, 1kg Dal) | grocery | 7.00 | 3.80 | 45.7% | C | B | [DIFF] | Poore & Nemecek grain & legume table (4.0 + 1.2 + 1.8 = 7.00 kg CO2e) |
| `case_09` | 100 kWh Monthly Residential Grid Power | energy | 82.00 | 82.00 | 0.0% | D | D | [YES] | Central Electricity Authority (CEA) India CO2 baseline database v19 (~0.82 kg/kWh) |
| `case_10` | AC Usage (6 Hours Daily Cooling) | energy | 1.20 | 1.20 | 0.0% | A | A | [YES] | 1.5 Ton 3-star Inverter AC ~1.2 kWh/hr x 0.82 kg/kWh CEA grid factor |

## Known Limitations & Evaluation Boundary

1. **Volume & Portion Estimation**: Without physical scales or 3D depth sensors, visual zero-shot extraction estimates standard single-serving portions. Actual emissions scale proportionally with portion mass.
2. **Hidden Ingredients**: Food prepared with excess butter, ghee, or hidden oils can have higher real life-cycle intensities than visible surface ingredients indicate.
3. **Regional Grid Variations**: Energy factors use the Indian national average (~0.82 kg CO₂e/kWh); state-specific coal-vs-renewable mixes vary between 0.55 and 0.95 kg/kWh.
