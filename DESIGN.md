---
name: KidCheck
description: Plain words in, WHO-backed decisions out. A calm teal-and-slate checklist tool for community health workers.
colors:
  action-teal: "oklch(51.1% 0.096 186.391)"
  action-teal-deep: "oklch(43.7% 0.078 188.216)"
  teal-ink: "oklch(38.6% 0.063 188.416)"
  teal-wash: "oklch(98.4% 0.014 180.72)"
  teal-mist: "oklch(95.3% 0.051 180.801)"
  ground-slate: "oklch(98.4% 0.003 247.858)"
  panel-white: "#ffffff"
  hover-slate: "oklch(96.8% 0.007 247.896)"
  hairline-slate: "oklch(92.9% 0.013 255.508)"
  control-slate: "oklch(86.9% 0.022 252.894)"
  quiet-slate: "oklch(55.4% 0.046 257.417)"
  secondary-slate: "oklch(44.6% 0.043 257.281)"
  lead-slate: "oklch(37.2% 0.044 257.287)"
  ink-slate: "oklch(20.8% 0.042 265.755)"
  caution-amber-wash: "oklch(98.7% 0.022 95.277)"
  disclaimer-amber: "oklch(96.2% 0.059 95.617)"
  caution-amber-edge: "oklch(87.9% 0.169 91.605)"
  caution-amber-text: "oklch(47.3% 0.137 46.201)"
  caution-amber-ink: "oklch(41.4% 0.112 45.904)"
  refer-red-wash: "oklch(97.1% 0.013 17.38)"
  refer-red-tint: "oklch(93.6% 0.032 17.717)"
  refer-red-edge: "oklch(80.8% 0.114 19.571)"
  error-red-stroke: "oklch(57.7% 0.245 27.325)"
  refer-red: "oklch(50.5% 0.213 27.518)"
  refer-red-deep: "oklch(44.4% 0.177 26.899)"
  refer-red-ink: "oklch(39.6% 0.141 25.723)"
  ai-violet-wash: "oklch(96.9% 0.016 293.756)"
  ai-violet-tint: "oklch(94.3% 0.029 294.588)"
  ai-violet-edge: "oklch(81.1% 0.111 293.571)"
  ai-violet-text: "oklch(43.2% 0.232 292.759)"
  ai-violet-ink: "oklch(38% 0.189 293.745)"
  info-sky-wash: "oklch(97.7% 0.013 236.62)"
  info-sky-tint: "oklch(95.1% 0.026 236.824)"
  info-sky-edge: "oklch(82.8% 0.111 230.318)"
  info-sky-ink: "oklch(39.1% 0.09 240.876)"
  clear-emerald-wash: "oklch(97.9% 0.021 166.113)"
  clear-emerald-tint: "oklch(95% 0.052 163.051)"
  clear-emerald-edge: "oklch(84.5% 0.143 164.978)"
  clear-emerald-text: "oklch(43.2% 0.095 166.913)"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  alarm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.111
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.333
  title-lg:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.5
  body-lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.556
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.429
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.429
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.333
rounded:
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  3xl: "48px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.action-teal}"
    textColor: "{colors.panel-white}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.action-teal-deep}"
  button-primary-compact:
    backgroundColor: "{colors.action-teal}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.hover-slate}"
  button-refer:
    backgroundColor: "{colors.refer-red}"
    textColor: "{colors.panel-white}"
    rounded: "{rounded.lg}"
    padding: "10px 20px"
  button-refer-hover:
    backgroundColor: "{colors.refer-red-deep}"
  button-destructive-text:
    textColor: "{colors.refer-red}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  button-destructive-text-hover:
    backgroundColor: "{colors.refer-red-wash}"
  nav-link:
    textColor: "{colors.lead-slate}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  nav-link-active:
    backgroundColor: "{colors.action-teal}"
    textColor: "{colors.panel-white}"
  choice-pill:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink-slate}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  choice-pill-selected:
    backgroundColor: "{colors.action-teal}"
    textColor: "{colors.panel-white}"
  choice-pill-not-asked-selected:
    backgroundColor: "{colors.hairline-slate}"
    textColor: "{colors.ink-slate}"
  filter-chip:
    backgroundColor: "{colors.panel-white}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  filter-chip-selected:
    backgroundColor: "{colors.action-teal}"
    textColor: "{colors.panel-white}"
  ai-badge:
    backgroundColor: "{colors.ai-violet-tint}"
    textColor: "{colors.ai-violet-text}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  outcome-badge-refer:
    backgroundColor: "{colors.refer-red-tint}"
    textColor: "{colors.refer-red-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  outcome-badge-treat:
    backgroundColor: "{colors.disclaimer-amber}"
    textColor: "{colors.caution-amber-ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  outcome-badge-home:
    backgroundColor: "{colors.clear-emerald-tint}"
    textColor: "{colors.clear-emerald-text}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  outcome-badge-incomplete:
    backgroundColor: "{colors.info-sky-tint}"
    textColor: "{colors.info-sky-ink}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  input:
    backgroundColor: "{colors.panel-white}"
    textColor: "{colors.ink-slate}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  textarea:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.md}"
    padding: "12px"
  panel:
    backgroundColor: "{colors.panel-white}"
    rounded: "{rounded.lg}"
    padding: "16px"
  notice:
    rounded: "{rounded.md}"
    typography: "{typography.body-sm}"
    padding: "12px"
  disclaimer-bar:
    backgroundColor: "{colors.disclaimer-amber}"
    textColor: "{colors.caution-amber-ink}"
    typography: "{typography.caption}"
    padding: "8px 16px"
  urgent-alert:
    backgroundColor: "{colors.refer-red}"
    textColor: "{colors.panel-white}"
    typography: "{typography.alarm}"
    padding: "24px"
---

# Design System: KidCheck

## Overview

**Creative North Star: "The Clinic Chart"**

KidCheck looks like a well-kept paper chart moved onto a screen: a pale slate ground, white panels with hairline borders, plain bold headings, and one teal colour that means "do this next". Everything is flat and quiet so that the few loud things (the amber disclaimer, a red referral, a violet AI mark) carry their meaning instantly. The density is a form's density: stacked fields, short lines, generous tap targets, a single centred column of at most 672px on working pages.

Colour is semantic before it is decorative. Each hue owns one job across the whole app: teal acts, amber cautions, red refers or reports an error, violet marks what the AI filled, sky informs, emerald clears. Slate carries everything else. The landing page uses the same materials at a larger scale (a 12-column split and a 48px headline) rather than a separate marketing look.

The system is built entirely from Tailwind CSS v4's default palette, radius and type scale, with no custom theme. Global CSS adds only teal text selection, a teal caret, and a 2px teal focus outline on every focusable element.

**Key Characteristics:**
- Slate-50 ground, white panels, slate-200 hairlines; flat, no shadows in the app.
- One action colour (teal-700) for primary buttons, selected choices, the active nav item and focus.
- Hue is role: amber, red, violet, sky and emerald each mean one thing.
- One sans family for everything; weight (bold, semibold, medium) does the hierarchy work.
- 8px-radius buttons and panels, 6px-radius controls and notices, full pills only for filters and outcome badges.
- No motion: hover states change colour instantly.
- Mark: a white check on a teal-700 (`#0f766e`) square with 7/32 rounded corners (`public/favicon.svg`).

## Colors

A cool slate neutral field with one deep teal for action and five strictly assigned signal hues, all from Tailwind v4's OKLCH palette.

### Primary
- **Deep Clinic Teal** (`action-teal`, teal-700): the only colour for primary buttons, the active nav link, selected Yes/No pills, selected filter chips, the numbered step discs on the landing page, the wordmark, inline links, the text caret and the focus outline.
- **Pressed Teal** (`action-teal-deep`, teal-800): hover fill for every teal button; also the landing page's inline link colour.
- **Teal Ink** (`teal-ink`, teal-900): text on the active step marker in the New case stepper; landing link hover.
- **Teal Wash** (`teal-wash`, teal-50): background of the active step marker.
- **Teal Mist** (`teal-mist`, teal-100): text selection background.

### Secondary (signal hues; each owns one meaning)
- **Disclaimer Amber** (`disclaimer-amber` on `caution-amber-ink`): the full-width "Educational prototype" bar above every page, and the "Treat at home" outcome badge.
- **Caution Amber** (`caution-amber-wash` panel, `caution-amber-edge` border, `caution-amber-ink` text; `caution-amber-text` for inline field warnings): the AI-unavailable fallback notice, scope notes, the "Treat at home and advise" outcome panel.
- **Referral Red** (`refer-red`): the full-screen urgent alert, the Print referral note button, destructive text buttons (Delete case, Delete all cases), inline error text and the required-field asterisk. `refer-red-wash` / `refer-red-edge` / `refer-red-deep` form error notices and the "Refer urgently" outcome panel; `refer-red-tint` with `refer-red-ink` forms the storage-blocked banner; `error-red-stroke` is the border of an invalid input.
- **AI Violet** (`ai-violet-tint` on `ai-violet-text`): the small "AI" badge beside any answer the model filled. `ai-violet-wash` / `ai-violet-edge` / `ai-violet-ink` form the one notice that says how many answers the AI filled.
- **Information Sky** (`info-sky-wash` / `info-sky-edge` / `info-sky-ink`): the privacy notice ("Do not type the child's name...") and the "Needs more answers" outcome (`info-sky-tint` badge).
- **All-Clear Emerald** (`clear-emerald-wash` / `clear-emerald-edge` panel, `clear-emerald-tint` badge, `clear-emerald-text`): the "No illness sign found" outcome and the "Every question has an answer" status line.

### Neutral
- **Ground Slate** (`ground-slate`, slate-50): the page background behind everything.
- **Panel White** (`panel-white`): panels, cards, inputs, secondary buttons, the header bar.
- **Hover Slate** (`hover-slate`, slate-100): hover fill for secondary buttons, pills and chips; row dividers inside panels.
- **Hairline Slate** (`hairline-slate`, slate-200): panel borders, header rule, list dividers; the fill of a selected "Not asked" pill and of neutral outcome badges.
- **Control Slate** (`control-slate`, slate-300): the 1px border of every input, pill, chip, secondary button and dashed empty state.
- **Quiet Slate** (`quiet-slate`, slate-500): footer text, character counter, chart-page citations, inactive steps, placeholders.
- **Secondary Slate** (`secondary-slate`, slate-600): helper text, field units, definition-list labels, supporting paragraphs.
- **Lead Slate** (`lead-slate`, slate-700): landing lead paragraphs and inactive nav links.
- **Ink Slate** (`ink-slate`, slate-900): all body text and headings.

### Named Rules
**The One Action Colour Rule.** Teal is the only colour that invites a tap. A primary button, a selected choice and the active nav item are teal; nothing else is. The single exception is the referral context, where the print button and the alert are red because the decision itself is red.

**The Hue Is Role Rule.** Each signal hue keeps its one meaning on every screen: amber cautions, red refers or reports an error, violet marks AI-filled content, sky informs, emerald clears. Never borrow a signal hue for decoration or emphasis.

**The Tint-Edge-Ink Rule.** Every coloured notice and outcome panel is built the same way: the hue's 50 wash as fill, its 300 as the border, its 800 or 900 as text.

## Typography

**Display Font:** the platform sans stack (-apple-system, Segoe UI, Roboto, Helvetica Neue, Noto Sans, Arial, sans-serif)
**Body Font:** the same stack
**Label/Mono Font:** none distinct; numbers use tabular figures where they line up.

**Character:** A single plain sans that renders as the phone's own interface face, used today for every role including the display headline. Hierarchy comes from weight and size.

### Hierarchy
- **Display** (700, 2.25rem rising to 3rem at 640px+, line-height 1, -0.025em, balanced wrap): the landing headline only.
- **Alarm** (700, 1.875rem rising to 2.25rem): the headline of the full-screen urgent referral alert only.
- **Headline** (700, 1.5rem): page titles (New case, Case log, Case 123), the outcome label in the result panel, landing section headings.
- **Title Large** (700, 1.25rem): standalone panel headings (Start a case, the crash panel).
- **Title** (600, 1rem; 1.125rem for landing sub-sections): section headings inside panels (checklist sections, How it works, The problem).
- **Body Lead** (400, 1.125rem): the landing's opening paragraph.
- **Body** (400, 1rem, line-height 1.5): running text, capped at 60ch on the landing page.
- **Body Small** (400, 0.875rem): the working size of the app: notices, helper text, pill labels, list metadata, inline errors.
- **Label** (500, 0.875rem or 1rem): field labels, legends, button text, nav links, outcome badges.
- **Caption** (400, 0.75rem): the disclaimer bar on phones, the footer, chart-page citations, the character counter.

### Named Rules
**The Weight Steps Rule.** Within the UI, hierarchy steps by weight (700 headings, 600 titles, 500 labels, 400 text), not by colour: headings stay ink slate, never teal or a signal hue.

## Layout

A single centred column inside a 1024px shell (`max-w-5xl`) with 16px side padding and 32px vertical padding. Working pages (New case, Case result) narrow further to 672px (`max-w-2xl`) and stack their blocks with a 24px gap. The case log uses the full shell width.

The landing page is the one multi-column surface: a 12-column grid at 1024px+ with the text in columns 1-7 and the Start a case panel in 8-12, a 48px column gap, and 80px (96px at 640px+) between major sections. Below 1024px it collapses to one column in reading order (headline, panel, problem, steps). The worked example becomes a five-track row at 1024px+ with arrow icons between steps; on phones the arrows rotate to point down.

Spacing follows Tailwind's 4px step: 4 and 8px inside controls, 12px inside notices, 16px inside panels and between list rows, 24px between page blocks, 32px for panel interiors on the landing CTA band and empty states, 48px above the landing limits section. Buttons wrap in rows with 12px gaps; pills and chips with 8px gaps.

Print is a distinct layout: the header, footer, storage banner and screen result are hidden, and only the black-on-white referral note prints.

## Elevation & Depth

The app is flat. Depth comes from tonal layering only: a slate-50 ground, white panels on top, and a 1px slate-200 hairline around each panel. Outcome panels step up to a 2px tinted border to stand out without lifting. The full-screen urgent alert sits at the top of the stack as a solid red layer, not a shadowed dialog.

### Shadow Vocabulary
- **Landing panel lift** (`box-shadow: 0 8px 24px -12px rgb(15 23 42 / 0.18)`): used once, on the landing page's Start a case panel so the working tool reads as the object to touch. No app page uses a shadow.

### Named Rules
**The Hairline Not Shadow Rule.** Inside the app, a panel is separated from the ground by a slate-200 hairline, never by a shadow.

## Shapes

Gently rounded rectangles throughout. Buttons and panels use an 8px radius (`lg`); inputs, choice pills, demo chips, notices and the step markers use 6px (`md`); the AI badge uses 4px (`sm`). Fully rounded pills appear only on case-log filter chips and outcome badges, and full circles only on the landing's numbered step discs. The landing page's start panel and closing CTA band use 12px (`xl`).

Borders are 1px everywhere except outcome panels (2px). Empty states use a dashed slate-300 border. There is no clipping, angled geometry or decorative shape.

## Components

### Buttons
Solid, plain and large enough to hit under pressure.
- **Shape:** gently rounded (8px).
- **Primary:** teal-700 fill, white 500-weight text, 12px by 24px padding on form pages; 10px by 20px in compact spots (case log header, in-panel actions).
- **Hover / Focus:** fill darkens to teal-800 instantly; focus shows the global 2px teal outline offset by 2px. Disabled buttons drop to 70% opacity (and show a wait cursor while the AI is reading).
- **Secondary:** white fill, 1px slate-300 border, slate-900 text, slate-100 on hover. Always sits beside a primary, never alone as the main action.
- **Referral:** red-700 fill with white text, red-800 hover; only "Print referral note" inside the Refer urgently panel.
- **Destructive text:** red-700 text with no fill, red-50 hover fill or underline; for Delete case and Delete all cases.

### Chips
- **Choice pills (Yes / No / Not asked):** each answer is a 6px-radius bordered label wrapping a visually hidden radio. Unselected: white with slate-300 border, slate-100 on hover. Selected answer: teal-700 fill and border, white text. Selected "Not asked": slate-200 fill with a slate-500 border, so an unanswered question never looks like an answer. "Not asked" is always the last option.
- **Demo case chips:** same shape and resting style as an unselected choice pill; they fill the description box.
- **Filter chips (case log):** fully rounded, 4px by 12px, with a count in brackets; selected is teal-filled, `aria-pressed`.
- **Outcome badges:** fully rounded, 500 weight, the outcome hue's 100 tint with its 800/900 text; neutral slate for out-of-range and unclassified cases.
- **AI badge:** a 4px-radius violet-100 tag reading "AI" in 600-weight caption text, sitting beside a field label, with a screen-reader suffix telling the CHW to check it.

### Cards / Containers
- **Corner Style:** 8px; 12px on the landing's two hero-scale containers.
- **Background:** white on the slate-50 ground; treat-outcome findings sit on white at 70% inside the amber panel.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** 1px slate-200; lists and definition lists inside use slate-100 dividers.
- **Internal Padding:** 16px; checklist sections use 16px sides and 8px top and bottom so rows carry their own 12px rhythm.

### Inputs / Fields
- **Style:** white, 1px slate-300 border, 6px radius; number boxes are 112px wide with the unit beside them; textareas are full width, 5 rows, 12px padding, slate-500 placeholder.
- **Focus:** the global 2px teal-700 outline at 2px offset and a teal caret.
- **Error:** border turns red-600, a red-700 Body Small message sits directly under the field, and the field is `aria-invalid`. A non-blocking warning uses amber-800 text in the same position.

### Notices
Full-width 6px-radius boxes, 12px padding, Body Small text, built by the Tint-Edge-Ink Rule: sky for privacy, violet for the AI-filled count, amber for AI fallback and scope notes, red for save and validation errors, plain white with a slate border for neutral status.

### Navigation
A white header bar with a slate-200 bottom rule. The KidCheck wordmark sits left in 1.125rem bold teal-700. Two links sit right as 6px-radius 8px-by-12px targets in Label type: slate-700 at rest, slate-100 on hover, teal-700 fill with white text when active. The same layout holds on phones. Above it, the amber disclaimer bar spans the full width on every page (caption size on phones, Body Small from 640px). The footer is a centred caption line in slate-500.

### Outcome Panel (signature)
The result of every case is one panel with a 2px border in the outcome hue (red, amber, emerald, sky or slate) over that hue's 50 wash. It holds the outcome as a Headline, then the triggering sign or the findings, each followed by its chart page as a slate caption "(chart p. N)", then the actions list. Every outcome badge in the case log uses the same hue mapping.

### Urgent Alert (signature)
When a saved case is "Refer urgently", a full-screen red-700 layer covers the page: white Alarm headline, the triggering signs in 1.125rem text, and one white button with red-800 text and a 4px white focus outline. Focus moves to the button on open. It never prints.

## Do's and Don'ts

### Do:
- **Do** use teal-700 (hover teal-800) for the one primary action in any group, and pair it with a white bordered secondary when there is a second choice.
- **Do** keep the amber disclaimer bar at the top of every page, full width, above the header.
- **Do** build every coloured notice and outcome panel as wash fill, 300 border, 800/900 text in its role hue.
- **Do** put the "AI" violet badge beside any value the model filled, and remove it as soon as the CHW changes that value.
- **Do** show "Not asked" as its own option, last in the row, with its own slate selected state.
- **Do** follow every rule-based result with its chart page in a slate caption.
- **Do** keep working pages to a single 672px column with 24px between blocks.

### Don't:
- **Don't** use teal for anything that is not an action, a selection, a link or focus.
- **Don't** use violet for anything except AI-filled content.
- **Don't** use red outside errors, destructive actions and the referral outcome.
- **Don't** add shadows to app panels; separate them from the ground with the slate-200 hairline.
- **Don't** let a selected "Not asked" look like a teal answer.
- **Don't** introduce colours outside Tailwind's default palette or new hues beyond the roles above.
