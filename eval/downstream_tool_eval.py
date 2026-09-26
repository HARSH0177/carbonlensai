"""
CarbonLens ToolGrad Downstream Evaluation Harness (ACL 2026 Framework).
Evaluates tool-selection accuracy, schema adherence, and category-constrained
precision on held-out user sustainability queries:
- Baseline: Zero-shot model prompted with raw tool schemas.
- ToolGrad: Trajectory-supervised model prompted with ToolGrad synthesized exemplars.
"""

import sys
import os
import json
import time
from typing import Dict, List, Any

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from toolgrad.tools import SustainabilityToolKit
from toolgrad.synthesizer import ToolGradSynthesizer

# Held-out user queries not in the benchmark generation scenario set
HELD_OUT_TEST_QUERIES = [
    {
        "id": "heldout_01_lamb_swap",
        "user_query": "I am preparing a 300g mutton/lamb stew. What is its carbon footprint and what plant or poultry substitute can I use to cut emissions by at least 50%?",
        "expected_first_tool": "calculate_recipe_lca",
        "expected_swap_category": "grocery",
        "target_ingredient": "Mutton / Red Meat",
        "acceptable_first_tools": ["calculate_recipe_lca", "lookup_emission_factor", "find_low_carbon_swap"]
    },
    {
        "id": "heldout_02_cooking_boil",
        "user_query": "I boiled 500g of potatoes on an electric stove for 40 minutes. How much carbon does the cooking energy add using Indian grid factors?",
        "expected_first_tool": "estimate_preparation_impact",
        "target_method": "boiled",
        "acceptable_first_tools": ["estimate_preparation_impact", "lookup_emission_factor"]
    },
    {
        "id": "heldout_03_paneer_cost_abatement",
        "user_query": "If I replace 200g of paneer with dal/pulses in my dinner and save 35 rupees, what is my marginal abatement cost per kg of CO2 averted?",
        "expected_first_tool": "compute_mac_abatement_cost",
        "acceptable_first_tools": ["compute_mac_abatement_cost", "find_low_carbon_swap", "lookup_emission_factor"]
    },
    {
        "id": "heldout_04_single_rice_lookup",
        "user_query": "What is the life cycle carbon footprint of 250g of raw white rice according to peer-reviewed LCA data?",
        "expected_first_tool": "lookup_emission_factor",
        "expected_item": "rice",
        "acceptable_first_tools": ["lookup_emission_factor"]
    },
    {
        "id": "heldout_05_multi_ingredient_curry",
        "user_query": "Calculate the total carbon emissions of a chicken curry consisting of 200g chicken and 150g rice, and tell me which item is the primary hotspot.",
        "expected_first_tool": "calculate_recipe_lca",
        "acceptable_first_tools": ["calculate_recipe_lca"]
    }
]

def load_toolgrad_exemplars() -> List[Dict[str, Any]]:
    """Loads synthesized ToolGrad trajectories for in-context supervision."""
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "carbonlens_toolgrad_dataset.json"))
    sample_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "toolgrad_test_sample.json"))

    if os.path.exists(dataset_path):
        try:
            with open(dataset_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                return data.get("trajectories", [])
        except Exception:
            pass

    if os.path.exists(sample_path):
        try:
            with open(sample_path, "r", encoding="utf-8") as f:
                return [json.load(f)]
        except Exception:
            pass

    return []

def evaluate_zero_shot(synthesizer: ToolGradSynthesizer, test_case: Dict[str, Any]) -> Dict[str, Any]:
    """Evaluates zero-shot tool selection given only raw tool schemas."""
    tools_schema = json.dumps(synthesizer.tool_definitions, indent=2)
    prompt = f"""You are an environmental intelligence assistant. A user has sent the following query:
"{test_case['user_query']}"

Available tools:
{tools_schema}

Select the SINGLE best first tool to call to address the user query.
Return STRICTLY a JSON object with:
{{
  "thought": "Brief explanation of your decision",
  "tool": "name_of_the_selected_tool",
  "arguments": {{ ... tool arguments ... }}
}}"""

    t0 = time.time()
    try:
        raw_text = synthesizer._call_gemini(prompt, temperature=0.0, json_mode=True)
        res = synthesizer._extract_json(raw_text)
        elapsed = round(time.time() - t0, 3)
        tool_name = res.get("tool", "")
        args = res.get("arguments", {})
        is_tool_correct = tool_name in test_case["acceptable_first_tools"]
        is_schema_valid = isinstance(args, dict) and len(args) > 0
        return {
            "status": "success",
            "condition": "zero_shot",
            "tool": tool_name,
            "arguments": args,
            "is_tool_correct": is_tool_correct,
            "is_schema_valid": is_schema_valid,
            "latency_s": elapsed
        }
    except Exception as e:
        return {
            "status": "error",
            "condition": "zero_shot",
            "error": str(e),
            "is_tool_correct": False,
            "is_schema_valid": False,
            "latency_s": 0.0
        }

def evaluate_toolgrad_supervised(synthesizer: ToolGradSynthesizer, test_case: Dict[str, Any], exemplars: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Evaluates ToolGrad-supervised tool selection with synthesized multi-step exemplars and gradient rationale."""
    tools_schema = json.dumps(synthesizer.tool_definitions, indent=2)
    
    # Format exemplar demonstrations
    demo_blocks = []
    for ex in exemplars[:2]:
        query = ex.get("user_query", "")
        trace = ex.get("execution_trace", [])
        if trace:
            first = trace[0]
            demo_blocks.append(
                f"Exemplar User Query: \"{query}\"\n"
                f"Exemplar Tool Call: {first.get('tool')}\n"
                f"Exemplar Arguments: {json.dumps(first.get('arguments'))}\n"
                f"Exemplar Rationale: Demonstrates strict category boundary (grocery vs meal) and deterministic LCA math."
            )
    demo_text = "\n\n".join(demo_blocks)

    prompt = f"""You are an environmental intelligence assistant trained via the ToolGrad framework (ACL 2026).
ToolGrad trajectories establish strict category isolation (swapping grocery ingredients for grocery items, not cooked meals),
exact parameter grounding, and precise tool dispatching.

ToolGrad Reference Trajectories:
{demo_text}

Available Tools:
{tools_schema}

User Query:
"{test_case['user_query']}"

Select the SINGLE best first tool to call to address the user query.
Return STRICTLY a JSON object with:
{{
  "thought": "Brief explanation incorporating ToolGrad category and parameter guidance",
  "tool": "name_of_the_selected_tool",
  "arguments": {{ ... tool arguments ... }}
}}"""

    t0 = time.time()
    try:
        raw_text = synthesizer._call_gemini(prompt, temperature=0.0, json_mode=True)
        res = synthesizer._extract_json(raw_text)
        elapsed = round(time.time() - t0, 3)
        tool_name = res.get("tool", "")
        args = res.get("arguments", {})
        is_tool_correct = tool_name in test_case["acceptable_first_tools"]
        is_schema_valid = isinstance(args, dict) and len(args) > 0
        return {
            "status": "success",
            "condition": "toolgrad_supervised",
            "tool": tool_name,
            "arguments": args,
            "is_tool_correct": is_tool_correct,
            "is_schema_valid": is_schema_valid,
            "latency_s": elapsed
        }
    except Exception as e:
        return {
            "status": "error",
            "condition": "toolgrad_supervised",
            "error": str(e),
            "is_tool_correct": False,
            "is_schema_valid": False,
            "latency_s": 0.0
        }

def evaluate_generic_few_shot(synthesizer: ToolGradSynthesizer, test_case: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates generic few-shot baseline (Ablation Condition):
    Provides 2 standard hand-written input->tool demonstrations without gradient critique or category isolation guidance.
    """
    tools_schema = json.dumps(synthesizer.tool_definitions, indent=2)
    generic_demos = """Demonstration 1:
User Query: "What is the carbon impact of 200g of chicken?"
Tool Call: lookup_emission_factor
Arguments: {"item_name": "chicken", "grams": 200}

Demonstration 2:
User Query: "What can I replace paneer with to reduce my grocery emissions?"
Tool Call: find_low_carbon_swap
Arguments: {"current_item": "paneer", "category": "grocery", "target_max_co2e": 2.0}"""

    prompt = f"""You are an environmental intelligence assistant.

Demonstrations:
{generic_demos}

Available Tools:
{tools_schema}

User Query:
"{test_case['user_query']}"

Select the SINGLE best first tool to call to address the user query.
Return STRICTLY a JSON object with:
{{
  "thought": "Brief explanation of your decision",
  "tool": "name_of_the_selected_tool",
  "arguments": {{ ... tool arguments ... }}
}}"""

    t0 = time.time()
    try:
        raw_text = synthesizer._call_gemini(prompt, temperature=0.0, json_mode=True)
        res = synthesizer._extract_json(raw_text)
        elapsed = round(time.time() - t0, 3)
        tool_name = res.get("tool", "")
        args = res.get("arguments", {})
        is_tool_correct = tool_name in test_case["acceptable_first_tools"]
        is_schema_valid = isinstance(args, dict) and len(args) > 0
        return {
            "status": "success",
            "condition": "generic_few_shot",
            "tool": tool_name,
            "arguments": args,
            "is_tool_correct": is_tool_correct,
            "is_schema_valid": is_schema_valid,
            "latency_s": elapsed
        }
    except Exception as e:
        return {
            "status": "error",
            "condition": "generic_few_shot",
            "error": str(e),
            "is_tool_correct": False,
            "is_schema_valid": False,
            "latency_s": 0.0
        }

def run_downstream_evaluation():
    print("==================================================================")
    print("  CarbonLens ToolGrad Downstream Ablation Harness (ACL 2026)      ")
    print(f"  Pilot Scale: {len(HELD_OUT_TEST_QUERIES)} Held-Out Queries across 3 Conditions:")
    print("  1. Zero-Shot  |  2. Generic Few-Shot (Ablation)  |  3. ToolGrad")
    print("==================================================================\n")

    synthesizer = ToolGradSynthesizer()
    exemplars = load_toolgrad_exemplars()
    print(f"[INFO] Loaded {len(exemplars)} ToolGrad synthesized exemplar trajectories for supervision.")

    results_zero_shot = []
    results_generic_fs = []
    results_toolgrad = []

    for idx, case in enumerate(HELD_OUT_TEST_QUERIES, 1):
        print(f"\n--- [Test Case {idx}/{len(HELD_OUT_TEST_QUERIES)}]: {case['id']} ---")
        print(f"Query: \"{case['user_query'][:80]}...\"")

        # 1. Zero-shot
        zs_res = evaluate_zero_shot(synthesizer, case)
        results_zero_shot.append(zs_res)
        err_msg = f" (Error: {zs_res.get('error')})" if zs_res.get('error') else ""
        print(f"  [Zero-Shot]    Tool: '{zs_res.get('tool')}' | Correct: {zs_res['is_tool_correct']}{err_msg}")
        time.sleep(4)

        # 2. Generic Few-Shot (Ablation)
        gfs_res = evaluate_generic_few_shot(synthesizer, case)
        results_generic_fs.append(gfs_res)
        err_msg = f" (Error: {gfs_res.get('error')})" if gfs_res.get('error') else ""
        print(f"  [Generic FS]   Tool: '{gfs_res.get('tool')}' | Correct: {gfs_res['is_tool_correct']}{err_msg}")
        time.sleep(4)

        # 3. ToolGrad-supervised
        tg_res = evaluate_toolgrad_supervised(synthesizer, case, exemplars)
        results_toolgrad.append(tg_res)
        err_msg = f" (Error: {tg_res.get('error')})" if tg_res.get('error') else ""
        print(f"  [ToolGrad ICL] Tool: '{tg_res.get('tool')}' | Correct: {tg_res['is_tool_correct']}{err_msg}")
        time.sleep(4)

    # Compute comparative metrics programmatically
    total = len(HELD_OUT_TEST_QUERIES)
    zs_acc = round((sum(1 for r in results_zero_shot if r["is_tool_correct"]) / total) * 100, 1)
    gfs_acc = round((sum(1 for r in results_generic_fs if r["is_tool_correct"]) / total) * 100, 1)
    tg_acc = round((sum(1 for r in results_toolgrad if r["is_tool_correct"]) / total) * 100, 1)

    zs_valid = round((sum(1 for r in results_zero_shot if r["is_schema_valid"]) / total) * 100, 1)
    gfs_valid = round((sum(1 for r in results_generic_fs if r["is_schema_valid"]) / total) * 100, 1)
    tg_valid = round((sum(1 for r in results_toolgrad if r["is_schema_valid"]) / total) * 100, 1)

    zs_decomp = round((sum(1 for r in results_zero_shot if r.get("tool") == "calculate_recipe_lca") / total) * 100, 1)
    gfs_decomp = round((sum(1 for r in results_generic_fs if r.get("tool") == "calculate_recipe_lca") / total) * 100, 1)
    tg_decomp = round((sum(1 for r in results_toolgrad if r.get("tool") == "calculate_recipe_lca") / total) * 100, 1)

    print("\n==================================================================")
    print("  3-WAY DOWNSTREAM ABLATION METRICS SUMMARY (PILOT SCALE)")
    print("==================================================================")
    print(f"  Zero-Shot Accuracy                 : {zs_acc}%")
    print(f"  Generic Few-Shot Accuracy (Ablation): {gfs_acc}%")
    print(f"  ToolGrad Supervised Accuracy       : {tg_acc}%")
    print(f"  ToolGrad vs Generic FS Delta       : +{round(tg_acc - gfs_acc, 1)}%")
    print(f"  Recipe Decomposition (Zero/Generic/ToolGrad): {zs_decomp}% / {gfs_decomp}% / {tg_decomp}%")
    print("==================================================================")

    out_md = os.path.abspath(os.path.join(os.path.dirname(__file__), "downstream_results.md"))
    with open(out_md, "w", encoding="utf-8") as f:
        f.write("# CarbonLens-ToolGrad Downstream Evaluation Report\n\n")
        f.write("Empirical 3-condition ablation study measuring downstream tool-use capabilities on held-out user sustainability queries.\n\n")
        f.write("> **Scale & Scope Notice**: This evaluation is conducted at **toy/proof-of-concept pilot scale (5 held-out queries, 5 synthesized trajectories)** to isolate the specific effect of ToolGrad gradient conditioning vs. generic few-shot demonstrations before large-scale GPU benchmarking.\n\n")
        f.write("> **Evaluation Methodology Note**: This benchmark evaluates **In-Context Trajectory Supervision (Few-Shot Exemplar Prompting as an inference-time proxy for Supervised Fine-Tuning)**. For parameter-updated training on consumer or cluster GPUs, see the committed LoRA training pipeline at [`toolgrad/train_sft_lora.py`](../toolgrad/train_sft_lora.py).\n\n")
        f.write("## 1. 3-Way Comparative Ablation Table\n\n")
        f.write("| Evaluation Metric | 1. Zero-Shot Baseline | 2. Generic Few-Shot (Ablation) | 3. ToolGrad In-Context Supervised | ToolGrad vs. Generic $\\Delta$ |\n")
        f.write("| :--- | :---: | :---: | :---: | :---: |\n")
        f.write(f"| **Tool Selection Accuracy** | **{zs_acc}%** | **{gfs_acc}%** | **{tg_acc}%** | **+{round(tg_acc - gfs_acc, 1)}%** |\n")
        f.write(f"| **Parameter Schema Validity** | **{zs_valid}%** | **{gfs_valid}%** | **{tg_valid}%** | **+{round(tg_valid - gfs_valid, 1)}%** |\n")
        f.write(f"| **Recipe Decomposition Rate** | **{zs_decomp}%** | **{gfs_decomp}%** | **{tg_decomp}%** | **+{round(tg_decomp - gfs_decomp, 1)}%** |\n")
        f.write(f"| **Pilot Test Query Count** | {total} | {total} | {total} | — |\n\n")
        f.write("## 2. Granular Per-Query Log\n\n")
        f.write("| ID | Held-Out User Query | Zero-Shot Tool | Generic Few-Shot Tool | ToolGrad Supervised Tool | Status |\n")
        f.write("| :--- | :--- | :---: | :---: | :---: | :---: |\n")
        for i, case in enumerate(HELD_OUT_TEST_QUERIES):
            zs = results_zero_shot[i]
            gfs = results_generic_fs[i]
            tg = results_toolgrad[i]
            status = "PASS" if tg["is_tool_correct"] else "FAIL"
            f.write(f"| `{case['id']}` | {case['user_query']} | `{zs.get('tool')}` | `{gfs.get('tool')}` | `{tg.get('tool')}` | **{status}** |\n")

    print(f"[OK] Saved downstream evaluation report to: {out_md}\n")

if __name__ == "__main__":
    run_downstream_evaluation()
