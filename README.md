# 👶 Project Cradle: High-Integrity Pediatric Surveillance

![Status](https://img.shields.io/badge/Status-Development_Phase-7C3AED?style=for-the-badge)
![Expo](https://img.shields.io/badge/Expo_SDK-54+-000020?style=for-the-badge&logo=expo&logoColor=white)
![Architecture](https://img.shields.io/badge/Architecture-Trilateral-10B981?style=for-the-badge)
![UI](https://img.shields.io/badge/Design-Serene_Cloud-F472B6?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-Fabric_Enabled-orange?style=for-the-badge)

**Project Cradle** is an enterprise-grade pediatric tracking and predictive analytics system. Developed by ZenithCore, it moves beyond "baby logging" into **Biometric Surveillance**, providing exhausted caregivers with a high-fidelity "Command Center" for infant health, sleep optimization, and cognitive development [cite: 2026-12-22].

---

## 🏗️ Trilateral System Architecture

Every action within Project Cradle follows a strict three-tier propagation pattern to ensure data integrity and real-time responsiveness.

- **Fiscal Layer (Data Integrity):** Every event (Feeding, Diaper, Medication) is treated as an idempotent transaction. Utilizing `correlationId` and immutable audit trails, we ensure zero data loss during offline-to-online transitions.
- **Messaging Layer (Real-time Flow):** Local state mutations in **Zustand 5** trigger high-performance **Reanimated 3** transitions before propagating to the Spring Boot API Gateway via Firebase.
- **Surveillance Layer (Predictive Intelligence):** The "SweetSpot®" engine analyzes historical data to project future sleep windows, visualized through a glowing, high-contrast circular interface.

---

## 🛡️ Technical Moats (Core Pillars)

| Pillar                | Implementation                      | Strategic Benefit                                                                                 |
| :-------------------- | :---------------------------------- | :------------------------------------------------------------------------------------------------ |
| **SweetSpot® Engine** | Reanimated 3 + Predictive Logic     | **Surveillance:** Real-time sleep window forecasting with 60fps fluid visual feedback.            |
| **Berry AI Terminal** | Secure Messaging + Expert Mesh      | **Guidance:** Empathetic, terminal-style AI guidance vetted by pediatric specialists.             |
| **Bento Grid UI**     | NativeWind v4 + Responsive Prefixes | **Accessibility:** WCAG AAA contrast ratios for sleep-deprived parents in low-light environments. |
| **Idempotent Ledger** | UUID Correlation + Fiscal Logging   | **Reliability:** Immutable event history ensuring medical-grade tracking accuracy.                |

---

## 🚀 Key Features

### 🕒 SweetSpot® Surveillance

- **Predictive Windows:** Uses historical sleep latency patterns to predict the exact moment a baby's "Sleep Window" opens.
- **Visual Glow:** The interface transitions to `Emerald-500` (Success) when the window is optimal, reducing parental "guesswork" stress.

### 🤖 Berry AI (Secure Guidance)

- **Terminal Interface:** A high-integrity messaging feed that provides instant, evidence-based answers to caregiving queries.
- **Secure Mesh:** All AI interactions are encrypted and treated as high-sensitivity biometric consultations.

### 📊 One-Touch Trackers

- **High-Fidelity Inputs:** Optimized for single-handed use.
- **Audit Trail:** Every log generates a transparent `transactionId` visible in the event ledger, ensuring a clear timeline for pediatric consultations.

---

## 🛠️ Technology Stack

| Component     | Technology              | Version | Purpose                                 |
| :------------ | :---------------------- | :------ | :-------------------------------------- |
| **Framework** | Expo (Fabric Enabled)   | 54.x    | Cross-platform performance & New Arch   |
| **Routing**   | Expo Router             | v4      | Type-safe, file-based navigation        |
| **Styling**   | NativeWind (Tailwind)   | v4      | Responsive "Serene Cloud" design system |
| **State**     | Zustand                 | 5.0.9   | Trilateral Store (Auth, Cradle, Health) |
| **Animation** | React Native Reanimated | 3.x     | Fluid 60fps UI transitions              |
| **Icons**     | Lucide React Native     | Latest  | High-clarity, accessible iconography    |
| **Backend**   | Firebase + Spring Boot  | 3.4.1   | Secure storage & API orchestration      |

---

## 🗺️ Project Roadmap: The Evolutionary Path

### Phase 1: Foundation & Atomic State (Current)

- [ ] Initialize Expo SDK 54 project with Fabric and New Architecture.
- [ ] Implement **Trilateral Store** using Zustand (AuthStore, CradleStore, HealthStore).
- [ ] Set up **NativeWind v4** configuration with "Serene Cloud" color palette.
- [ ] Configure Expo Router v4 with (auth) and (app) protected groups.

### Phase 2: Surveillance Core (The SweetSpot)

- [ ] Build `SweetSpotProgress` component using Reanimated 3.
- [ ] Develop the predictive algorithm for sleep window calculation.
- [ ] Implement **Fiscal Logging** for Sleep and Feedings (Idempotent transactions).
- [ ] Integration of Lucide icons for high-contrast accessibility.

### Phase 3: Cognitive Layer (Berry AI)

- [ ] Launch **Berry AI Terminal** – Secure messaging UI for guidance.
- [ ] Implement Firebase Functions for AI orchestration and expert content retrieval.
- [ ] Establish **Immutable Audit Trail** UI for reviewing daily event ledgers.
- [ ] Deploy local Toast notifications with "Trilateral Feedback" loops.

### Phase 4: Ecosystem & Hardening

- [ ] Role-Based Access Control (RBAC) for primary caregivers vs. secondary sitters.
- [ ] Offline-first synchronization with Spring Boot API Gateway.
- [ ] Biometric gate implementation for sensitive health logs.
- [ ] Full WCAG AAA accessibility audit and dark-mode optimization.

---

## 📂 Project Structure

```text
/
├── app/                        # Expo Router (File-based routes)
│   ├── (auth)/                 # Biometric & Session Gates
│   ├── (app)/                  # Main Surveillance Dashboard
│   └── _layout.tsx             # Root Provider Mesh
├── src/
│   ├── components/
│   │   ├── surveillance/       # SweetSpot®, Pattern Visualizers
│   │   ├── guidance/           # Berry AI Terminal components
│   │   └── ui/                 # Serene Cloud Bento primitives
│   ├── store/                  # Zustand Trilateral Stores
│   ├── hooks/                  # Predictive Logic & Sync Hooks
│   └── utils/                  # Fiscal Logging & UUID Helpers
├── tailwind.config.js          # Serene Cloud Theme Definition
└── package.json                # Dependency Manifest
```
