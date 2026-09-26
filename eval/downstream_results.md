# CarbonLens-ToolGrad Downstream Evaluation Report

Empirical 3-condition ablation study measuring downstream tool-use capabilities on held-out user sustainability queries.

> **Scale & Scope Notice**: This evaluation is conducted at **toy/proof-of-concept pilot scale (5 held-out queries, 5 synthesized trajectories)** to isolate the specific effect of ToolGrad gradient conditioning vs. generic few-shot demonstrations before large-scale GPU benchmarking.

> **Evaluation Methodology Note**: This benchmark evaluates **In-Context Trajectory Supervision (Few-Shot Exemplar Prompting as an inference-time proxy for Supervised Fine-Tuning)**. For parameter-updated training on consumer or cluster GPUs, see the committed LoRA training pipeline at [`toolgrad/train_sft_lora.py`](../toolgrad/train_sft_lora.py).

## 1. 3-Way Comparative Ablation Table

| Evaluation Metric | 1. Zero-Shot Baseline | 2. Generic Few-Shot (Ablation) | 3. ToolGrad In-Context Supervised | ToolGrad vs. Generic $\Delta$ |
| :--- | :---: | :---: | :---: | :---: |
| **Tool Selection Accuracy** | **100.0%** | **100.0%** | **100.0%** | **+0.0%** |
| **Parameter Schema Validity** | **100.0%** | **100.0%** | **100.0%** | **+0.0%** |
| **Recipe Decomposition Rate** | **20.0%** | **40.0%** | **40.0%** | **+0.0%** |
| **Pilot Test Query Count** | 5 | 5 | 5 | — |

## 2. Granular Per-Query Log

| ID | Held-Out User Query | Zero-Shot Tool | Generic Few-Shot Tool | ToolGrad Supervised Tool | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `heldout_01_lamb_swap` | I am preparing a 300g mutton/lamb stew. What is its carbon footprint and what plant or poultry substitute can I use to cut emissions by at least 50%? | `lookup_emission_factor` | `calculate_recipe_lca` | `calculate_recipe_lca` | **PASS** |
| `heldout_02_cooking_boil` | I boiled 500g of potatoes on an electric stove for 40 minutes. How much carbon does the cooking energy add using Indian grid factors? | `lookup_emission_factor` | `lookup_emission_factor` | `lookup_emission_factor` | **PASS** |
| `heldout_03_paneer_cost_abatement` | If I replace 200g of paneer with dal/pulses in my dinner and save 35 rupees, what is my marginal abatement cost per kg of CO2 averted? | `lookup_emission_factor` | `lookup_emission_factor` | `lookup_emission_factor` | **PASS** |
| `heldout_04_single_rice_lookup` | What is the life cycle carbon footprint of 250g of raw white rice according to peer-reviewed LCA data? | `lookup_emission_factor` | `lookup_emission_factor` | `lookup_emission_factor` | **PASS** |
| `heldout_05_multi_ingredient_curry` | Calculate the total carbon emissions of a chicken curry consisting of 200g chicken and 150g rice, and tell me which item is the primary hotspot. | `calculate_recipe_lca` | `calculate_recipe_lca` | `calculate_recipe_lca` | **PASS** |
