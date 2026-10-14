# BPL Dream 11 — Eye-Soothing Design System & Tokens

## 1. Design Philosophy
The BPL Dream 11 aesthetic balances high-energy sports fantasy with calm, eye-soothing readability. It eliminates harsh eye fatigue by avoiding oversaturated neon floods, instead using subtle glass surfaces, soft elevations, and intentional accent pops.

---

## 2. Color Palette & Semantic Tokens

### Day Match Mode (`:root`)
- **Canvas / Background**: `#f4f6f8` (Crisp, warm neutral ground)
- **Card Surface**: `#ffffff` (Pure white card bodies)
- **Elevated Surfaces**: `#f8fafc` (Subtle hover states)
- **Muted Surfaces**: `#eef2f6` (Pill badges, stats slots)
- **Text Primary**: `#0f172a` (Deep slate heading text, WCAG AAA)
- **Text Secondary**: `#475569` (Muted metadata labels)
- **Text Muted**: `#64748b` (Tertiary captions)
- **Subtle Borders**: `rgba(15, 23, 42, 0.07)`

### Floodlight Night Match Mode (`html.dark`)
- **Canvas / Background**: `#0b111e` (Deep midnight navy)
- **Card Surface**: `#111927` (Rich dark slate glass)
- **Elevated Surfaces**: `#182235` (Stadium floodlight elevated cards)
- **Muted Surfaces**: `#1e293b` (Subtle pill fills)
- **Text Primary**: `#e2e8f0` (Crisp off-white)
- **Text Secondary**: `#94a3b8` (Muted silver)
- **Text Muted**: `#64748b` (Subtle captions)
- **Subtle Borders**: `rgba(255, 255, 255, 0.08)`

### Accents & Functional Colors
- **Primary CTA Accent**: `#e7fb25` (Neon Volt reserved strictly for primary buttons and active pills)
- **Positive Indicators / Success**: `#10b981` (Emerald green for win rates, claims, and progress bars)
- **Leadership / Star Ratings**: `#f59e0b` (Warm amber-gold for Captain crown, ratings, and coin emblems)
- **Overseas / Vice-Captain**: `#3b82f6` (Cyan-blue for overseas quotas and VC stars)
- **Destructive / Delete**: `#ef4444` (Soft rose red for player removals)

---

## 3. Typography Hierarchy
- **Primary Body Font**: `Inter`, `-apple-system`, `sans-serif`
- **Display & Headings**: `Outfit`, `Plus Jakarta Sans`, `Inter`, `sans-serif`
- **Bangla Script Fallback**: `Hind Siliguri`, `Noto Sans Bengali` (ensuring flawless conjuncts and ligatures for bilingual toggles)

---

## 4. Motion & Micro-Interactions
- **3D Tilt Interaction**: Softened to max 5° tilt, 1.01 scale, and 0.07 glare opacity for refined feedback.
- **Accessibility**: All animations honor `@media (prefers-reduced-motion: reduce)`.
