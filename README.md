<div align="center">

# 🍃 CarbonLensAI
### **Computer Vision Carbon Scanner & Dynamic 2050 Climate Future Simulator**
*Google for Developers PromptWars Virtual (Challenge 3 Verified Solution Submission · Cert ID: 2026H2S06PWVCHL3-A01765)*

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-Flash_Vision-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Pollinations AI](https://img.shields.io/badge/Pollinations_AI-Real--Time_Generative-10B981?style=for-the-badge)](https://pollinations.ai/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

<br>

```text
"Transforming abstract carbon accounting into visceral, visual feedback:
 from instant receipt/meal computer vision scans to dynamic 2050 urban projections."
```

</div>

---

## 🎖️ Verified PromptWars Recognition & Benchmark Score

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
| **Testing** | **73 / 100** | Vitest unit test coverage over core carbon calculation engines |

- **Official Certificate ID**: `2026H2S06PWVCHL3-A01765`
- **Verification Portal**: [Hack2Skill PromptWars Dashboard](https://hack2skill.com)

---

## 📸 Interface & Live Visual Demonstrations

<div align="center">

### 🎛️ What-If Climate Simulator & Dynamic 2050 Futures Engine
<img src="assets/carbonlens_simulator_ui.jpg" alt="CarbonLensAI What-If Simulator Interface" width="95%" />

<br><br>

### 📜 AI-Generated "Letter From 2050" & City Impact Scaling
<img src="assets/carbonlens_letter_from_2050.jpg" alt="CarbonLensAI Letter From 2050 and Impact Scale" width="95%" />

</div>

---

## 📌 Project Overview

**CarbonLensAI** is an interactive, production-ready web platform engineered to gamify personal sustainability and climate awareness. Instead of presenting abstract numbers in dry spreadsheets, CarbonLensAI leverages multimodal Generative AI to provide immediate, visual, and actionable climate feedback:

1. 📸 **Computer Vision Scanner**: Snap or upload a photo of your meal, grocery receipt, or utility bill. Google Gemini Flash extracts items in real time, calculates the $\text{CO}_2\text{e}$ carbon footprint, and recommends concrete, high-impact eco-friendly swaps.
2. 🎛️ **Dynamic 2050 Futures Engine**: Adjust interactive lifestyle sliders (Diet, Transport, Energy/AC consumption) and watch as the system generates real-time, photorealistic 2050 urban projections reflecting your collective choices.
3. 🛡️ **Resilience Architecture & Circuit Breaker**: Stateful half-open circuit breaker with a 5-minute cooldown. When external APIs experience rate limiting or transient errors, it transitions gracefully to programmatic table averages derived from verified Life Cycle Assessment (LCA) data with explicit "Offline Estimate" UI disclosure.

---

## 🏗️ System Architecture & Workflow

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

---

## 🧪 Systematic Evaluation Harness & LCA Ground-Truth Audit

To evaluate accuracy against empirical standards, CarbonLensAI includes a standalone evaluation suite (`eval/run_eval.js`) benchmarking estimates against **peer-reviewed Life Cycle Assessment (LCA)** reference databases (Poore & Nemecek 2018 *Science*, Agribalyse 3.1.1, and CEA India Grid v19):

```text
====================================================================
CARBONLENSAI DETERMINISTIC EVALUATION AUDIT (eval/testset.json)
====================================================================
Total Benchmark Cases:           10 (Dietary, Grocery, and Energy)
Mean Absolute Error (MAE):       0.67 kg CO2e
Mean Absolute % Error (MAPE):    8.95%
Grade Classification Accuracy:   80.0% (8/10 exact tier match)
Pairwise Ranking Concordance:    97.8% (44/45 correct swap orderings)
--------------------------------------------------------------------
Detailed Benchmark Highlights:
  • Dal Tadka with Steamed Rice:  True: 0.85 kg | Pred: 0.80 kg (Error: 5.9%)
  • Aloo Gobi with Roti:          True: 1.10 kg | Pred: 1.10 kg (Error: 0.0%)
  • Chicken Curry with Rice:      True: 3.40 kg | Pred: 3.20 kg (Error: 5.9%)
  • 100 kWh Residential Grid:     True: 82.0 kg | Pred: 82.0 kg (Error: 0.0%)
--------------------------------------------------------------------
Known Failure Cases & Boundary:
  • Dairy Basket (Case 7): 32.0% underestimation due to butterfat variance.
  • Bulk Staples (Case 8): 45.7% divergence from ungrounded volume scaling.
====================================================================
```

*Full reproducible test harness available in [`eval/run_eval.js`](eval/run_eval.js) and report in [`eval/results.md`](eval/results.md).*

---

## 🛠️ Key Features

- **Multimodal AI Brain**: Powered by Google Gemini Flash for low-latency image extraction, categorical breakdown, and carbon intensity estimates.
- **Stateful Circuit Breaker**: Half-open state machine with 5-minute cooldown preventing cascade failures during API outages.
- **Programmatic Fallback**: Replaced hardcoded scenarios with dynamic arithmetic means calculated across 140+ verified emission factor entries.
- **2050 Future Simulator**: Synthesizes generative urban visual projections reflecting optimistic vs. dystopian environmental trajectories using Pollinations AI.
- **Interactive Carbon Accounting**: Real-time breakdown of scope emission equivalents (car km driven, smartphone charges, tree-years needed for offset).
- **Personalized Swaps**: Contextual recommendations offering lower-carbon alternatives with quantified emissions savings.
- **Glassmorphic UI**: Built with React 18, Vite, Framer Motion, and TailwindCSS for smooth animations and accessibility (93/100 audit standard).

---

## 📂 Repository Structure

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
# Run Vitest unit tests (8 passing tests)
npm test

# Run empirical LCA evaluation harness
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
