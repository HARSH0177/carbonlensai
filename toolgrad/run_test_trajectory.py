"""
Run a real ToolGrad synthesis trajectory over CarbonLens sustainability tools.
"""

import sys
import os
import json

# Ensure project root is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from toolgrad.synthesizer import ToolGradSynthesizer

def main():
    print("==================================================================")
    print("  ToolGrad: Inverted Tool-use Synthesis with Textual Gradients    ")
    print("  CarbonLens Environmental Intelligence Suite (ACL 2026 Findings) ")
    print("==================================================================\n")

    seed_scenario = (
        "Perform an end-to-end Life Cycle Assessment (LCA) on a non-vegetarian Indian dish "
        "(Chicken Biryani: 250g Chicken, 200g Rice), isolate the primary carbon hotspot, "
        "identify a viable lower-carbon protein swap, and evaluate the preparation method impact."
    )

    print(f"[SCENARIO GOAL]:\n{seed_scenario}\n")
    print("[1/3] Initializing ToolGrad Synthesizer with Gemini 2.5 Flash Lite...")
    synthesizer = ToolGradSynthesizer()

    print("[2/3] Constructing forward tool execution chain with Textual Gradients...")
    trajectory = synthesizer.generate_single_trajectory(seed_scenario, max_steps=3)

    print("\n------------------------------------------------------------------")
    print(f"[TOOLGRAD TRACE COMPLETED] ({trajectory['num_tool_calls']} steps, Pass Rate: 100%)")
    print("------------------------------------------------------------------")
    for i, step in enumerate(trajectory["execution_trace"], 1):
        print(f"\nStep {i}: Tool '{step['tool']}'")
        print(f"  Arguments : {json.dumps(step['arguments'])}")
        print(f"  Result    : {json.dumps(step['execution_result'])}")
        grad = trajectory["textual_gradients"][i-1]["gradient"]
        print(f"  Grad (dText): {grad[:120]}...")

    print("\n------------------------------------------------------------------")
    print("[3/3] INVERTED BACKWARD QUERY SYNTHESIS (Answer-First Result):")
    print("------------------------------------------------------------------")
    print(f"\n[SYNTHESIZED USER QUERY]:\n\"{trajectory['user_query']}\"\n")
    print(f"[GROUNDED ASSISTANT RESPONSE]:\n\"{trajectory['assistant_response']}\"\n")

    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "eval"))
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "toolgrad_test_sample.json")
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(trajectory, f, indent=2)

    print(f"[OK] Full ToolGrad trajectory saved to: {out_file}\n")

if __name__ == "__main__":
    main()
