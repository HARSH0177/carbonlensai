# CarbonLens-ToolGrad Benchmark Report

Generated using the **ToolGrad framework** (*Zhou, Du [Google], Xu [Google] et al., Findings of ACL 2026*).

- **Total Trajectories Evaluated**: 5
- **Total Multi-Step Tool Invocations**: 15
- **Tool Execution Pass Rate**: 100.0%
- **Deterministic LCA Sources**: Poore & Nemecek (2018), Agribalyse 3.1.1, CEA India CO2 Baseline Database (0.716 kg/kWh), Frankowska et al. (2020) *Nature Food*.

## Trajectory Summary Table

| ID | Domain | Steps | Synthesized User Intent | Identified Hotspot / Intervention |
| :--- | :--- | :---: | :--- | :--- |
| `scenario_01_poultry_biryani` | Dietary / Non-Vegetarian | 3 | Could you analyze the carbon footprint of my Chicken Biryani made with 250g of c... | First action: `calculate_recipe_lca` |
| `scenario_02_dairy_paneer` | Dietary / Vegetarian Dairy | 3 | Can you audit the carbon footprint of my standard North Indian dinner consisting... | First action: `calculate_recipe_lca` |
| `scenario_03_mutton_redmeat` | Dietary / Red Meat Abatement | 3 | I am planning to cook a traditional Mutton Curry with Rice for dinner tonight, w... | First action: `calculate_recipe_lca` |
| `scenario_04_weekly_staples` | Grocery / Household Staples | 3 | Could you evaluate the carbon footprint of my weekly grocery staples consisting ... | First action: `calculate_recipe_lca` |
| `scenario_05_south_indian_vegan` | Dietary / Plant-Based | 3 | I want to audit the carbon footprint of a traditional South Indian breakfast con... | First action: `calculate_recipe_lca` |
