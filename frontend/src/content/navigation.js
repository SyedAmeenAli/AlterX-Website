// Hierarchy: AlterX (company) > Alter Engine (flagship product) >
// AlterX Platform (the workspace for operating the Engine, not a second
// product) > Solutions (ways the Engine is applied: Cognitive AI, Voice
// workflows, AI websites, Custom workflows) > Build with AlterX (developer
// integration route). "Products" is intentionally not a top-level item —
// it competed with Alter Engine for the same mental slot.
export const NAV = [
  {
    label: "Alter Engine",
    key: "engine",
    featured: {
      title: "Start with the outcome.\nKeep the work visible.",
      body: "Alter Engine turns an objective into planned work, returns important decisions to people and checks what comes back.",
      to: "/alter-engine",
      visual: "engine",
    },
    links: [
      { label: "Alter Engine overview", to: "/alter-engine", desc: "The flagship execution product", visualKey: "overview" },
      { label: "How it works", to: "/alter-engine#lifecycle", desc: "Understand · Plan · Approve · Act · Check", visualKey: "lifecycle" },
      { label: "AlterX Platform", to: "/platform", desc: "The workspace for supervising Engine work", visualKey: "platform" },
      { label: "Human approvals", to: "/alter-engine#authority", desc: "Decisions return to people", visualKey: "authority" },
      { label: "Checking & recovery", to: "/alter-engine#recovery", desc: "Weak steps go back for revision", visualKey: "recovery" },
      { label: "Try Alter Engine", to: "/try-alter-engine", desc: "Interactive frontend demonstration", visualKey: "try", accent: true },
    ],
  },
  {
    label: "Solutions",
    key: "solutions",
    featured: {
      title: "Different contexts.\nThe same need for visible work.",
      body: "Apply AlterX to inventory operations, conversations, digital experiences or workflows shaped around the way your organisation already works.",
      to: "/solutions",
      visual: "solutions",
    },
    links: [
      { label: "Cognitive AI", to: "/cognitive-ai", desc: "Inventory operations, powered by Alter Engine", visualKey: "cognitive" },
      { label: "Voice workflows", to: "/solutions/voice-workflows", desc: "Conversations that become structured, approved work", visualKey: "voice" },
      { label: "AI websites", to: "/solutions/ai-websites", desc: "Digital experiences that understand intent", visualKey: "websites" },
      { label: "Custom workflows", to: "/solutions/custom-workflows", desc: "Built around your systems and approval points", visualKey: "workflows" },
      { label: "Discuss a workflow", to: "/contact", desc: "Bring us the outcome", accent: true },
    ],
  },
  {
    label: "Developers",
    key: "developers",
    featured: {
      title: "Build with AlterX",
      body: "Bring Alter Engine workflows into your product or internal system.",
      to: "/developers",
      visual: "build",
    },
    links: [
      { label: "Developer overview", to: "/developers", desc: "Approval-aware execution in your product", visualKey: "overview" },
      { label: "Mission lifecycle", to: "/developers#mission-model", desc: "Objective, plan, states, evidence", visualKey: "states" },
      { label: "Execution states", to: "/developers#states", desc: "Observe work as it moves", visualKey: "states" },
      { label: "Approval events", to: "/developers#approvals", desc: "Human decision points as events", visualKey: "approvals" },
      { label: "Architecture", to: "/developers#architecture", desc: "How the pieces fit", visualKey: "architecture" },
      { label: "Request developer access", to: "/contact", desc: "API access is managed", accent: true, visualKey: "access" },
    ],
  },
  {
    label: "Security",
    key: "security",
    featured: {
      title: "Control is built into the work.",
      body: "Permissions, approvals, visible execution and reviewable outcomes are part of the operating model.",
      to: "/security",
      visual: "security",
    },
    links: [
      { label: "Security overview", to: "/security", desc: "Control is not an add-on" },
      { label: "Identity & access", to: "/security#identity-and-access", desc: "Roles define who can do what" },
      { label: "Workspace separation", to: "/security#workspace-separation", desc: "Structural, not cosmetic" },
      { label: "Human approvals", to: "/security#human-approval-boundaries", desc: "Sensitive actions pause for authority" },
      { label: "Activity & evidence", to: "/security#audit-and-evidence", desc: "Decisions keep their trail" },
      { label: "Security enquiries", to: "/security#vulnerability-reporting", desc: "Report a concern today", accent: true },
    ],
  },
  {
    label: "Resources",
    key: "resources",
    featured: {
      title: "The system behind visible work.",
      body: "Guides and insights on human checkpoints, evidence and governed execution.",
      to: "/resources",
      visual: "resources",
    },
    links: [
      { label: "Guides", to: "/resources?type=guide", desc: "Practical system design", visualKey: "guides" },
      { label: "Insights", to: "/resources?type=insight", desc: "Thinking behind the product", visualKey: "insights" },
      { label: "Product tours", to: "/try-alter-engine", desc: "See the lifecycle interactively", visualKey: "featured" },
      { label: "All resources", to: "/resources", desc: "Every published guide and insight", accent: true, visualKey: "matrix" },
    ],
  },
  {
    label: "Company",
    key: "company",
    featured: {
      title: "Make complex work easier to carry out\nwithout making it harder to understand or control.",
      body: "AlterX builds AI systems that turn business goals into planned, visible and reviewable work.",
      to: "/company",
      visual: "company",
    },
    links: [
      { label: "About AlterX", to: "/company", desc: "Why AlterX exists" },
      { label: "Principles", to: "/company#principles", desc: "How we decide what to build" },
      { label: "Careers", to: "/careers", desc: "Build systems that move real work" },
      { label: "Contact", to: "/contact", desc: "Bring us the outcome", accent: true },
    ],
  },
];

export const FOOTER_COLS = [
  {
    title: "Product",
    links: [
      { label: "Alter Engine", to: "/alter-engine" },
      { label: "AlterX Platform", to: "/platform" },
      { label: "Try Alter Engine", to: "/try-alter-engine" },
      { label: "FAQ", to: "/alter-engine#faq" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Cognitive AI", to: "/cognitive-ai" },
      { label: "Voice workflows", to: "/solutions/voice-workflows" },
      { label: "AI websites", to: "/solutions/ai-websites" },
      { label: "Custom workflows", to: "/solutions/custom-workflows" },
    ],
  },
  {
    title: "Build",
    links: [
      { label: "Developers", to: "/developers" },
      { label: "Request developer access", to: "/contact" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Security", to: "/security" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Cookie Policy", to: "/cookie-policy" },
      { label: "Acceptable Use", to: "/acceptable-use" },
      { label: "Data Processing Addendum", to: "/dpa" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/company" },
      { label: "Work", to: "/work" },
      { label: "Resources", to: "/resources" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
    ],
  },
];

// Canonical short public company description — use exactly, verbatim,
// anywhere the code is specifically presenting "what AlterX is" as a
// standalone sentence (not a contextual teaser or SEO snippet with its
// own length/purpose constraints).
export const COMPANY_DESCRIPTION = "AlterX builds AI systems that turn business goals into planned, visible and reviewable work.";

export const BUSINESS = {
  name: "AlterX",
  address: "8-1-346/10/A/1, Sabza Colony, Brindavan Colony, Toli Chowki, Hyderabad, Telangana 500008, India",
  email: "alterx@alterx.co.in",
  phone1: "+91 93905 85526",
  phone2: "+91 77025 03684",
  site: "https://alterx.co.in",
  appDomain: "https://alterxengine.co.in",
};

// Instagram is a verified AlterX destination and is hardcoded; other
// networks only render if a real URL is supplied via env — no placeholder
// social links.
export const SOCIALS = [
  { key: "Instagram", url: process.env.REACT_APP_INSTAGRAM_URL || "https://www.instagram.com/alterx.co.in/?hl=en" },
  { key: "LinkedIn", url: process.env.REACT_APP_LINKEDIN_URL },
  { key: "X", url: process.env.REACT_APP_X_URL },
  { key: "YouTube", url: process.env.REACT_APP_YOUTUBE_URL },
].filter((s) => s.url && /^https?:\/\//.test(s.url));
