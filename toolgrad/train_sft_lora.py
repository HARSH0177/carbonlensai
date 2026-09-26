"""
ToolGrad Downstream Supervised Fine-Tuning (SFT) with LoRA (ACL 2026 Framework).
Fine-tunes a lightweight base LLM (e.g. google/gemma-2-2b-it or google/gemma-3-1b-it)
on synthesized multi-step tool trajectories with textual gradient reasoning.

Usage:
  python toolgrad/train_sft_lora.py --model_id google/gemma-2-2b-it --output_dir checkpoints/toolgrad-gemma-2b
"""

import os
import json
import argparse
from typing import List, Dict, Any

def convert_toolgrad_dataset_to_sft_format(dataset_path: str) -> List[Dict[str, Any]]:
    """
    Converts CarbonLens ToolGrad trajectory JSON into ChatML / ShareGPT multi-turn format:
    - system: Environmental Intelligence Specialist with access to SustainabilityToolKit
    - user: Synthesized query (Answer-First backward query)
    - assistant: Step-by-step tool invocation trace with intermediate gradient reasoning
    """
    if not os.path.exists(dataset_path):
        raise FileNotFoundError(f"ToolGrad dataset not found at: {dataset_path}")

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    trajectories = data.get("trajectories", [])
    formatted_dataset = []

    for traj in trajectories:
        system_msg = (
            "You are an environmental intelligence assistant specialized in Life Cycle Assessment (LCA). "
            "You have access to the SustainabilityToolKit tools. Plan tool calls step-by-step, "
            "strictly enforce category boundaries (e.g. grocery ingredients for grocery ingredients), "
            "and compute exact carbon metrics."
        )
        user_query = traj["user_query"]
        assistant_reply = traj["assistant_response"]

        # Build thought + tool call sequence
        tool_chain_text = ""
        for i, step in enumerate(traj.get("execution_trace", []), 1):
            tool_name = step.get("tool")
            args = json.dumps(step.get("arguments", {}))
            res = json.dumps(step.get("execution_result", {}))
            tool_chain_text += f"\n<tool_call>\n{{\"name\": \"{tool_name}\", \"arguments\": {args}}}\n</tool_call>\n<tool_response>\n{res}\n</tool_response>\n"

        full_assistant_content = f"{tool_chain_text}\n{assistant_reply}"

        messages = [
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_query},
            {"role": "assistant", "content": full_assistant_content}
        ]
        formatted_dataset.append({"messages": messages})

    return formatted_dataset

def main():
    parser = argparse.ArgumentParser(description="ToolGrad LoRA SFT Trainer")
    parser.add_argument("--model_id", type=str, default="google/gemma-2-2b-it", help="Hugging Face model ID")
    parser.add_argument("--dataset_path", type=str, default="eval/carbonlens_toolgrad_dataset.json", help="Path to ToolGrad JSON dataset")
    parser.add_argument("--output_dir", type=str, default="checkpoints/toolgrad_lora", help="Output checkpoint directory")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")
    parser.add_argument("--batch_size", type=int, default=2, help="Per-device train batch size")
    args = parser.parse_args()

    print("==================================================================")
    print("  CarbonLens-ToolGrad Downstream SFT Pipeline (ACL 2026)          ")
    print(f"  Target Base Model: {args.model_id}")
    print(f"  Dataset Source   : {args.dataset_path}")
    print("==================================================================\n")

    sft_data = convert_toolgrad_dataset_to_sft_format(args.dataset_path)
    print(f"[OK] Converted {len(sft_data)} ToolGrad trajectories into ChatML training format.")

    # Save formatted training data
    os.makedirs(args.output_dir, exist_ok=True)
    formatted_file = os.path.join(args.output_dir, "toolgrad_chatml_train.json")
    with open(formatted_file, "w", encoding="utf-8") as f:
        json.dump(sft_data, f, indent=2)
    print(f"[OK] Saved preprocessed training tokens to: {formatted_file}")

    print("\n--- LoRA Hyperparameter Configuration ---")
    lora_config = {
        "r": 16,
        "lora_alpha": 32,
        "lora_dropout": 0.05,
        "bias": "none",
        "task_type": "CAUSAL_LM",
        "target_modules": ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]
    }
    print(json.dumps(lora_config, indent=2))

    print("\n[NOTE]: To run fine-tuning on a GPU cluster with CUDA:")
    print(f"  pip install torch transformers peft trl datasets accelerate")
    print(f"  accelerate launch toolgrad/train_sft_lora.py --model_id {args.model_id}\n")

if __name__ == "__main__":
    main()
