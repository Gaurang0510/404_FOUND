# Design System Strategy: The Nocturnal Concierge

## 1. Overview & Creative North Star
The visual identity of this design system is defined by the **"Nocturnal Concierge"**—a creative north star that prioritizes deep, immersive focus and quiet authority. While typical management software feels like a spreadsheet, this system feels like a high-end boutique hotel lobby at midnight: calm, sophisticated, and illuminated only where necessary.

To move beyond the "template" look, we reject the rigid, boxed-in grid. Instead, we embrace **Intentional Asymmetry**. Important data visualizations or hero "Room Status" cards should break the vertical rhythm, using the `xl` (1.5rem) roundedness to create a soft, organic flow. We lean into high-contrast typography scales where `display-lg` headlines command attention against a vast, `surface-dim` (#060e20) canvas, creating an editorial feel that emphasizes clarity over clutter.

---

## 2. Colors & Surface Philosophy
Our palette is rooted in the depth of the night. We use `surface` tokens not just as backgrounds, but as a methodology for information architecture.

*   **The "No-Line" Rule:** We do not use 1px solid borders to define sections. Sectioning is achieved exclusively through background shifts. For example, a sidebar using `surface-container-high` (#141f38) sits flush against a `surface` (#060e20) main content area. The eye perceives the boundary through the tonal shift, keeping the UI "breathable."
*   **Surface Hierarchy & Nesting:** Treat the UI as physical layers of smoked glass.
    *   **Level 0 (Base):** `surface` (#060e20).
    *   **Level 1 (Sections):** `surface-container-low` (#091328).
    *   **Level 2 (Active Cards):** `surface-container-highest` (#192540).
*   **The "Glass & Gradient" Rule:** To inject "soul," CTAs and high-priority status indicators must use subtle linear gradients (e.g., `primary` to `primary-dim`). For floating modals or "Request" overlays, use Glassmorphism: `surface-variant` at 60% opacity with a `20px` backdrop-blur.
*   **Vibrant Accents:** Use `secondary` (#69f6b8) for success and `tertiary` (#ffb148) for warnings. These must appear as glowing beacons against the dark charcoal base, never as flat, dull blocks.

---

## 3. Typography
We utilize a dual-font system to balance editorial personality with functional precision.

*   **Headlines (Manrope):** Chosen for its modern, geometric flair. Use `display-md` for dashboard welcomes and `headline-sm` for card titles. The generous x-height of Manrope ensures legibility against dark backgrounds.
*   **Functional Labels (Inter):** For high-density data like room numbers or guest IDs, we shift to Inter (`label-md`). Its neutral, Swiss-style precision provides the necessary "utility" feel for a management app.
*   **Hierarchy via Scale:** We create a "staccato" rhythm. A massive `display-lg` occupancy percentage sits next to a tiny, all-caps `label-sm` unit, creating a sophisticated, high-end editorial tension.

---

## 4. Elevation & Depth
Depth in this system is a result of **Tonal Layering**, not structural shadows.

*   **The Layering Principle:** Avoid the "floating box" look. Instead, "nest" content. A guest detail card (`surface-container-highest`) should feel like it is embedded within the dashboard area (`surface-container-low`).
*   **Ambient Shadows:** If a component must float (like a "New Booking" FAB), use a shadow color tinted with `surface-tint` (#a3a6ff) at 8% opacity. This mimics the way a purple-blue light source would naturally cast a glow in a dark room.
*   **The "Ghost Border" Fallback:** In high-density tables where separation is critical, use a "Ghost Border": `outline-variant` (#40485d) at **15% opacity**. It should be felt, not seen.
*   **Glassmorphism:** Use for persistent navigation or "Requests" drawers. It maintains the user's context by allowing the colorful "Room Status" cards to bleed through the blur.

---

## 5. Components

### Cards & Lists
*   **Rule:** Forbid divider lines. Use `spacing-6` (1.5rem) of vertical whitespace to separate items. 
*   **Style:** All cards must use `rounded-xl` (1.5rem). The background should be `surface-container-highest`. Use a subtle 45-degree gradient of `surface-bright` to `surface-container` to give the card a "milled" look.

### Buttons
*   **Primary:** A gradient-fill using `primary` (#a3a6ff) to `primary-dim` (#6063ee). Use `on-primary` for text. Corner radius: `full`.
*   **Secondary:** Ghost style. No fill, `outline` (#6d758c) at 20% opacity, with `primary` text.
*   **Tertiary:** Text-only with an icon. High-quality, thin-stroke iconography (2pt) only.

### Status Chips
*   **Approved:** Background `secondary-container` (#006c49), Text `on-secondary-container` (#e1ffec).
*   **Pending:** Background `tertiary-container` (#f8a010), Text `on-tertiary-container` (#4a2c00).
*   **Rejected:** Background `error-container` (#a70138), Text `on-error-container` (#ffb2b9).

### Input Fields
*   **Style:** Minimalist. No bottom line. A solid block of `surface-container-low` with `rounded-md`. On focus, the background shifts to `surface-bright` with a `primary` "Ghost Border."

### Special Component: The "Room Ribbon"
A horizontal scrolling list of room statuses. Each room is a tall, narrow card. Use `secondary` for "Clean," `tertiary` for "Dirty," and `primary` for "Occupied." This breaks the standard dashboard grid and provides a signature visual element.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `spacing-20` (5rem) for top-level padding to create a "Gallery" feel.
*   **Do** use `on-surface-variant` (#a3aac4) for secondary text to reduce visual noise.
*   **Do** ensure all interactive elements have a minimum touch target of 44px, despite the minimalist look.

### Don't
*   **Don't** use pure black (#000000) for backgrounds; it kills the "Nocturnal" depth. Use `surface-dim` (#060e20).
*   **Don't** use 100% opaque borders. They create "visual friction" and make the app look like a legacy enterprise tool.
*   **Don't** use standard "drop shadows." Use tonal shifts and light-tinted ambient glows only.
*   **Don't** use more than two vibrant colors in a single card. Let one color lead to maintain the high-end aesthetic.