---
name: Modern Nomad
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1b1b1c'
  on-surface-variant: '#464553'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#777585'
  outline-variant: '#c7c4d5'
  surface-tint: '#534ec3'
  primary: '#504bc0'
  on-primary: '#ffffff'
  primary-container: '#6965db'
  on-primary-container: '#fefaff'
  inverse-primary: '#c3c0ff'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffc329'
  on-secondary-container: '#6f5100'
  tertiary: '#575b62'
  on-tertiary: '#ffffff'
  tertiary-container: '#70747b'
  on-tertiary-container: '#fbfbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3a33ab'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#dfe2ea'
  tertiary-fixed-dim: '#c3c6ce'
  on-tertiary-fixed: '#181c21'
  on-tertiary-fixed-variant: '#43474d'
  background: '#fcf9f8'
  on-background: '#1b1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  max-width: 1440px
---

## Brand & Style
The brand personality is **Adventurous, Intelligent, Organized, and Inspiring**. This design system targets the modern traveler—someone who values both the serendipity of exploration and the efficiency of a well-coordinated plan.

The "Modern Nomad" aesthetic blends **Minimalism** with **Glassmorphism**. It utilizes expansive white space to denote organization and clarity, while employing translucent, blurred overlays to create a sense of depth and immersion. High-quality travel imagery is central to the experience, serving as the backdrop for collaborative tools. The result is a premium, editorial feel that balances functional utility with a deep sense of wanderlust.

## Colors
The palette is rooted in the "Modern Nomad" narrative, utilizing a crisp white base to ensure a clean, breathable interface.

*   **Primary (Deep Ocean Blue - #6965DB):** A sophisticated blue that conveys intelligence and reliability. Used for primary navigation, key actions, and active states.
*   **Secondary (Explorer Orange - #FBBF24):** A vibrant, energetic accent used sparingly to highlight points of interest, CTA highlights, and "moment of delight" features.
*   **Tertiary (Sunset Teal / Soft Sky - #F4F7FF):** A very light, tinted neutral used for background sections, card fills, and subtle UI separation.
*   **Neutral (Earth Sand / Charcoal - #1E1E1E):** A deep charcoal for high-contrast typography and iconography, ensuring grounded readability against the lighter base.

## Typography
This design system employs a dual-font strategy to achieve a premium editorial look.

*   **Headlines:** **Noto Serif** is used for all major headings. Its classic proportions provide an authoritative, literary feel reminiscent of high-end travel journals.
*   **Body & UI:** **Hanken Grotesk** is used for body copy and functional labels. Its contemporary, sharp grotesque style ensures maximum legibility in dense itineraries and collaborative sidebars.
*   **Hierarchy:** Use the display scale for immersive landing sections. Body text should maintain generous line heights (1.5+) to ensure a relaxed reading experience during planning.

## Layout & Spacing
The system utilizes a **Fixed Grid** for desktop and a **Fluid Grid** for mobile devices.

*   **Desktop:** A 12-column grid with a 1440px max-width. Gutters are fixed at 24px to maintain a rhythmic, organized structure even with dense data.
*   **Mobile:** A 4-column fluid grid with 20px side margins.
*   **Rhythm:** All spacing (padding, margins) follows a 4px base unit. Preference is given to larger spacing increments (24px, 32px, 48px) to reinforce the "Minimalist" brand pillar and prevent the UI from feeling cluttered.

## Elevation & Depth
Depth is communicated through **Glassmorphism** and **Ambient Shadows** rather than stark borders.

*   **Layers:** High-level containers (like planning modals or itinerary cards) use a backdrop filter (`blur(12px)`) with a white semi-transparent fill (`rgba(255, 255, 255, 0.7)`).
*   **Shadows:** Use extremely diffused, low-opacity shadows. A typical shadow for a floating card should have a 20px-30px blur with only 5-8% opacity, tinted slightly with the Deep Ocean Blue to maintain color harmony.
*   **Hierarchy:** Objects closer to the user (modals) have higher blur values and slightly more pronounced shadows, while background cards rely on subtle tonal shifts.

## Shapes
In line with the "Modern Nomad" aesthetic, shapes are friendly yet structured. 

*   **Base Radius:** Standard UI elements like buttons and input fields use a **12px (0.5rem)** radius.
*   **Container Radius:** Larger components like itinerary cards and image containers use a **16px (1rem)** or **24px (1.5rem)** radius to soften the visual impact of the grid.
*   **Pill Shapes:** Use fully rounded (pill) shapes exclusively for status indicators, tags, and "Add" buttons to make them instantly recognizable as interactive or metadata-rich elements.

## Components
Consistent component styling reinforces the organized yet adventurous personality.

*   **Buttons:** Primary buttons are Deep Ocean Blue with white text and 12px rounded corners. Secondary buttons use a Sunset Teal ghost style with a subtle 1px border.
*   **Cards:** Itinerary cards should feature immersive photography with a 16px radius. Use a glassmorphic overlay for the title and date at the bottom of the image to ensure legibility.
*   **Input Fields:** Minimalist design with a #F4F7FF background and a 12px radius. On focus, the border transitions to Deep Ocean Blue with a subtle outer glow.
*   **Chips/Tags:** Used for travel categories (e.g., "Adventure," "Relaxation"). Use Earth Sand for text on a very light grey background to keep them secondary to the main content.
*   **Collaborative Avatars:** Circular profile images with a 2px white border, often stacked in an overlap to show who is currently editing the trip.
*   **Timeline/Map Toggle:** A custom segmented control with a pill-shaped sliding active state in Deep Ocean Blue.