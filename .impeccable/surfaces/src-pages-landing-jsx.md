---
version: 1
slug: "src-pages-landing-jsx"
primary_target: "src/pages/Landing.jsx"
related_targets: []
---

# Landing page (`/`)

Scope: the KidCheck landing route. Mode: Persuade. Inherits the established teal/slate app world (no DESIGN.md exists yet; the world lives in the code).

Audience: hackathon judges first (understand the problem, the mechanism and the safety stance in one screen), then a CHW who wants to start a case immediately. Action: start a case from the page. Proof: the real mechanism (AI fills fields, CHW confirms, WHO rules decide with a cited page) shown with a synthetic example, labelled synthetic. No statistics, testimonials or partners.

## Direction contract

THESIS: The page is half pitch, half working tool. It refuses the centred hero with a lone button: a judge reads why it matters on the left while the right column already accepts a real description and starts a real case.

OWN-WORLD: The app's own world. Slate-50 ground, white panels with slate-200 hairlines, teal-700 as the only action colour, amber for the disclaimer, red only for the referral outcome, violet only for the AI badge. System sans, bold slate-900 headings.

STORY: A sick child's first contact is a CHW with a paper chart; danger signs get missed. KidCheck: plain words in, AI fills the checklist, the CHW confirms, WHO rules decide and show the sign and page. It never doses, never treats "not asked" as "no", and works without AI.

FIRST VIEWPORT: Desktop 7/5 split. Left: tagline as H1, a 2-sentence problem, the three-step mechanism. Right: white "Start a case" panel with textarea, three synthetic demo chips, "Fill checklist with AI" (teal) and "Fill checklist myself". Mobile: H1 and one line, then the panel, then the rest.

FORM: Split pitch-and-start, position 4 of 7 on my ordered list. seed:94a75575ca2546c5

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
