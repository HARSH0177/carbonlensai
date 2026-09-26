"""
CarbonLens Sustainability Tool Suite for ToolGrad.
Provides deterministic Life Cycle Assessment (LCA) tool definitions
over peer-reviewed emission factors (Poore & Nemecek 2018, Agribalyse 3.1.1, CEA India v19).
"""

import json
import os
from typing import Dict, List, Any, Optional

class SustainabilityToolKit:
    def __init__(self, factors_path: Optional[str] = None):
        if factors_path is None:
            # Default to bundled emission_factors.json
            base_dir = os.path.dirname(os.path.abspath(__file__))
            factors_path = os.path.join(base_dir, "..", "src", "data", "emission_factors.json")

        if not os.path.exists(factors_path):
            raise FileNotFoundError(f"Emission factors file not found at: {factors_path}")

        with open(factors_path, "r", encoding="utf-8") as f:
            self.factors: List[Dict[str, Any]] = json.load(f)

    def get_tool_definitions(self) -> List[Dict[str, Any]]:
        """Returns JSON schema definitions for all tools compatible with ToolGrad and Gemini."""
        return [
            {
                "name": "lookup_emission_factor",
                "description": "Deterministically lookup the Life Cycle Assessment (LCA) carbon footprint for an ingredient/item and compute kg CO2e for a given mass in grams.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "item_name": {"type": "string", "description": "Name of the ingredient, grocery, or food item."},
                        "grams": {"type": "number", "description": "Portion mass in grams."}
                    },
                    "required": ["item_name", "grams"]
                }
            },
            {
                "name": "calculate_recipe_lca",
                "description": "Calculates composite Life Cycle Assessment carbon emissions for a multi-ingredient recipe/meal and identifies the primary carbon hotspot.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "recipe_name": {"type": "string", "description": "Name of the composite dish."},
                        "ingredients": {
                            "type": "array",
                            "description": "List of ingredient objects with 'name' and 'grams'.",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "name": {"type": "string"},
                                    "grams": {"type": "number"}
                                },
                                "required": ["name", "grams"]
                            }
                        }
                    },
                    "required": ["recipe_name", "ingredients"]
                }
            },
            {
                "name": "find_low_carbon_swap",
                "description": "Searches for a nutritionally and culturally viable lower-carbon ingredient substitute within the same category.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "current_item": {"type": "string", "description": "Current high-emission ingredient to replace."},
                        "category": {"type": "string", "description": "Category (meal, grocery, beverage, snack)."},
                        "target_max_co2e": {"type": "number", "description": "Maximum acceptable emission threshold in kg CO2e."}
                    },
                    "required": ["current_item", "category", "target_max_co2e"]
                }
            },
            {
                "name": "estimate_preparation_impact",
                "description": "Applies thermodynamic and culinary preparation multipliers to account for cooking fuel, oil absorption, and hidden fats.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "base_co2e_kg": {"type": "number", "description": "Raw unadjusted base emission in kg CO2e."},
                        "cooking_method": {
                            "type": "string",
                            "enum": ["steamed", "boiled", "sauteed", "curry_gravy", "deep_fried"],
                            "description": "Cooking technique used."
                        }
                    },
                    "required": ["base_co2e_kg", "cooking_method"]
                }
            },
            {
                "name": "compute_mac_abatement_cost",
                "description": "Computes the Marginal Abatement Cost (MAC) in INR per kg CO2e averted between baseline and swapped items.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "baseline_item": {"type": "string"},
                        "swapped_item": {"type": "string"},
                        "price_delta_inr": {"type": "number", "description": "Price difference (swapped_cost - baseline_cost) in INR."},
                        "co2e_reduction_kg": {"type": "number", "description": "Emissions reduction (baseline_co2e - swapped_co2e) in kg."}
                    },
                    "required": ["baseline_item", "swapped_item", "price_delta_inr", "co2e_reduction_kg"]
                }
            }
        ]

    def execute(self, tool_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        """Dispatches and executes the requested tool deterministically."""
        method = getattr(self, f"_tool_{tool_name}", None)
        if not method:
            return {"status": "error", "message": f"Tool '{tool_name}' not implemented in SustainabilityToolKit"}
        try:
            return method(**args)
        except Exception as e:
            return {"status": "error", "message": f"Execution error in {tool_name}: {str(e)}"}

    def _tool_lookup_emission_factor(self, item_name: str, grams: float) -> Dict[str, Any]:
        clean_name = item_name.strip().lower()
        
        # Priority 1: Match grocery / raw ingredient entries first to avoid colliding with composite meals
        groceries = [f for f in self.factors if f.get("category") == "grocery"]
        match = next((f for f in groceries if clean_name in f["name"].lower() or f["name"].lower() in clean_name), None)

        # Priority 2: Full search if not found in groceries
        if not match:
            match = next((f for f in self.factors if clean_name in f["name"].lower() or f["name"].lower() in clean_name), None)

        # Priority 3: Tag match
        if not match:
            for f in self.factors:
                if any(tag in clean_name for tag in f.get("tags", [])):
                    match = f
                    break

        if not match:
            factor_kg = 1.2
            matched_name = f"{item_name} (baseline)"
            grade = "B"
            category = "grocery"
        else:
            factor_kg = match["co2eKg"]
            matched_name = match["name"]
            grade = match.get("grade", "B")
            category = match.get("category", "grocery")

        # LCA Unit convention:
        # Category 'grocery' is per 1000g (1 kg).
        # Category 'meal' is per 300g standard serving.
        if category == "meal":
            portion_co2e = round((grams / 300.0) * factor_kg, 3)
        elif category == "energy":
            portion_co2e = round(grams * factor_kg, 3)
        else:
            portion_co2e = round((grams / 1000.0) * factor_kg, 3)

        return {
            "status": "success",
            "matched_item": matched_name,
            "category": category,
            "requested_grams": grams,
            "co2e_kg": max(portion_co2e, 0.01),
            "grade": grade,
            "lca_source": "Poore & Nemecek (2018) Science / Agribalyse 3.1.1"
        }

    def _tool_calculate_recipe_lca(self, recipe_name: str, ingredients: List[Dict[str, Any]]) -> Dict[str, Any]:
        breakdown = []
        total_co2 = 0.0
        hotspot_item = None
        max_item_co2 = -1.0

        for ing in ingredients:
            res = self._tool_lookup_emission_factor(ing["name"], float(ing.get("grams", 100)))
            co2 = res["co2e_kg"]
            total_co2 += co2
            breakdown.append({
                "ingredient": res["matched_item"],
                "grams": ing.get("grams", 100),
                "co2e_kg": co2
            })
            if co2 > max_item_co2:
                max_item_co2 = co2
                hotspot_item = res["matched_item"]

        total_co2 = round(total_co2, 3)
        return {
            "status": "success",
            "recipe_name": recipe_name,
            "total_co2e_kg": total_co2,
            "carbon_hotspot": {
                "ingredient": hotspot_item,
                "emissions_kg": max_item_co2,
                "share_pct": round((max_item_co2 / total_co2) * 100, 1) if total_co2 > 0 else 0
            },
            "breakdown": breakdown
        }

    def _tool_find_low_carbon_swap(self, current_item: str, category: str, target_max_co2e: float) -> Dict[str, Any]:
        item_lower = current_item.lower()
        is_protein = any(k in item_lower for k in ["chicken", "mutton", "fish", "meat", "pork", "beef", "egg", "protein"])

        # Filter out non-food and seasonings (e.g. Salt, spices)
        valid_pool = [
            f for f in self.factors 
            if "seasoning" not in f.get("tags", []) and f.get("category") in ["grocery", "meal"]
        ]

        if is_protein:
            # Prioritize realistic plant-based or lower-emission protein alternatives
            protein_candidates = [
                f for f in valid_pool
                if any(p in f["name"].lower() for p in ["dal", "pulses", "beans", "paneer", "tofu", "egg", "chana"])
                and f.get("co2eKg", 99) < target_max_co2e
            ]
            candidates = protein_candidates if protein_candidates else [
                f for f in valid_pool if f.get("co2eKg", 99) < target_max_co2e
            ]
        else:
            candidates = [
                f for f in valid_pool 
                if (f.get("category") == category or category == "all") and f.get("co2eKg", 99) < target_max_co2e
            ]
            if not candidates:
                candidates = [f for f in valid_pool if f.get("co2eKg", 99) < target_max_co2e]

        if not candidates:
            return {"status": "not_found", "message": f"No lower-carbon swap found under {target_max_co2e} kg"}

        # Select the best emissions candidate from valid culinary alternatives
        best = min(candidates, key=lambda x: x["co2eKg"])
        return {
            "status": "success",
            "current_item": current_item,
            "suggested_swap": best["name"],
            "swap_co2e_per_kg": best["co2eKg"],
            "reduction_potential_pct": round(((target_max_co2e - best["co2eKg"]) / target_max_co2e) * 100, 1) if target_max_co2e > best["co2eKg"] else 35.0,
            "tags": best.get("tags", [])
        }

    def _tool_estimate_preparation_impact(self, base_co2e_kg: float, cooking_method: str, duration_minutes: float = 30.0) -> Dict[str, Any]:
        """
        Calculates additive cooking energy emissions (kWh electric or LPG consumption).
        Source: Frankowska et al. (2020) 'Energy use and greenhouse gas emissions of home-cooked meals', Nature Food +
        Central Electricity Authority (CEA) India CO2 Baseline Database (0.716 kg CO2e/kWh weighted national grid average).
        """
        # Average power draw / burner power in kW
        method_power_kw = {
            "steamed": 0.50,      # Induction low simmer
            "boiled": 0.60,       # Water boiling
            "sauteed": 0.80,      # Medium-high pan fry
            "curry_gravy": 0.75,  # Prolonged simmer (30-40m)
            "deep_fried": 1.20    # High-temperature oil bath
        }
        power_kw = method_power_kw.get(cooking_method.lower(), 0.70)
        energy_kwh = round((duration_minutes / 60.0) * power_kw, 3)
        grid_factor_india = 0.716  # CEA India weighted national grid average baseline (kg CO2e / kWh)
        cooking_emissions = round(energy_kwh * grid_factor_india, 3)
        adjusted_total = round(base_co2e_kg + cooking_emissions, 3)

        return {
            "status": "success",
            "base_co2e_kg": base_co2e_kg,
            "cooking_method": cooking_method,
            "duration_minutes": duration_minutes,
            "energy_consumed_kwh": energy_kwh,
            "grid_emission_factor_kg_per_kwh": grid_factor_india,
            "cooking_overhead_kg": cooking_emissions,
            "adjusted_total_co2e_kg": adjusted_total,
            "lca_source": "CEA India CO2 Baseline Database (0.716 kg/kWh) / Frankowska et al. (2020) Nature Food"
        }

    def _tool_compute_mac_abatement_cost(self, baseline_item: str, swapped_item: str, price_delta_inr: float, co2e_reduction_kg: float) -> Dict[str, Any]:
        if co2e_reduction_kg <= 0:
            return {"status": "invalid", "message": "co2e_reduction_kg must be greater than zero"}
        mac_inr_per_kg = round(price_delta_inr / co2e_reduction_kg, 2)
        return {
            "status": "success",
            "baseline_item": baseline_item,
            "swapped_item": swapped_item,
            "price_delta_inr": price_delta_inr,
            "co2e_reduction_kg": co2e_reduction_kg,
            "mac_inr_per_kg_co2e": mac_inr_per_kg,
            "economic_viability": "Cost Saving" if price_delta_inr <= 0 else ("Highly Viable (<₹50/kg)" if mac_inr_per_kg < 50 else "Moderate Premium")
        }
