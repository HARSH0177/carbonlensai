# CarbonLens-ToolGrad Downstream Evaluation Report

Empirical validation of downstream tool-use capabilities on held-out user sustainability queries.

> **Evaluation Methodology Note**: This benchmark evaluates **In-Context Trajectory Supervision (Few-Shot Exemplar Prompting as an inference-time proxy for Supervised Fine-Tuning)** against a Zero-Shot raw-schema baseline. For full parameter-updated training on consumer or cluster GPUs, see the committed LoRA training pipeline at [`toolgrad/train_sft_lora.py`](../toolgrad/train_sft_lora.py).

## 1. Comparative Metrics Table

| Evaluation Metric | Zero-Shot Baseline | ToolGrad In-Context Supervised | Absolute $\Delta$ |
| :--- | :---: | :---: | :---: |
| **Tool Selection Accuracy** | **100.0%** | **100.0%** | **+0.0%** |
| **Parameter Schema Validity** | **100.0%** | **100.0%** | **+0.0%** |
| **Recipe Decomposition Rate** | **20.0%** | **40.0%** | **+20.0%** |
| **Held-Out Test Queries** | 5 | 5 | — |

## 2. Granular Per-Query Log

| ID | Held-Out User Query | Zero-Shot Tool | ToolGrad Supervised Tool | Qualitative Behavior | Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| `heldout_01_lamb_swap` | I am preparing a 300g mutton/lamb stew. What is its carbon footprint and what plant or poultry substitute can I use to cut emissions by at least 50%? | `lookup_emission_factor` | `calculate_recipe_lca` | Zero-shot looked up single item; ToolGrad decomposed into composite recipe LCA | **PASS** |
| `heldout_02_cooking_boil` | I boiled 500g of potatoes on an electric stove for 40 minutes. How much carbon does the cooking energy add using Indian grid factors? | `lookup_emission_factor` | `lookup_emission_factor` | Both correctly recognized prerequisite mass lookup before preparation impact calculation | **PASS** |
| `heldout_03_paneer_cost_abatement` | If I replace 200g of paneer with dal/pulses in my dinner and save 35 rupees, what is my marginal abatement cost per kg of CO2 averted? | `lookup_emission_factor` | `lookup_emission_factor` | Both executed necessary baseline factor lookup before MAC difference calculation | **PASS** |
| `heldout_04_single_rice_lookup` | What is the life cycle carbon footprint of 250g of raw white rice according to peer-reviewed LCA data? | `lookup_emission_factor` | `lookup_emission_factor` | Exact single-ingredient factor lookup | **PASS** |
| `heldout_05_multi_ingredient_curry` | Calculate the total carbon emissions of a chicken curry consisting of 200g chicken and 150g rice, and tell me which item is the primary hotspot. | `calculate_recipe_lca` | `calculate_recipe_lca` | Full multi-ingredient recipe LCA dispatch with hotspot detection | **PASS** |

## 3. Findings & Limitations

1. **In-Context vs SFT Distinction**: In-context trajectory prompting demonstrates that ToolGrad exemplars guide models to favor structured multi-ingredient decomposition (`calculate_recipe_lca`) over naive single-factor lookups. However, this is an inference-time prompt comparison. Parameter-level SFT using `toolgrad/train_sft_lora.py` is required to benchmark weight-updated models on standard tool-use benchmarks (e.g. BFCL) as conducted in the original ACL 2026 paper.
2. **Deterministic Prerequisite Resolution**: For queries requiring multi-step chaining (e.g. cooking energy or marginal abatement costs), both models correctly chose baseline factor lookups as the necessary first step because downstream tool schemas require `base_co2e_kg` or `co2e_reduction_kg`.
