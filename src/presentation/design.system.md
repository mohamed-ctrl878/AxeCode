# Design System: Antigravity Core
**Version:** 1.0.0  
**Theme:** Futuristic Minimal / Dark SaaS  
**Core Philosophy:** Depth through shadows, clarity through grids, and a sense of weightlessness.

---

## 1. Foundation

### 1.1 Color Palette
The palette is built on "Perfect Black" to ensure maximum contrast with neon accents and crisp white typography.

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Base-Black** | `#000000` | Main page background |
| **Surface-Dark** | `#0A0A0A` | Secondary sections / Large containers |
| **Card-Bg** | `#121212` | Individual Bento components |
| **Border-Subtle** | `#1F1F1F` | Default component borders |
| **Accent-Primary** | `#34D399` | Emerald Glow (Primary actions/highlights) |
| **Text-Primary** | `#FFFFFF` | Headings and high-emphasis text |
| **Text-Muted** | `#A1A1AA` | Body copy and descriptions |

### 1.2 Typography
Focus on geometric sans-serif typefaces for a modern, technical feel.

- **Primary Font:** *Inter* or *Google Sans*
- **Monospace Font:** *JetBrains Mono* (For code blocks and technical data)

| Element | Size | Weight | Letter Spacing |
| :--- | :--- | :--- | :--- |
| **Heading Lg** | 64px | 700 (Bold) | -0.02em |
| **Heading Md** | 32px | 600 (Semi-Bold)| -0.01em |
| **Body Base** | 16px | 400 (Regular) | 0.01em |
| **Caption** | 12px | 500 (Medium) | 0.05em |

---

## 2. Layout Patterns

### 2.1 The Bento Grid
All content must be organized into a modular grid inspired by Japanese Bento boxes.
- **Gap:** 16px or 24px.
- **Corner Radius:** `24px` for all cards.
- **Border:** `1px solid var(--Border-Subtle)`.
- **Hover State:** Border color shifts to `#333333` with a subtle outer glow.

### 2.2 Glassmorphism (Overlays)
For modals or floating navigation bars:
- **Background:** `rgba(10, 10, 10, 0.7)`
- **Blur:** `backdrop-filter: blur(12px);`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`

---

## 3. Components

### 3.1 Primary Button (High Contrast)
- **Background:** `#FFFFFF`
- **Text:** `#000000`
- **Radius:** `99px` (Pill shape)
- **Effect:** On hover, slight scale up (`scale: 1.05`).

### 3.2 Feature Card
A container designed for the Bento Grid.
- **Structure:** - Top: Linear Icon (24x24px, Accent color)
  - Middle: Title (White)
  - Bottom: Description (Muted Gray)
- **Visual:** No heavy shadows; use a `1px` stroke to define shape.

### 3.3 Status Indicators
Small, glowing dots for "Live" or "Active" states.
- **Active:** Emerald green with a 4px blur pulse animation.

---

## 4. Iconography
- **Style:** Outlined / Linear.
- **Weight:** 1.5pt Stroke.
- **Color:** Use `Text-Muted` for inactive states and `Accent-Primary` for active features.

---

## 5. Motion & Animation
- **Transition Speed:** 300ms (Ease-out).
- **Entrance:** Vertical slide (20px) with opacity fade.
- **Scroll:** Sticky headers and parallax "floating" cards to simulate zero gravity.