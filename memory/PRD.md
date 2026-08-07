# AlterX — PRD & Build Memory

## Original problem statement
Build the complete AlterX public website + a frontend-only "Try Alter Engine" product experience per the master prompt (AlterX_Emergent_Master_Prompt_v1.md). Reference recordings: Modal (hero/product panels), Jasper (mega menu), Ada (voice/industries), Reflect (security cipher), Film/Anomaly (text entrances), dope.security (cinematic progress), Linearity (gradients/orbit/footer). Brand: black / warm off-white / orange (#ff5a1f family), Hanken Grotesk + JetBrains Mono (+ Montserrat 900 for the wordmark only). Truthful content only — no fake metrics, customers, certifications, SDKs or prices.

## User choices (June 2026)
- Stack: React (CRA/CRACO) + react-router (Next.js not supported in env). Env vars are REACT_APP_*.
- Hero asset: user supplied `alterx_particle_logo.html` (authoritative) — particle X sampled from glyph, orange triangle top-left region, molecular bonds, pointer repulsion. Adapted into `lib/useParticleX.js`. No video/webm asset supplied.
- Build everything in first pass. Legal pages: user later supplied full legal drafts — implemented verbatim-ish in `content/legal.js` with DRAFT status labels.
- Env defaults: socials unset (icons hidden), REACT_APP_CONTACT_ENDPOINT unset (email-draft fallback to alterx@alterx.co.in with exact "Continue by email" copy), REACT_APP_VOICE_WORKFLOWS_ENABLED=false (CTA "Discuss a customer workflow").

## Architecture
- Frontend-only product. Backend template untouched (FastAPI hello world). No DB usage.
- Content layer: `src/content/` (navigation, home, pages, legal), `src/data/demoMissions.js` (4 deterministic scenarios: supplier-comparison, stagnant-inventory, customer-onboarding, weekly-report; keyword matcher).
- Store: `src/lib/store.js` — localStorage (ax_missions, ax_workflows, ax_mission_counter, ax_tour_done, ax_connections, ax_knowledge, ax_workspace_name). Evidence export = real JSON Blob download.
- Anim kit: `src/lib/anim.js` (EASE cubic-bezier(.25,1,.5,1), Reveal, MaskLines via useInView — NOTE: whileInView fails inside overflow-hidden masks, must observe container), Lenis smooth scroll (disabled on reduced motion).
- Canvas visuals: `lib/useParticleX.js` (hero X, DPR cap 1.5, IO + document.hidden pause, reduced-motion static), `components/home/CipherField.jsx` (security bands + scramble, same pauses).
- Header: fixed, dark over dark heroes (routes: /, /alter-engine, /platform, /security, /company, /pricing), crossfades to warm-white after 0.72×viewport scroll. Mega menu: 70ms intent open / 160ms leave, Escape/backdrop/scroll close, one dark backdrop.
- Homepage sections: HeroX → ProductPanels(01) → EngineStory(02, bounded native sticky 520vh, 62/38) → Runway(03) → Orbit(04) → VoiceDemo(05) → Security cipher(06) → Marquee → Work(07) → Resources(08) → Composer(09 → /try-alter-engine/new?objective=) → Footer (Montserrat 900 wordmark entrance + orange X sweep).
- Try Alter Engine: TryLayout (sidebar/topbar/inspector pattern), mission lifecycle clarify→plan→approval→run(→failure/recovery)→verify→complete/stopped; approval card (approve/edit/request context/decline), failure recovery (retry/alternate/clarify/stop), verify with weak-step send-back, save-as-workflow, evidence export; Approvals/Workflows(rename/duplicate/archive/run)/Connections(toggle)/Knowledge(add/remove)/Evidence(export)/Usage(stats)/Settings(reset). Tour (6 steps, spotlight, localStorage). Command bar (Ctrl/Cmd+K or /).
- Every simulated surface is labelled "Illustrative frontend demonstration".

## What's implemented (June 2026)
All 29 public routes + 11 try routes, sitemap.xml, robots.txt, per-page meta/canonical (usePageMeta). Verified via screenshots: hero, mega menu, panels hover, sticky story, runway, orbit, voice (play/approval/outcome), security mask, footer, contact validation + email fallback, legal, 404, full mission lifecycle, tour, command bar, inspector, workflows, mobile (390px, no overflow). `yarn build` passes.

## Bug fixes (June 2026)
- Header mega-menu centering: menu was opening shifted RIGHT because Tailwind `-translate-x-1/2` was overridden by Framer Motion's inline `transform: translateY(...)`. Fix (Header.jsx ~L168-210): single shared `motion.div` with `className="megaMenu hidden lg:block"`, `position:fixed; top:calc(var(--header-height)+10px); left:50%; right:auto; width:min(1500px, calc(100vw-48px)); maxHeight:calc(100svh - var(--header-height) - 30px)`, and Framer Motion `x:"-50%"` on initial/animate/exit so centering composes with the y slide instead of being clobbered. Verified by testing_agent (iteration_1.json): 0.00px diff to viewport center for all 6 nav items at 1440/1366/1280px; outer bounds fully stationary on item switch. NAV key for Alter Engine is `engine` (testid `nav-trigger-engine`).

## Remaining / backlog
- P1: Supply final hero video assets (webm/mp4/poster) if desired; social URL env vars; real contact endpoint; legal [TO CONFIRM] fields (registration no., grievance officer) are release blockers per drafts.
- P1: Playwright test suite + axe pass (manual keyboard/reduced-motion honored in code; not CI-automated).
- P2: OG images, structured data (Organization schema pending social/entity confirmation), cookie consent banner when analytics are introduced, work-detail approved imagery (currently editorial typographic treatment).
- P2: /try-alter-engine mobile inspector overlay refinement; more demo scenarios.
