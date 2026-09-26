# TerraCrop AI 🛰️🌱

> **"See the climate. Understand your soil. Plan your future."**

TerraCrop AI is a climate-aware crop rotation decision-support platform designed for modern agriculture. It combines NASA Earth observation datasets (POWER, MODIS, SMAP), local soil characteristics, hydrology constraints, and farmer operational priorities with a **deterministic agro-ecological optimization engine** and explainable AI.

---

## 🏛️ Architectural Principle: The Scientific Loop

Traditional AI platforms make the mistake of asking an LLM: *"What crop should I plant next?"* — resulting in ungrounded, non-reproducible answers. 

TerraCrop AI implements a strict separation of concerns:

```
               ┌───────────────────────┐
               │      FARMER DATA      │
               │ Soil, Crops, Priorities│
               └───────────┬───────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │    EARTH DATA (NASA)  │
               │  POWER, SMAP, MODIS   │
               └───────────┬───────────┘
                           │
                           ▼
        ┌─────────────────────────────────────┐
        │       STRUCTURED CONSTRAINTS        │
        │ Incompatibilities, Moisture Limits  │
        └──────────────────┬──────────────────┘
                           │
                           ▼
        ┌─────────────────────────────────────┐
        │     CROP ROTATION OPTIMIZER         │
        │  Multi-Attribute Utility Theory     │
        │  Deterministic & 100% Reproducible  │
        └──────────────────┬──────────────────┘
                           │
            ┌──────────────┴──────────────┐
            ▼                             ▼
  ┌───────────────────┐         ┌───────────────────┐
  │   CROP PLANNER    │         │   SCENARIO LAB    │
  │ Multi-Year Plan   │         │ Climate Stress    │
  └─────────┬─────────┘         └─────────┬─────────┘
            │                             │
            └──────────────┬──────────────┘
                           │
                           ▼
               ┌───────────────────────┐
               │       ASK TERRA       │
               │  Contextual AI Rationale│
               │  "Explain The Why"    │
               └───────────────────────┘
```

The core loop: **OBSERVE → ANALYZE → SIMULATE → COMPARE → DECIDE**

---

## ✨ Key Features

1. **Farmer-Friendly UI & The 5-Second Rule**:
   - Designed for effortless clarity: understand farm health, main water/heat concerns, and the recommended action in 5 seconds.
   - Large touch targets (minimum 48×48px), comfortable high-contrast typography, and zero confusing acronyms in primary screens.
   - Built-in **Text-to-Speech (TTS) Read Aloud** audio guide on every recommendation and farm summary.
   - **Text Size Adjustment** (Normal, Large, Extra Large) for clear legibility on mobile devices.
   - **Bilingual Interface**: Full English and Bangla (বাংলা) translation support for buttons, crop names, statuses, and explanations.

2. **5-Step Guided Onboarding**:
   - Step 1: Location (GPS coordinate detection, regional agro-basins, or place name).
   - Step 2: Farm size (stepper input with instant Acre / Hectare switcher).
   - Step 3: Soil type (Loamy, Sandy, Clay, Silty, or honest "Not sure" estimate).
   - Step 4: Current standing crop with visual photo-icons and localized names.
   - Step 5: Farm goals (Save water, Keep soil healthy, Reduce risk, Good harvest, Crop diversity).

3. **Mobile-First Bottom Navigation**:
   - 4 large primary bottom navigation items with icons and text labels:
     1. **Home**
     2. **Farm**
     3. **Crop Plan**
     4. **Ask Terra**
   - Accessible slide-out drawer for advanced tools (Climate Map, Scenario Lab, Data Sources, Settings).

4. **Farm Intelligence Dashboard**:
   - Clear 3-indicator status card: **Water in Soil**, **Weather & Heat**, and **Crop Greenness**.
   - Primary 1-tap action: *"Help Me Choose My Next Crop"*.
   - Optional *"Show NASA Satellite Numbers"* drawer to inspect raw radiometric telemetry (NDVI, SMAP, POWER) without cluttering the screen by default.

5. **Crop Rotation Planner (Primary Feature)**:
   - Deterministic multi-year crop succession schedules (1 to 5 years).
   - Visual timeline with localized crop names (e.g. Rice / ধান, Chickpea / ছোলা).
   - *"Why this crop?"* button with plain-language reasons and audio readout.
   - 1-tap strategy selector: **Best Balanced**, **Save Water**, and **Repeat Same Crop**.

6. **Ask Terra (Friendly AI & Voice Assistant)**:
   - Speech-to-Text microphone input for voice inquiries.
   - Text-to-Speech audio readout for every answer.
   - 1-tap suggested question chips for quick answers.
   - Grounded strictly in real farm observations without hallucinations.

7. **Data Sources & Provenance**:
   - Transparent registry detailing NASA POWER, MODIS, SMAP, SoilGrids, and AgMIP ontology data types, orbital resolutions, and influence on planning.

8. **Zero-Configuration Demo Mode**:
   - Fully functional immediately after installation without requiring external API keys.
   - Preloaded with the benchmark **Green Valley Farm** (25 acres, Loamy soil, Central Valley, California).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend & API**: Express.js with Vite middleware integration in `server.ts`.
- **Optimization Layer**: Deterministic Multi-Attribute Utility Theory (MAUT) & Biological Succession Rules.
- **Environmental Layer**: NASA POWER Agroclimatology, MODIS NDVI, and SMAP soil moisture calibration.
- **AI Layer**: `@google/genai` (Gemini 3.8 Flash) with deterministic domain-specific agronomic fallback.

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Environment Variables (Optional)

Copy `.env.example` to `.env`:

```bash
# GEMINI_API_KEY: Optional. If omitted, TerraCrop AI runs on its built-in deterministic agro-reasoning engine.
GEMINI_API_KEY="your-api-key-here"
```

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

### 4. Run Test Suite

```bash
npm test
```

Verifies crop compatibility rules, priority weighting math, deterministic optimizer reproducibility, and scenario stress calculations.

---

## 🧪 Testing Coverage

The integrated test suite checks:
- **Agronomic Succession Rules**: Monoculture repetition penalties, nematode/fungal disease break intervals.
- **Weight Normalization**: Mathematical verification that priority multipliers strictly sum to 1.000.
- **Reproducibility**: Calling the optimizer with identical inputs produces 100% identical rotations.
- **Microclimate Resilience**: Verifies that simulated droughts adaptively increase drought-tolerant crop scores.
- **Telemetry Grounding**: Verifies that the AI assistant references actual farm telemetry.

---

## 📄 License

Apache-2.0 License.
