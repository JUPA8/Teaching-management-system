# Teacher Page - Image Guidelines

## Overview
This guide explains what images to add to complete the redesigned teacher page while maintaining Islamic values and avoiding mixed-gender imagery.

## Required Images

### 1. Hero Background Image (Optional but Recommended)
**Location:** Can be added to the hero section background
**Description:** Islamic educational scene
**Specifications:**
- Size: 1920x1080px or higher
- Format: PNG, JPG, WebP
- Content Suggestions:
  - Open Quran on wooden stand (rehal)
  - Islamic library with Arabic books
  - Islamic geometric patterns and calligraphy
  - Prayer beads (tasbih) and scholarly materials
  - **NO people visible** - focus on educational tools and environment

**Filename suggestion:** `teacher-hero-background.png`
**Place in:** `/public/`

---

### 2. Individual Teacher Images
Each teacher card currently shows a decorative icon placeholder. You can replace these with appropriate images:

#### For Male Teachers (Ahmad, Omar, Ibrahim):
**Specifications:**
- Size: 400x400px (square)
- Format: PNG, JPG, WebP
- Content Options:
  - Photo from behind/side (not showing face directly)
  - Silhouette of male teacher in traditional Islamic clothing
  - Icon-based representation with Islamic patterns
  - Man studying/teaching in Islamic educational setting (viewed from behind)
  - **Keep men-only** - no women in these photos

**Suggested filenames:**
- `teacher-ahmad.png`
- `teacher-omar.png`
- `teacher-ibrahim.png`

**Place in:** `/public/teachers/`

#### For Female Teachers (Fatima, Mariam):
**Specifications:**
- Size: 400x400px (square)
- Format: PNG, JPG, WebP
- Content Options:
  - Hijabi woman teacher viewed from behind/side
  - Woman in Islamic attire teaching/studying (face not visible)
  - Silhouette of female teacher with hijab
  - Islamic educational setting for women
  - **Keep women-only** - no men in these photos

**Suggested filenames:**
- `teacher-fatima.png`
- `teacher-mariam.png`

**Place in:** `/public/teachers/`

---

### 3. Islamic Pattern Backgrounds (Optional Enhancement)
**Description:** Decorative Islamic geometric patterns for card backgrounds
**Specifications:**
- Size: 800x800px
- Format: PNG with transparency or SVG
- Style: Subtle, elegant Islamic geometric patterns
- Colors: Should complement brand colors (teal #2B7A78 and gold #D9B574)

**Suggested filenames:**
- `pattern-geometric-1.png`
- `pattern-geometric-2.png`
- `pattern-islamic-arch.png`

**Place in:** `/public/patterns/`

---

## How to Add Images to the Code

### Option 1: Add Hero Background
In `/src/app/[locale]/teachers/page.tsx`, find the hero section and add:

```tsx
{/* Add this after the gradient background div */}
<div className="absolute inset-0 opacity-20">
  <Image
    src="/teacher-hero-background.png"
    alt="Islamic Education"
    fill
    className="object-cover"
    priority
  />
</div>
```

### Option 2: Replace Teacher Card Placeholders
In the teacher card section, replace the decorative icon div with:

```tsx
{/* Replace the placeholder div with: */}
<div className="absolute inset-0">
  <Image
    src={`/teachers/teacher-${key}.png`}
    alt={`${name}`}
    fill
    className="object-cover"
    quality={90}
  />
</div>
```

---

## Important Islamic Guidelines

### ✅ DO:
- Use images of people from behind or side angles
- Keep men and women in **separate images**
- Use silhouettes and artistic representations
- Focus on educational settings and Islamic symbols
- Show Islamic educational tools (Quran, books, prayer beads)
- Use Islamic geometric patterns and calligraphy
- Ensure modest clothing in any person imagery

### ❌ DON'T:
- Mix men and women in the same photo
- Show faces directly (especially for women)
- Use images that contradict Islamic values
- Show inappropriate or immodest clothing
- Use Western-style educational imagery

---

## Where to Get Appropriate Images

### Stock Photo Sites with Islamic Content:
1. **Unsplash** - Search: "islamic education", "quran study", "islamic patterns"
2. **Pexels** - Search: "muslim learning", "islamic art"
3. **Shutterstock** (Paid) - More professional Islamic educational imagery
4. **Islamic Vector Graphics** - For patterns and decorative elements

### AI Image Generation (Recommended):
Use tools like:
- DALL-E 3
- Midjourney
- Stable Diffusion

**Example prompts:**
- "Islamic education scene with open Quran and Arabic books, no people, warm lighting"
- "Male teacher in traditional Islamic clothing viewed from behind, teaching setting"
- "Hijabi woman teacher at desk with Islamic educational materials, viewed from side, face not visible"
- "Islamic geometric patterns in teal and gold colors"

---

## Current Design Implementation

The teacher page redesign includes:
- ✅ Enhanced hero section with Islamic patterns
- ✅ Improved teacher cards with better layout
- ✅ Gender-appropriate placeholders
- ✅ Islamic color scheme (teal and gold)
- ✅ Animated decorative elements
- ✅ Responsive design for all devices
- ⏳ **Waiting for actual photos** (currently using placeholders)

---

## Quick Start

1. Create the `/public/teachers/` folder if it doesn't exist
2. Add 5 teacher images (named as specified above)
3. Optionally add a hero background image
4. Update the code as shown in "How to Add Images" section
5. Test on different screen sizes

---

## Questions?

If you need help with:
- Finding appropriate images
- Generating AI images with correct prompts
- Implementing the images in code
- Adjusting the design

Feel free to ask for assistance!
