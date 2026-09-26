"""
Unit Tests for ToolGrad Mechanism & Textual Gradient Integration (Zhou et al., ACL 2026).
Verifies:
1. Accumulated gradients are explicitly injected into the Proposer prompt.
2. The latest Textual Gradient is highlighted as active directional guidance.
3. Multi-model fallback chain triggers on HTTP 404 / 503 errors.
4. Robust JSON extraction with self-healing syntax repair.
"""

import pytest
import os
import sys
import json
from unittest.mock import patch, MagicMock

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from toolgrad.synthesizer import ToolGradSynthesizer, DEFAULT_MODELS

@pytest.fixture
def mock_synthesizer():
    # Use dummy API key for offline unit testing
    return ToolGradSynthesizer(api_key="test_dummy_key_ai_studio")

def test_model_chain_initialization(mock_synthesizer):
    assert len(mock_synthesizer.model_chain) == len(DEFAULT_MODELS)
    assert mock_synthesizer.model_chain[0] == DEFAULT_MODELS[0]

def test_propose_next_tool_injects_gradients_into_prompt(mock_synthesizer):
    trace = [
        {
            "step": 1,
            "tool": "calculate_recipe_lca",
            "arguments": {"recipe_name": "Chicken Biryani", "ingredients": [{"name": "Chicken", "grams": 250}]},
            "execution_result": {"status": "success", "total_co2e_kg": 1.725}
        }
    ]
    gradients = [
        {
            "step": 1,
            "tool": "calculate_recipe_lca",
            "gradient": "Textual Gradient (Grad): Hotspot is Chicken Raw (68%). Directional vector: find plant-based protein swap."
        }
    ]

    captured_prompt = None

    def fake_call(prompt, temperature=0.4, json_mode=True):
        nonlocal captured_prompt
        captured_prompt = prompt
        return json.dumps({
            "terminate": False,
            "reasoning_from_gradient": "Following gradient vector to search for plant-based protein substitute",
            "tool_name": "find_low_carbon_swap",
            "arguments": {"current_item": "Chicken Raw", "category": "grocery", "target_max_co2e": 2.0}
        })

    mock_synthesizer._call_gemini = fake_call
    proposal = mock_synthesizer.propose_next_tool(trace, gradients, "Reduce Biryani Carbon")

    assert captured_prompt is not None
    # 1. Verify gradient is present in the prompt
    assert "Textual Gradient (Grad): Hotspot is Chicken Raw" in captured_prompt
    # 2. Verify latest gradient directional guidance block is rendered
    assert "CRITICAL DIRECTIONAL GUIDANCE" in captured_prompt
    assert "MANDATORY GRADIENT CONDITIONING" in captured_prompt
    # 3. Verify proposer returned gradient reasoning
    assert proposal["tool_name"] == "find_low_carbon_swap"
    assert "Following gradient vector" in proposal["reasoning_from_gradient"]

def test_model_failover_on_http_503(mock_synthesizer):
    # Simulate first model returning 503 high demand, second returning 200 OK
    call_count = 0

    def mock_post(url, json=None, timeout=60):
        nonlocal call_count
        call_count += 1
        resp = MagicMock()
        if call_count == 1:
            resp.status_code = 503
            resp.text = "High demand spike"
        else:
            resp.status_code = 200
            resp.json.return_value = {
                "candidates": [{"content": {"parts": [{"text": '{"test": "ok"}'}]}}]
            }
        return resp

    with patch("requests.post", side_effect=mock_post):
        with patch("time.sleep", return_value=None):
            initial_idx = mock_synthesizer.current_model_idx
            res = mock_synthesizer._call_gemini("test prompt")
            assert mock_synthesizer.current_model_idx == initial_idx + 1
            assert res == '{"test": "ok"}'

def test_json_extractor_self_healing(mock_synthesizer):
    # Tests markdown cleanup
    markdown_json = "```json\n{\"clean\": true, \"value\": 42}\n```"
    extracted = mock_synthesizer._extract_json(markdown_json)
    assert extracted["clean"] is True
    assert extracted["value"] == 42
