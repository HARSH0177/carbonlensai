"""
Unit Tests for CarbonLens SustainabilityToolKit (ToolGrad Deterministic LCA Engine).
Verifies:
1. Exact and token-boundary item matching without composite meal collisions.
2. Unit scaling and deterministic Life Cycle Assessment (LCA) arithmetic.
3. Strict category isolation for ingredient vs. whole-meal swaps.
4. Exclusion of seasonings from protein/food substitutions.
5. Thermodynamic cooking energy overhead using CEA India grid factors.
6. Marginal Abatement Cost (MAC) formula precision.
"""

import pytest
import os
import sys

# Ensure root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from toolgrad.tools import SustainabilityToolKit

@pytest.fixture
def toolkit():
    return SustainabilityToolKit()

# ── 1. ITEM MATCHING & COLLISION TESTS ──────────────────────────────────────────

def test_exact_lookup_grocery_items(toolkit):
    # 'Rice' must resolve to grocery staple, not 'Fried Rice Chicken'
    res = toolkit.execute("lookup_emission_factor", {"item_name": "Rice", "grams": 200})
    assert res["status"] == "success"
    assert res["matched_item"] == "Rice"
    assert res["category"] == "grocery"
    assert res["co2e_kg"] == 0.8  # 200g * 4.0 kg/kg = 0.8 kg

def test_exact_lookup_paneer_ingredient(toolkit):
    # 'Paneer' must resolve to raw dairy grocery (5.0 kg/kg), not 'Paneer Butter Masala' (meal)
    res = toolkit.execute("lookup_emission_factor", {"item_name": "Paneer", "grams": 200})
    assert res["status"] == "success"
    assert res["matched_item"] == "Paneer"
    assert res["category"] == "grocery"
    assert res["co2e_kg"] == 1.0  # 200g / 1000g * 5.0 kg/kg = 1.0 kg

def test_token_boundary_chicken_matches_raw_not_composite(toolkit):
    # 'Chicken' must match 'Chicken Raw', never 'Biryani Chicken' or 'Butter Chicken'
    res = toolkit.execute("lookup_emission_factor", {"item_name": "Chicken", "grams": 250})
    assert res["status"] == "success"
    assert res["matched_item"] == "Chicken Raw"
    assert res["category"] == "grocery"
    assert res["co2e_kg"] == 1.725  # 250g / 1000g * 6.9 kg/kg = 1.725 kg

def test_token_boundary_dal_matches_pulses_not_dal_rice(toolkit):
    # 'Dal' must match 'Dal / Pulses' (grocery), never 'Dal Rice' (composite meal)
    res = toolkit.execute("lookup_emission_factor", {"item_name": "Dal", "grams": 100})
    assert res["status"] == "success"
    assert res["matched_item"] == "Dal / Pulses"
    assert res["category"] == "grocery"
    assert res["co2e_kg"] == 0.18  # 100g / 1000g * 1.8 kg/kg = 0.18 kg

def test_composite_meal_lookup_when_explicitly_requested(toolkit):
    # Explicitly asking for 'Biryani Chicken' resolves to meal category
    res = toolkit.execute("lookup_emission_factor", {"item_name": "Biryani Chicken", "grams": 300})
    assert res["status"] == "success"
    assert res["matched_item"] == "Biryani Chicken"
    assert res["category"] == "meal"
    assert res["co2e_kg"] == 3.2

# ── 2. RECIPE LCA ARITHMETIC & HOTSPOT TESTS ──────────────────────────────────

def test_recipe_lca_deterministic_math(toolkit):
    # Chicken Biryani: 250g Chicken Raw (6.9 kg/kg) + 200g Rice (4.0 kg/kg)
    # Expected: 0.25 * 6.9 = 1.725; 0.2 * 4.0 = 0.800; Total = 2.525 kg
    res = toolkit.execute("calculate_recipe_lca", {
        "recipe_name": "Chicken Biryani",
        "ingredients": [
            {"name": "Chicken", "grams": 250},
            {"name": "Rice", "grams": 200}
        ]
    })
    assert res["status"] == "success"
    assert res["total_co2e_kg"] == 2.525
    assert len(res["breakdown"]) == 2
    assert res["breakdown"][0]["co2e_kg"] == 1.725
    assert res["breakdown"][1]["co2e_kg"] == 0.8

def test_recipe_lca_hotspot_detection(toolkit):
    res = toolkit.execute("calculate_recipe_lca", {
        "recipe_name": "Chicken Biryani",
        "ingredients": [
            {"name": "Chicken", "grams": 250},
            {"name": "Rice", "grams": 200}
        ]
    })
    hotspot = res["carbon_hotspot"]
    assert hotspot["ingredient"] == "Chicken Raw"
    assert hotspot["emissions_kg"] == 1.725
    assert hotspot["share_pct"] == 68.3  # 1.725 / 2.525 * 100 = 68.31%

# ── 3. CATEGORY ISOLATION & SWAP CONSISTENCY TESTS ─────────────────────────────

def test_swap_grocery_ingredient_returns_grocery_not_meal(toolkit):
    # Swapping 'Chicken Raw' (grocery) must return another grocery protein, NOT a composite meal like 'Dal Rice'
    res = toolkit.execute("find_low_carbon_swap", {
        "current_item": "Chicken Raw",
        "category": "meat",
        "target_max_co2e": 2.0
    })
    assert res["status"] == "success"
    assert res["target_category"] == "grocery"
    # Should be legume/pulse, e.g. Frozen Peas (1.1 kg), Canned Beans (1.3 kg), or Dal / Pulses (1.8 kg)
    assert res["suggested_swap"] in ["Frozen Peas", "Canned Beans", "Dal / Pulses"]
    assert res["suggested_swap"] != "Dal Rice"
    assert res["swap_co2e_per_kg"] <= 2.0

def test_swap_composite_meal_returns_composite_meal(toolkit):
    # Swapping 'Biryani Chicken' (meal) must return a lower-carbon meal
    res = toolkit.execute("find_low_carbon_swap", {
        "current_item": "Biryani Chicken",
        "category": "meal",
        "target_max_co2e": 2.0
    })
    assert res["status"] == "success"
    assert res["target_category"] == "meal"
    assert res["suggested_swap"] in ["Dal Rice", "Paneer Butter Masala", "Palak Paneer", "Khichdi"]
    assert res["swap_co2e_per_kg"] <= 2.0

def test_swap_never_returns_seasonings(toolkit):
    # Seasonings like Salt (0.2 kg/kg) or spices must never be recommended as swaps
    res = toolkit.execute("find_low_carbon_swap", {
        "current_item": "Chicken Raw",
        "category": "meat",
        "target_max_co2e": 1.0
    })
    assert res["status"] == "success"
    assert "seasoning" not in res.get("tags", [])
    assert res["suggested_swap"] != "Salt"

def test_swap_protein_never_returns_starches_or_potatoes(toolkit):
    # Even if target_max_co2e is very low (e.g. 0.5 kg), swapping Chicken Raw must NEVER recommend Potatoes or Rice
    res = toolkit.execute("find_low_carbon_swap", {
        "current_item": "Chicken Raw",
        "category": "grocery",
        "target_max_co2e": 0.5
    })
    assert res["status"] == "success"
    assert res["nutritional_profile"] == "protein_equivalent"
    assert res["suggested_swap"] not in ["Potatoes", "Rice", "Wheat Flour", "Onions", "Tomatoes"]
    assert any(p in res["suggested_swap"].lower() for p in ["pea", "bean", "dal", "pulse", "tofu", "paneer", "egg"])


# ── 4. COOKING ENERGY & THERMODYNAMIC TESTS ───────────────────────────────────

def test_preparation_impact_curry_gravy_cea_factor(toolkit):
    # curry_gravy power draw = 0.75 kW; 30 mins = 0.5 hr; energy = 0.375 kWh
    # Grid factor = 0.716 kg CO2e/kWh (CEA India national weighted average)
    # Cooking overhead = 0.375 * 0.716 = 0.2685 -> 0.268 kg CO2e
    res = toolkit.execute("estimate_preparation_impact", {
        "base_co2e_kg": 2.525,
        "cooking_method": "curry_gravy",
        "duration_minutes": 30.0
    })
    assert res["status"] == "success"
    assert res["energy_consumed_kwh"] == 0.375
    assert res["grid_emission_factor_kg_per_kwh"] == 0.716
    assert res["cooking_overhead_kg"] == 0.268
    assert res["adjusted_total_co2e_kg"] == 2.793

# ── 5. MARGINAL ABATEMENT COST (MAC) TESTS ─────────────────────────────────────

def test_marginal_abatement_cost_calculation(toolkit):
    # Price savings = -INR 40; CO2e reduction = 1.225 kg
    # MAC = -40 / 1.225 = -32.65 INR/kg CO2e (negative indicates net economic savings)
    res = toolkit.execute("compute_mac_abatement_cost", {
        "baseline_item": "Chicken Raw",
        "swapped_item": "Dal / Pulses",
        "price_delta_inr": -40.0,
        "co2e_reduction_kg": 1.225
    })
    assert res["status"] == "success"
    assert res["mac_inr_per_kg_co2e"] == -32.65
    assert res["is_financially_beneficial"] is True

def test_toolkit_unknown_tool_graceful_error(toolkit):
    res = toolkit.execute("non_existent_tool", {})
    assert res["status"] == "error"
    assert "not implemented" in res["message"]
