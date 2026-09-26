"""
CarbonLens ToolGrad Batch Benchmark Generator (ACL 2026 Framework).
Generates verified multi-step tool-use trajectories using the Answer-First paradigm with Textual Gradients.
"""

import sys
import os
import json
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from toolgrad.synthesizer import ToolGradSynthesizer

SCENARIOS = [
    {
        "id": "scenario_01_poultry_biryani",
        "domain": "Dietary / Non-Vegetarian",
        "goal": "Analyze a Chicken Biryani recipe (250g Chicken, 200g Rice), isolate the carbon hotspot, recommend a plant-based swap under 1.0 kg CO2e, and evaluate 35-minute curry preparation overhead using CEA grid factors."
    },
    {
        "id": "scenario_02_dairy_paneer",
        "domain": "Dietary / Vegetarian Dairy",
        "goal": "Audit a North Indian meal (200g Paneer Butter Masala, 150g Roti), isolate dairy footprint, find a legume/dal substitute under 1.0 kg CO2e, and calculate Marginal Abatement Cost (MAC) assuming INR 40 price savings."
    },
    {
        "id": "scenario_03_mutton_redmeat",
        "domain": "Dietary / Red Meat Abatement",
        "goal": "Analyze a high-emission Mutton Curry dish (250g Mutton, 150g Rice), quantify emissions reduction when swapping to poultry or pulses, and calculate 40-minute simmering energy consumption."
    },
    {
        "id": "scenario_04_weekly_staples",
        "domain": "Grocery / Household Staples",
        "goal": "Evaluate weekly grocery staples (1kg Rice, 1kg Wheat Flour, 500g Mustard Oil), identify the single highest emission item, and find a regional low-carbon staple alternative."
    },
    {
        "id": "scenario_05_south_indian_vegan",
        "domain": "Dietary / Plant-Based",
        "goal": "Audit a South Indian breakfast (150g Dosa, 150g Sambar, 50g Coconut Chutney), verify low-carbon status against composite meals, and calculate tree offset equivalence."
    },
    {
        "id": "scenario_06_fast_food_takeout",
        "domain": "Dietary / Urban Takeout",
        "goal": "Analyze an urban fast-food meal (Chicken Burger 200g, French Fries 150g), quantify deep-frying cooking overhead, and evaluate a grilled or vegetable burger alternative."
    },
    {
        "id": "scenario_07_tea_snack",
        "domain": "Snacks & Beverages",
        "goal": "Evaluate an evening snack (150ml Dairy Milk Tea, 100g Samosa), determine the dairy versus frying emission contributions, and find a lower-carbon beverage swap."
    },
    {
        "id": "scenario_08_coastal_fish",
        "domain": "Dietary / Seafood",
        "goal": "Audit a coastal fish curry meal (200g Fish Raw, 200g Rice), evaluate against livestock protein baselines, and compute 25-minute stove preparation impact."
    },
    {
        "id": "scenario_09_household_ac_cooling",
        "domain": "Household Energy / Cooling",
        "goal": "Audit 8 hours of daily AC cooling usage (1.2 kg CO2e/hr baseline), calculate monthly footprint across 30 days, and compute abatement potential from setting thermostat 2°C higher."
    },
    {
        "id": "scenario_10_residential_grid_power",
        "domain": "Household Energy / Utility",
        "goal": "Analyze 100 kWh monthly residential electricity consumption under the CEA India national grid factor (0.716 kg CO2e/kWh), and evaluate Marginal Abatement Cost of 25% solar offset."
    }
]

def generate_benchmark(num_scenarios: int = 5):
    print("==================================================================")
    print("  CarbonLens-ToolGrad Benchmark Generation (ACL 2026 Framework)   ")
    print(f"  Target: {min(num_scenarios, len(SCENARIOS))} Ground-Truth Agentic Trajectories")
    print("==================================================================\n")

    synthesizer = ToolGradSynthesizer()
    trajectories = []
    total_steps = 0
    successful_steps = 0

    for idx, item in enumerate(SCENARIOS[:num_scenarios], 1):
        print(f"\n--- [Trajectory {idx}/{num_scenarios}]: {item['id']} ({item['domain']}) ---")
        print(f"Goal: {item['goal']}")

        try:
            traj = synthesizer.generate_single_trajectory(item['goal'], max_steps=3)
            traj["id"] = item["id"]
            traj["domain"] = item["domain"]
            
            # Count steps
            n_steps = len(traj["execution_trace"])
            total_steps += n_steps
            successful_steps += sum(1 for s in traj["execution_trace"] if s["execution_result"].get("status") == "success")

            trajectories.append(traj)
            print(f"[SUCCESS] Trajectory {idx} synthesized with {n_steps} steps.")
            print(f"User Query: \"{traj['user_query'][:110]}...\"")
        except Exception as e:
            print(f"[ERROR] Failed synthesizing {item['id']}: {e}")

        # Pacing between scenarios to respect API quota
        time.sleep(15)

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "eval"))
    os.makedirs(out_dir, exist_ok=True)
    out_json = os.path.join(out_dir, "carbonlens_toolgrad_dataset.json")
    out_report = os.path.join(out_dir, "toolgrad_benchmark_report.md")

    pass_rate = round((successful_steps / total_steps) * 100, 1) if total_steps > 0 else 0.0

    dataset_payload = {
        "framework": "ToolGrad: Efficient Tool-use Dataset Generation with Textual Gradients (ACL 2026 Findings)",
        "citation": "Zhou, Uehara, Zhang, Zhou, Gu, Du, Xu, Harada (Findings of ACL 2026)",
        "benchmark_name": "CarbonLens-ToolGrad-Benchmark",
        "total_trajectories": len(trajectories),
        "total_tool_calls": total_steps,
        "tool_execution_pass_rate_pct": pass_rate,
        "trajectories": trajectories
    }

    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(dataset_payload, f, indent=2)

    # Generate Markdown summary report
    with open(out_report, "w", encoding="utf-8") as f:
        f.write("# CarbonLens-ToolGrad Benchmark Report\n\n")
        f.write("Generated using the **ToolGrad framework** (*Zhou, Du [Google], Xu [Google] et al., Findings of ACL 2026*).\n\n")
        f.write(f"- **Total Trajectories Evaluated**: {len(trajectories)}\n")
        f.write(f"- **Total Multi-Step Tool Invocations**: {total_steps}\n")
        f.write(f"- **Tool Execution Pass Rate**: {pass_rate}%\n")
        f.write(f"- **Deterministic LCA Sources**: Poore & Nemecek (2018), Agribalyse 3.1.1, CEA India CO2 Baseline Database (0.716 kg/kWh), Frankowska et al. (2020) *Nature Food*.\n\n")
        f.write("## Trajectory Summary Table\n\n")
        f.write("| ID | Domain | Steps | Synthesized User Intent | Identified Hotspot / Intervention |\n")
        f.write("| :--- | :--- | :---: | :--- | :--- |\n")
        for t in trajectories:
            first_tool = t["execution_trace"][0]["tool"] if t["execution_trace"] else "N/A"
            query_preview = t["user_query"][:80] + "..." if len(t["user_query"]) > 80 else t["user_query"]
            f.write(f"| `{t['id']}` | {t.get('domain', 'General')} | {t['num_tool_calls']} | {query_preview} | First action: `{first_tool}` |\n")

    print(f"\n==================================================================")
    print(f"  [COMPLETED] Saved {len(trajectories)} trajectories to: {out_json}")
    print(f"  [COMPLETED] Generated formal benchmark report: {out_report}")
    print(f"==================================================================")

if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    generate_benchmark(count)
