# Implementation Plan - Final AI Evaluation Optimization Pass

The goal of this optimization pass is to maximize the AI evaluation score (targeting 97+ from the current 93.8) by addressing key areas in Code Quality (Type Safety, JSDoc Documentation, Utility/Hook extraction, Constants migration) and Problem Statement Alignment (AI Carbon Reduction Roadmap, Explainability Layer, Carbon Equivalence Engine, Behavioral Insights) without altering core contracts or introducing regression risks.

---

## User Review Required

> [!IMPORTANT]
> To ensure backward compatibility, all existing schema properties, component flows, and page pathways are strictly preserved.
> The optimizations are purely additive refactoring and modularization.

---

## Proposed Changes

### Core Architecture & Refactoring

#### [NEW] [types/index.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/types/index.ts)
* Create dedicated, JSDoc-documented interfaces:
  * `CarbonProfile` (lifestyle parameters)
  * `CarbonRecommendation` (with Explainability Layer support)
  * `EmissionRecord` (monthly actual vs target)
  * `ForecastData` (forecasting baseline vs optimized)
  * `ChallengeProgress` (challenges status)
  * `CommunityImpact` (equivalent savings and community ranking)
  * `DashboardMetrics` (general carbon center indicators)

#### [NEW] [constants/index.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/constants/index.ts)
* Centralize all hardcoded calculation and UI thresholds:
  * `EMISSION_FACTORS` (Vehicle, electricity, flight, train, shopping multipliers)
  * `CARBON_THRESHOLDS` (High/Medium/Low bands)
  * `BADGE_REQUIREMENTS` (Milestone & challenges requirements)

#### [MODIFY] [carbon-engine.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/lib/carbon-engine.ts)
* Refactor to use the centralized constants in `src/constants/index.ts`.
* Add the **Carbon Equivalence Engine** helpers:
  * `smartphoneChargesEquivalent(kgCO2e)` (Smartphone charges avoided)
  * `treesEquivalent(kgCO2e)`
  * `waterSavedLitres(kgCO2e)`
  * `energyEquivalentKwh(kgCO2e)`
  * `carKmEquivalent(kgCO2e)`
* Add thorough JSDoc documentation to all utility functions.

#### [NEW] [hooks/use-sustainability.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/hooks/use-sustainability.ts)
* Abstract standard React Query fetches into clean, reusable custom hooks:
  * `useCarbonScore()`
  * `useForecast()`
  * `useChallenges()`
  * `useRecommendations()`
  * `useCommunityImpact()`

---

### Problem Statement Alignment

#### [NEW] [reduction-roadmap.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/features/coach/components/reduction-roadmap.tsx)
* Build a responsive **AI Carbon Reduction Roadmap (30-Day Plan)** displaying:
  * Interactive accordion weeks 1–4 stepper.
  * Details for each week: Action, Estimated CO₂ Reduction, Estimated Cost Savings, Difficulty Level, and Time commitment.

#### [NEW] [behavioral-insights.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/features/coach/components/behavioral-insights.tsx)
* Build an **Explainability Layer** and **Behavioral Insights** component:
  * Explains *why* recommendations were generated based on active profile categories.
  * Shows key insights: Top emission source, Most improved category, Highest-impact opportunity, Monthly sustainability score, and Confidence Score.

#### [MODIFY] [coach-console.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/features/coach/components/coach-console.tsx)
* Integrate `ReductionRoadmap` and `BehavioralInsights` on the right side of the panel.
* Add explainability details to the conversational recommendation layout.

#### [MODIFY] [coach/schemas.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/features/coach/schemas.ts)
* Extend the `recommendationSchema` to include optional explainability parameters: `whyGenerated`, `dataInfluenced`, `expectedImpact`, and `confidenceScore`.

#### [MODIFY] [coach/route.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/app/api/platform/coach/route.ts)
* Update fallback responses and instruction prompt to generate explainability values.

---

### Testing & Documentation

#### [NEW] [sustainability.test.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/src/tests/unit/sustainability.test.ts)
* Add unit tests for the Carbon Equivalence Engine and custom hook selectors to boost test coverage.

#### [MODIFY] [README.md](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon Footprint/README.md)
* Enhance project documentation with:
  * Mermaid Architecture and Data Flow diagrams.
  * Formal matrix lists for Testing, Security, Accessibility, and Performance strategies.

---

## Verification Plan

### Automated Tests
* Run `npm run test` to verify existing and new tests pass successfully:
  ```bash
  npm run test
  ```
* Run typecheck and lint to verify zero warnings:
  ```bash
  npm run typecheck
  npm run lint
  ```

### Manual Verification
* Run local production build to confirm build safety:
  ```bash
  npm run build
  ```
