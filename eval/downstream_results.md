# CarbonLens-ToolGrad Downstream Evaluation Report

Empirical validation of downstream tool-use capabilities on held-out user sustainability queries.

## 1. Comparative Metrics Table

| Evaluation Metric | Zero-Shot Baseline | ToolGrad Supervised | Absolute $\Delta$ |
| :--- | :---: | :---: | :---: |
| **Tool Selection Accuracy** | **100.0%** | **100.0%** | **+0.0%** |
| **Parameter Schema Validity** | **100.0%** | **100.0%** | **+0.0%** |
| **Held-Out Test Queries** | 5 | 5 | — |

## 2. Granular Per-Query Log

| ID | Held-Out User Query | Zero-Shot Tool | ToolGrad Tool | Status |
| :--- | :--- | :---: | :---: | :---: |
| `heldout_01_lamb_swap` | I am preparing a 300g mutton/lamb stew. What is its carbon footprint and what plant or poultry substitute can I use to cut emissions by at least 50%? | `lookup_emission_factor` | `calculate_recipe_lca` | **PASS** |
| `heldout_02_cooking_boil` | I boiled 500g of potatoes on an electric stove for 40 minutes. How much carbon does the cooking energy add using Indian grid factors? | `lookup_emission_factor` | `lookup_emission_factor` | **PASS** |
| `heldout_03_paneer_cost_abatement` | If I replace 200g of paneer with dal/pulses in my dinner and save 35 rupees, what is my marginal abatement cost per kg of CO2 averted? | `lookup_emission_factor` | `lookup_emission_factor` | **PASS** |
| `heldout_04_single_rice_lookup` | What is the life cycle carbon footprint of 250g of raw white rice according to peer-reviewed LCA data? | `lookup_emission_factor` | `lookup_emission_factor` | **PASS** |
| `heldout_05_multi_ingredient_curry` | Calculate the total carbon emissions of a chicken curry consisting of 200g chicken and 150g rice, and tell me which item is the primary hotspot. | `calculate_recipe_lca` | `calculate_recipe_lca` | **PASS** |
