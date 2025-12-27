# 🏛️ PROJECT CRADLE

![Status](https://img.shields.io/badge/Status-Architectural_Hardening-7C3AED?style=for-the-badge)
![Engine](https://img.shields.io/badge/Engine-Fabric_Reanimated_3-F472B6?style=for-the-badge)
![UI](https://img.shields.io/badge/Design-Glassmorphic_Teal_Cloud-10B981?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Supabase_Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

Project Cradle is a high-integrity, AI-powered parenting core built on a secure biometric intelligence stack. It leverages a glassmorphic teal cloud UI and a hardened PostgreSQL backend to manage pediatric care events with military-grade encryption.

---

## 🛠️ ARCHITECTURAL STACK

### Core Intelligence

- **Framework**: React Native / Expo (Router v3)
- **Animations**: Expo Reanimated 3 (Fabric-ready)
- **Auth**: Supabase GoTrue with session persistence
- **Database**: Supabase PostgreSQL with RLS (Row Level Security)
- **Styling**: NativeWind (Tailwind CSS) & Glassmorphism

---

## 🛡️ SECURITY & INTEGRITY

The platform implements a multi-layer security protocol to protect the family core:

- **AES-256 Encryption**: All biometric profile data is encrypted at rest.
- **Biometric Synchronization**: Real-time session sync across intelligence nodes.
- **RLS Enforcement**: Row Level Security ensures caregivers only access their specific family ledger.
- **Password Validation**: Real-time security meter requiring 8+ characters and mixed symbols.

---

## 🚀 RECENT COMMITS & HARDENING

The repository follows a professional development lifecycle:

| Commit          | Scope            | Purpose                                                 |
| :-------------- | :--------------- | :------------------------------------------------------ |
| `feat(auth)`    | `AuthProvider`   | Initialize session management and context engine        |
| `style(layout)` | `(auth)/_layout` | Enforce deep obsidian theme and split-pane architecture |
| `feat(ui)`      | `sign-up.tsx`    | Implement glassmorphic signup with real-time validation |
| `chore(config)` | `linting`        | Standardize ESLint, Prettier, and .hintrc accessibility |

---

## 🎨 DESIGN SYSTEM: GLASSMORPHIC TEAL

The UI is built on the **Deep Obsidian (#020617)** palette, utilizing semi-transparent glass layers to provide depth and clarity.

- **Surface**: `rgba(15, 23, 42, 0.4)`
- **Primary**: `#4FD1C7` (Teal Cloud)
- **Status Indicators**: Dynamic Sage (#9AE6B4) for success states.

---

## ⚙️ INSTALLATION

1. Clone the intelligence stack.
2. Configure `.env` with Supabase credentials:

   ```bash
   EXPO_PUBLIC_SUPABASE_URL=your_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
