# Implementation Plan - Maximizing Code Quality & Problem Alignment Scores

This plan outlines optimizations to address the Hack2Skill evaluation findings (Attempt 2: 94.87/100 overall, with Code Quality at **89/100** and Alignment at **94/100**). We will introduce deep interactivity, state persistence, and client-side validations to elevate these sections above 97+.

---

## User Review Required

> [!IMPORTANT]
> - **State Persistency**: Challenges progress, streak count, achievements, and simulator targets will now be persisted in `localStorage` via the existing Zustand store. This guarantees that interactions are saved across page reloads.
> - **Dynamic Dashboard**: The dashboard trend lines will dynamically shift based on the target you set in the Simulator.

---

## Proposed Changes

### Core UI & Code Quality
#### [MODIFY] [layout.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/app/layout.tsx)
* Inject a small, render-blocking inline script in the `<head>` to check `localStorage` theme settings and apply the `.dark` class immediately on load. This completely resolves the **Flash of Unstyled Content (FOUC)** theme issue.

#### [MODIFY] [platform-shell.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/components/layout/platform-shell.tsx)
* Convert the layout shell to a client component and use `usePathname` from `next/navigation` to dynamically highlight the active path in the mobile navigation bar.

#### [MODIFY] [receipt-scanner-panel.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/features/receipts/components/receipt-scanner-panel.tsx)
* Add client-side size validation to the file input. Reject uploads larger than 3MB with a warning toast to prevent crashing serverless execution limits.

#### [MODIFY] [carbon-engine.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/lib/carbon-engine.ts)
* Simplify and optimize the math logic in `calculateShoppingFootprint` to remove redundant rounding calls.

---

### Problem Statement Alignment & Gamification
#### [MODIFY] [user-profile.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/stores/user-profile.ts)
* Extend the Zustand `UserProfileState` model to persist the following gamification and targets data:
  * `reductionTargetKg`: User's carbon reduction goal (default: 15% under baseline).
  * `streakDays`: Active consecutive green habit streak (default: 13).
  * `completedChallengesCount`: Total challenges completed (default: 8).
  * `challengesProgress`: Record mapping active challenge titles to progress numbers.
  * `achievementsUnlocked`: Array of unlocked badge/achievement structures.
* Expose mutation actions:
  * `setReductionTargetKg(kg)`
  * `incrementChallengeProgress(title, increment)`
  * `unlockAchievement(achievement)`

#### [MODIFY] [what-if-simulator.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/features/simulator/components/what-if-simulator.tsx)
* Add an interactive button: **"Commit Simulation as Target"**.
* Clicking this button updates `reductionTargetKg` in the Zustand store and displays a success toast.

#### [MODIFY] [overview/route.ts](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/app/api/platform/overview/route.ts)
* Update the GET endpoint to read the optional `reductionTargetKg` parameter from search queries.
* Calculate the dynamic dashboard baseline/target comparison vectors relative to this custom target value instead of hardcoded ratios.

#### [MODIFY] [dashboard-overview.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/features/dashboard/components/dashboard-overview.tsx)
* Extract the custom `reductionTargetKg` from the Zustand store and pass it as a query parameter inside `overviewQuery`.
* Bind the **Green Habit Streak** display card directly to the persisted `streakDays` Zustand state.

#### [MODIFY] [challenges-board.tsx](file:///c:/Users/SHUBHAM/OneDrive/Documents/Carbon%20Footprint/src/features/challenges/components/challenges-board.tsx)
* Refactor the page to read and modify state using the Zustand `useUserProfile` store (enabling full client-side mock persistence).
* Add a **"Log Activity"** button to the active challenges cards.
* Clicking this button increments progress by **25%** and fires a toast.
* When progress reaches **100%**, display a custom success toast (e.g., *"Transit Trailblazer Unlocked!"*), update the completed challenge count, increase the streak counter by 1, and add the achievement to the gallery.

---

## Verification Plan

### Automated Tests
* Run unit tests to check state updating mutations:
  ```bash
  npm run test
  ```
* Run linter and typecheck to verify zero warnings:
  ```bash
  npm run typecheck
  npm run lint
  ```

### Manual Verification
* Run production builds to check bundle optimization:
  ```bash
  npm run build
  ```
