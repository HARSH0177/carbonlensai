<div align="center">

# 🍃 CarbonLensAI
### **Deterministic Life Cycle Assessment (LCA) Engine & Agentic Tool-Use Synthesis**
*Multimodal Carbon Scanner, ToolGrad Synthesis (ACL 2026), and PromptWars Virtual Challenge 3 Verified Solution (`2026H2S06PWVCHL3-A01765`)*

[![CI](https://github.com/HARSH0177/carbonlensai/actions/workflows/ci.yml/badge.svg)](https://github.com/HARSH0177/carbonlensai/actions)
[![Tests](https://img.shields.io/badge/Unit_Tests-26_Passed_(Vitest_+_Pytest)-success?style=for-the-badge)](tests/)
[![Evaluation](https://img.shields.io/badge/LCA_MAPE-3.15%25_(30_Cases)-blue?style=for-the-badge)](eval/results.md)
[![Concordance](https://img.shields.io/badge/Pairwise_Concordance-99.1%25-green?style=for-the-badge)](eval/results.md)
[![PromptWars](https://img.shields.io/badge/PromptWars_Score-90.14%2F100-orange?style=for-the-badge)](assets/promptwars_certificate.png)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br>

```text
"Decoupling visual portion perception from deterministic Life Cycle Assessment:
 verifiable carbon arithmetic, inverted agentic trajectory synthesis with textual gradients,
 and dynamic 2050 urban climate simulations."
```

</div>

---

## 🏗️ System Architecture & Agentic LCA Pipeline

<div align="center">
  <img src="assets/architecture-diagram.svg" alt="CarbonLensAI System Architecture Diagram" width="100%" />
</div>

<br/>

### 📐 Architectural Layer Breakdown

The architecture diagram above illustrates CarbonLensAI's 4-layer asynchronous data processing and optimization pipeline:

1. **Layer 1 — Perception & Multimodal Ingestion Layer**:
   - **Gemini 2.5 Flash Vision**: Parses food items, preparation methods, and mass estimates ($g$) from meal photos and grocery receipts.
   - **Perception-Math Decoupler**: Enforces a strict architectural barrier preventing LLM probabilistic hallucinations from contaminating environmental calculations.
   - **Resilience Circuit Breaker**: Half-open state machine with 3-failure trip threshold and automated reset, maintaining 100% operational client uptime.
   - **Graceful Category Fallback**: Deterministic fallback to category baseline averages when upstream networks or OCR services fail.

2. **Layer 2 — ToolGrad Agentic Synthesis & Optimization Layer (ACL 2026)**:
   - **Forward Tool Execution Graph**: Chains multi-step LCA calculations (`calculate_recipe_lca` $\to$ `find_low_carbon_swap` $\to$ `estimate_preparation_impact` $\to$ `compute_mac_abatement_cost`).
   - **Textual Gradient Critic ($\nabla_{\text{text}}$)**: Directional critique evaluating unit scaling, strict category boundaries, and nutritional protein preservation.
   - **Closed-Loop Gradient Conditioning**: Injects cumulative gradients into the Action Proposer prompt to dynamically guide the next tool selection.
   - **Answer-First Inverted Synthesizer**: Generates grounded backward queries and verified assistant responses from completed execution traces.
   - **LoRA SFT Pipeline ([`toolgrad/train_sft_lora.py`](toolgrad/train_sft_lora.py))**: Formats trajectories into ChatML format for parameter-efficient fine-tuning on consumer/cluster GPUs (Gemma 2B / 3B).

3. **Layer 3 — Deterministic Life Cycle Assessment (LCA) Engine**:
   - **4-Tier Item Matching Engine**: Resolves items via exact matching, token-boundary regex, and category scoping (`grocery` vs `meal`), preventing substring collisions (e.g. `Dal Rice` meal vs `Dal` grocery).
   - **Verified LCA Database**: Curated from Poore & Nemecek 2018 (*Science*), Agribalyse 3.1.1, and ICMR India, verified across 30 benchmark cases (**3.15% MAPE, 0.04 kg MAE**).
   - **Thermodynamic Cooking Energy Engine**: Combines Frankowska et al. 2020 burner power ratings with Central Electricity Authority (CEA) India v19 grid emission factors (**0.716 kg $\text{CO}_2\text{e}$/kWh**).
   - **Marginal Abatement Cost (MAC)**: Computes economic-carbon efficiency ($\Delta \text{Cost} / \Delta \text{CO}_2\text{e}$ in ₹/kg $\text{CO}_2\text{e}$) to suggest cost-effective swaps.

4. **Layer 4 — Interactive Client, Automated CI & 2050 Climate Futures Layer**:
   - **React 19 & Vite SPA**: Glassmorphic, WCAG-compliant UI with real-time portion adjustment sliders and emission grade badges (A+ to G).
   - **Dynamic 2050 Climate Simulator**: Generates personalized urban climate projections and "Letter from 2050" scenarios based on consumer diet trajectories.
   - **GitHub Actions Automated CI**: Runs automated multi-job testing (18 Pytest unit tests, 8 Vitest reactivity tests, and 30-case LCA ground-truth audit) on every push.

### 🧩 Core Subsystems & Components

| Subsystem / Component | Primary Responsibilities | Core Technology |
| :--- | :--- | :--- |
| **Multimodal Vision & Decoupler** | Receipt OCR, food portion perception, and arithmetic decoupling | Gemini 2.5 Flash Vision, Strict Portion Schema |
| **Resilience Circuit Breaker** | 3-failure threshold, half-open recovery, and deterministic fallback | Custom State Machine, Category Baselines |
| **ToolGrad Synthesizer** | Closed-loop trajectory generation with accumulated textual gradients | ACL 2026 Framework, Multi-Model Fallback Chain |
| **Textual Gradient Critic** | Directional constraint evaluation (category isolation & protein preservation) | Gemini 2.5, Gradient Feedback Loop |
| **LoRA SFT Pipeline** | ChatML trajectory tokenization and lightweight parameter fine-tuning | PyTorch, Hugging Face PEFT, LoRA |
| **4-Tier Item Matching Engine** | Token-boundary regex & category scoping to eliminate collisions | Python `re`, Deterministic 4-Tier Lookup |
| **Verified LCA Engine** | Zero-hallucination carbon calculations & unit-standardized scaling | Poore & Nemecek 2018, Agribalyse 3.1.1, ICMR |
| **Thermodynamic Energy Engine** | Additive cooking preparation overhead using regional grid averages | Frankowska 2020, CEA India v19 (0.716 kg/kWh) |
| **Marginal Abatement Cost** | Cost-per-kg $\text{CO}_2\text{e}$ averted to identify high-ROI dietary swaps | Microeconomic Abatement Optimization |
| **Interactive Client & Simulator** | Glassmorphic UI, portion sliders, and generative 2050 climate futures | React 19, Vite, Tailwind CSS, Lucide |
| **Automated CI/CD** | Dual-environment automated test validation on every push | GitHub Actions, Pytest 8, Vitest 2 |

### 🔄 Multi-Agent & Decoupled Execution Sequence Diagram

The sequence diagram below models the dynamic, multi-agent execution flow across multimodal perception decoupling, circuit breaking, closed-loop ToolGrad trajectory synthesis, deterministic LCA calculation, and 2050 climate forecasting:

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Client
    participant UI as React 19 Frontend
    participant CB as Resilience Circuit Breaker
    participant Vision as Gemini 2.5 Flash Vision
    participant Decoupler as Perception-Math Decoupler
    participant LCA as Deterministic LCA Engine
    participant ToolGrad as ToolGrad Synthesizer (ACL 2026)
    participant Critic as Textual Gradient Critic (dText)
    participant Simulator as 2050 Climate Simulator

    User->>UI: Upload Food Photo or Receipt
    UI->>CB: Dispatch Ingestion Request
    alt Upstream Service Available (Normal Flow)
        CB->>Vision: Forward Image (Zero Math Requested)
        Vision-->>CB: Return Item Candidates & Bounding Mass (g)
        CB->>Decoupler: Strip Probabilistic LLM Carbon Values
        Decoupler->>LCA: Transmit Verified Items & Portions (g)
    else Upstream Rate Limit / Outage (HTTP 429 or 503)
        CB-->>UI: Trip Breaker → Load Deterministic Category Means
    end

    LCA->>LCA: 4-Tier Match (Exact → Word Boundary → Category Scoping)
    LCA->>LCA: Calculate Base Emissions (Poore & Nemecek / Agribalyse)
    LCA->>LCA: Add Cooking Energy Overhead (CEA India v19: 0.716 kg/kWh)
    LCA-->>UI: Stream Baseline LCA Footprint & Primary Hotspots

    UI->>ToolGrad: Request Low-Carbon Optimization Trajectory
    ToolGrad->>ToolGrad: Propose Next Tool (find_low_carbon_swap)
    ToolGrad->>Critic: Forward Candidate Execution Trace
    
    alt Domain Constraints Satisfied (Strict Protein Isolation)
        Critic-->>ToolGrad: Positive Gradient (Preserves Macro & Category Boundary)
        ToolGrad->>ToolGrad: Back-Synthesize Grounded Response & Trajectory
    else Category or Macro Collision (e.g. Starches for Meat)
        Critic-->>ToolGrad: Directional Critique (Negative Gradient: Backtrack)
        ToolGrad->>ToolGrad: Re-Dispatch within Isolated Protein Pool
    end

    ToolGrad->>LCA: Compute Marginal Abatement Cost (MAC in ₹/kg CO2e)
    LCA-->>UI: Return Verified Swap & Economic Efficiency Metrics

    opt User Toggles 2050 Urban Simulation
        UI->>Simulator: Submit Net Carbon Delta & Scenario Preferences
        Simulator-->>UI: Stream Dynamic 2050 Projection & Narrative
    end

    UI-->>User: Render Glassmorphic Carbon Cards, Sliders & Emission Tiers
```

---

## 🧪 1. Deterministic Evaluation Harness & LCA Ground-Truth Benchmark

Multimodal vision models (VLMs) have high variance when estimating portion masses from 2D images (~25–35%). When LLMs perform environmental arithmetic directly, perception errors compound with arithmetic hallucination. 

**CarbonLensAI decouples perception from calculation**: Gemini Flash Vision detects items and portions, but all carbon intensity math is resolved through a **deterministic calculation layer** validated against peer-reviewed Life Cycle Assessment (LCA) standards (Poore & Nemecek 2018 *Science*, Agribalyse 3.1.1, ICMR India, DEFRA, and Central Electricity Authority India v19).

```text
====================================================================
CARBONLENSAI DETERMINISTIC EVALUATION AUDIT (eval/testset.json)
====================================================================
Total Benchmark Cases:           30 (Dietary, Grocery, and Energy)
Mean Absolute Error (MAE):       0.04 kg CO2e
Mean Absolute % Error (MAPE):    3.15%
Grade Classification Accuracy:   96.7% (29/30 exact tier match)
Pairwise Ranking Concordance:    99.1% (430/434 correct lower-carbon swap orderings)
--------------------------------------------------------------------
Key Tested Ground-Truth Cases (Sample):
  • Dal Tadka with Steamed Rice:  True: 0.85 kg | Pred: 0.80 kg (Error: 5.9%)
  • Aloo Gobi with Roti:          True: 1.10 kg | Pred: 1.10 kg (Error: 0.0%)
  • Chicken Biryani:              True: 2.53 kg | Pred: 2.53 kg (Error: 0.0%)
  • Mutton Curry with Rice:       True: 8.85 kg | Pred: 8.85 kg (Error: 0.0%)
  • South Indian Masala Dosa:     True: 0.75 kg | Pred: 0.75 kg (Error: 0.0%)
  • 100 kWh Residential Grid:     True: 71.6 kg | Pred: 71.6 kg (Error: 0.0% - CEA v19)
--------------------------------------------------------------------
Documented Boundary & Failure Modes:
  • Dairy Basket (Case 7): 32.0% underestimation in naive matching fixed via category-aware lookup.
  • Bulk Staples (Case 8): 45.7% divergence in substring matching fixed via exact-priority dispatch.
====================================================================
```

> **Evaluation Scope**: This benchmark measures the **deterministic calculation layer** given verified item masses and utility inputs. End-to-end photo-to-mass portion estimation requires a physical scale ground-truth dataset and remains a documented future boundary (see [`eval/results.md`](eval/results.md)).

---

## 🤖 2. ToolGrad: Inverted Agentic Tool-Use Synthesis with Textual Gradients

Prior synthetic tool-use frameworks (e.g. ToolBench) rely on a **Query-First** approach: generating a natural language query first, then running depth-first search (DFS) over APIs. In constrained physical domains like Life Cycle Assessment, DFS suffers from high annotation failure rates.

CarbonLens implements the **ToolGrad framework** (*Zhou, Du [Google], Xu [Google] et al., Findings of ACL 2026*), which inverts this paradigm:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              TOOLGRAD ANSWER-FIRST PIPELINE                            │
│                                                                                        │
│   [1. FORWARD EXECUTION]      [2. TEXTUAL GRADIENT CRITIC]     [3. INVERTED SYNTHESIS] │
│   LCA Toolkit Execution  ───► Compute dText Gradient      ───► Back-Synthesize Grounded│
│   (Recipe LCA -> Hotspot      (Directional critique on         User Query & Verified   │
│    -> Swap -> Energy)          fidelity & constraints)          Assistant Response     │
│             ▲                             │                                            │
│             └───── Gradient Conditioning ─┘                                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Engineering Fixes Implemented:
1. **Closing the Gradient Loop**: Prior naive implementations computed textual gradients as passive narration. Our `ToolGradSynthesizer` explicitly injects accumulated gradients and highlights the latest critic gradient as `CRITICAL DIRECTIONAL GUIDANCE` in the Action Proposer prompt, conditioning every transition on prior constraint satisfaction.
2. **Category Isolation & Strict Nutritional Equivalence**: Solved the composite-dish collision bug where substring matching erroneously matched whole meals (e.g. `Dal Rice` at 0.8 kg) as protein swaps for raw recipe ingredients (`Chicken Raw`). Swaps now enforce strict category isolation (`grocery` $\to$ `grocery`; `meal` $\to$ `meal`) AND strict nutritional macronutrient preservation (`protein` strictly swaps for `protein`, never falling back to starches like Potatoes).
3. **Additive Thermodynamic Energy**: Integrates Frankowska et al. (2020 *Nature Food*) burner power draws with CEA India's weighted national grid average (0.716 kg $\text{CO}_2\text{e}$/kWh).
4. **Multi-Model Fallback Chain**: Centralized fallback list (`gemini-3.5-flash-lite` $\to$ `gemini-flash-lite-latest` $\to$ `gemini-3.5-flash`) preventing pipeline failure during API demand spikes.
5. **Empirical Downstream Validation & SFT Pipeline**: Generated and committed multi-scenario ToolGrad benchmark dataset ([`eval/carbonlens_toolgrad_dataset.json`](eval/carbonlens_toolgrad_dataset.json)), downstream in-context evaluation harness ([`eval/downstream_tool_eval.py`](eval/downstream_tool_eval.py)), and full HuggingFace LoRA fine-tuning training pipeline ([`toolgrad/train_sft_lora.py`](toolgrad/train_sft_lora.py)).

---

## 🧪 3. Comprehensive Test Suite (26 Tests Passing)

CarbonLens enforces dual-language verification across both frontend reactivity and backend LCA determinism:

| Suite | Runner | Tests | Scope |
| :--- | :--- | :---: | :--- |
| **LCA Engine & ToolGrad** | `pytest` | **18 Passing** | Exact factor matching, category isolation, nutritional protein constraints, cooking thermodynamics, MAC cost, gradient injection, model failover |
| **Frontend & Circuit Breaker** | `vitest` | **8 Passing** | Category average fallback, half-open circuit breaker, landing UI |
| **Ground-Truth LCA Audit** | `node` | **30 Cases** | Literature MAPE (3.15%), MAE (0.04 kg), pairwise swap concordance (99.1%) |
| **Downstream Ablation Eval** | `python` | **5 Pilot Cases** | 3-way ablation (Zero-Shot vs Generic Few-Shot vs ToolGrad In-Context Supervised) |

> **Automated CI**: Pytest, Vitest, and the 30-case LCA benchmark are executed automatically on every push via [GitHub Actions CI](.github/workflows/ci.yml).


```bash
# Run backend LCA toolkit & ToolGrad tests (18 passed)
python -m pytest tests/ -v

# Run frontend Vitest tests (8 passed)
npm test

# Run deterministic LCA benchmark harness (30 cases, 3.15% MAPE)
node eval/run_eval.js

# Run downstream ToolGrad held-out evaluation
python eval/downstream_tool_eval.py
```

---

## 🎖️ 4. Google PromptWars Virtual Recognition (Challenge 3)

CarbonLensAI was developed for **PromptWars Virtual** organized by **Google for Developers & Hack2Skill (H2S)**, earning a **Certificate of Appreciation for Challenge 3** with a verified submission score of **90.14 / 100**.

<div align="center">
  <img src="assets/promptwars_certificate.png" alt="Google for Developers PromptWars Certificate" width="48%" style="border-radius: 8px; border: 1px solid #334155;" />
  <img src="assets/promptwars_verified_score.png" alt="PromptWars Verified Submission Score 90.14" width="48%" style="border-radius: 8px; border: 1px solid #334155;" />
</div>

<br>

| Metric | Verified Score | Evaluation Criteria |
| :--- | :---: | :--- |
| **Overall Score** | **90.14 / 100** | Challenge 3 Attempt 2 Final Assessment |
| **Efficiency** | **100 / 100** | Execution latency, bundle optimization & responsive state handling |
| **Security** | **95 / 100** | Sanitization, client-side safety & zero hardcoded credential leaks |
| **Accessibility** | **93 / 100** | WCAG compliant glassmorphic UI, semantic HTML & contrast ratios |
| **Problem Statement Alignment**| **93 / 100** | End-to-end multimodal perception to actionable carbon reduction |
| **Code Quality** | **84 / 100** | Modular service decoupling & clean component separation |
| **Testing** | **73 / 100** | Unit test coverage over core carbon calculation engines |

- **Official Certificate ID**: `2026H2S06PWVCHL3-A01765`
- **Verification Portal**: [Hack2Skill PromptWars Dashboard](https://hack2skill.com)

---

## 📸 5. Multimodal Web Application & 2050 Climate Futures

<div align="center">

### 🎛️ What-If Climate Simulator & Dynamic 2050 Futures Engine
<img src="assets/carbonlens_simulator_ui.jpg" alt="CarbonLensAI What-If Simulator Interface" width="95%" />

<br><br>

### 📜 AI-Generated "Letter From 2050" & City Impact Scaling
<img src="assets/carbonlens_letter_from_2050.jpg" alt="CarbonLensAI Letter From 2050 and Impact Scale" width="95%" />

</div>

---

## 🏗️ 6. System Architecture & Resilience Engine

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CARBONLENS-AI PIPELINE                                        │
│                                                                                                  │
│   [1. USER INPUT]               [2. INTELLIGENCE LAYER]              [3. VISUAL FEEDBACK]        │
│   Grocery / Meal Image  ───►    Gemini Flash Vision Engine   ───►    Calculated Carbon Impact    │
│                                 (Multimodal Prompt Analysis)         & Eco-Friendly Swaps        │
│                                                                                                  │
│   Lifestyle Sliders     ───►    Dynamic Futures Engine       ───►    Photorealistic 2050 Urban   │
│   (Diet, Transit, AC)           (Pollinations AI Synthesis)          Climate Projections         │
│                                                                                                  │
│   [RESILIENCE ENGINE]: Half-Open Circuit Breaker (5-min cooldown) + Programmatic Table Fallback   │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Stateful Circuit Breaker**: Half-open state machine with 5-minute cooldown preventing cascade failures during API outages.
- **Programmatic Fallback**: Replaced hardcoded scenarios with dynamic arithmetic means calculated across 140+ verified emission factor entries.
- **2050 Future Simulator**: Synthesizes generative urban visual projections reflecting optimistic vs. dystopian environmental trajectories using Pollinations AI.

---

## 📂 7. Repository Structure

```text
carbonlensai/
├── assets/                    # Certificate, score proof, and UI screenshots
│   ├── promptwars_certificate.png      # Google for Developers Certificate
│   ├── promptwars_verified_score.png   # 90.14/100 verified score dashboard
│   ├── carbonlens_simulator_ui.jpg     # Simulator UI demo
│   └── carbonlens_letter_from_2050.jpg # Generated 2050 letter demo
├── eval/                      # Empirical LCA evaluation harness
│   ├── testset.json           # 10 ground-truth LCA cases (Poore & Nemecek, CEA)
│   ├── run_eval.js            # Node.js evaluation runner (MAE, MAPE, Concordance)
│   └── results.md             # Transparent benchmark report with failure analysis
├── functions/                 # Firebase Cloud Functions (Server-side API proxy)
│   ├── index.js               # Secure Gemini proxy routing
│   └── package.json
├── toolgrad/                  # ToolGrad agentic synthesis engine (ACL 2026)
│   ├── tools.py               # Deterministic LCA tools (per-ingredient + CEA energy)
│   ├── synthesizer.py         # Answer-First trajectory synthesis with textual gradients
│   └── run_test_trajectory.py # Trajectory runner
├── src/
│   ├── components/            # UI components (Hero, Scanner, Results, Simulator)
│   ├── data/
│   │   ├── emission-factors.js# 140+ verified LCA factors table
│   │   └── emission_factors.json
│   ├── pages/                 # ResultsPage, SimulatorPage, ScanPage
│   ├── services/
│   │   ├── carbon-engine.js   # Deterministic math, category averages, tree offsets
│   │   ├── gemini.js          # Half-open circuit breaker & Gemini vision client
│   │   └── firebase.js        # Firebase authentication & config
│   └── utils/
├── firebase.json              # Hosting & Cloud Function routing rules
└── package.json
```

---

## ⚡ Quick Start & Local Development

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Google Gemini API Key

### 2. Clone & Install Dependencies
```bash
git clone https://github.com/HARSH0177/carbonlensai.git
cd carbonlensai
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 4. Run Unit Tests & Evaluation
```bash
# Run backend LCA toolkit & ToolGrad unit tests (17 passing tests)
python -m pytest tests/ -v

# Run frontend Vitest unit tests (8 passing tests)
npm test

# Run empirical LCA evaluation harness (10 benchmark cases)
node eval/run_eval.js
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 🚀 Deployment to Firebase Hosting

```bash
npm run build
firebase deploy
```

---

## 👤 Author & Attribution

Developed by **Harsh Ambule**:
- **GitHub**: [@HARSH0177](https://github.com/HARSH0177)
- **LinkedIn**: [Harsh Ambule](https://www.linkedin.com/in/harsh-ambule-3551bb266/)
- **Email**: harshambule612@gmail.com

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
