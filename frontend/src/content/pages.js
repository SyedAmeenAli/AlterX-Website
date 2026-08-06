export const SOLUTIONS = [
  {
    slug: "ai-websites",
    title: "AI-enabled websites",
    lead: "Digital experiences that understand the visitor and complete real actions — not brochures with a chat bubble.",
    condition: "Visitors arrive with intent, but the website only presents pages. Understanding, routing and action live with a human team that responds later.",
    outcome: "A visitor states what they need, the experience understands it, guides the right action and hands off to the right team with full context.",
    path: ["Understand the visitor's intent", "Map it to services and actions", "Guide completion of the key action", "Hand off with context and evidence"],
    systems: ["Website experience", "Service catalogue", "Team handoff", "Analytics"],
    decision: "Routing rules, escalation boundaries and tone are defined with your team and remain under your control.",
    interaction: "intent",
  },
  {
    slug: "business-automation",
    title: "Business automation",
    lead: "Multi-step work that pauses for judgment — automation that knows what it is not allowed to decide.",
    condition: "Repetitive multi-step work eats the week, but full automation is unsafe because some steps genuinely need a person.",
    outcome: "The repeatable steps run. The judgment steps pause. Progress and evidence stay visible throughout.",
    path: ["Map the work and its decision points", "Plan the mission with approval gates", "Run approved steps", "Check results and preserve the trail"],
    systems: ["Communication", "Documents", "Data", "Internal systems"],
    decision: "Approval points are placed exactly where authority matters — spend, external commitments, sensitive data.",
    interaction: "gates",
  },
  {
    slug: "operations",
    title: "Operations",
    lead: "Operational execution you can watch — running, waiting, blocked and done, all in one view.",
    condition: "Operations run across systems and people. Status lives in heads, chats and stale spreadsheets.",
    outcome: "One view of what is moving, what is waiting on whom, and what the evidence says happened.",
    path: ["Define the operating outcomes", "Connect the involved systems", "Run missions with visible states", "Review results and recurring exceptions"],
    systems: ["Inventory record", "Internal systems", "Communication", "Documents"],
    decision: "Exception handling returns to named owners — the system routes, people decide.",
    interaction: "states",
  },
  {
    slug: "customer-experience",
    title: "Customer experience",
    lead: "Conversations that carry real work — identity, policy, systems, approvals and follow-through connected.",
    condition: "A customer speaks in one channel, but the answer depends on identity, policy, systems and approvals nobody has connected.",
    outcome: "The conversation, the context and the resolution path stay together — with sensitive actions approved by a person.",
    path: ["Understand the request in context", "Apply policy and account truth", "Pause sensitive actions for approval", "Resolve and record the outcome"],
    systems: ["Communication", "Customer record", "Policy", "Commerce"],
    decision: "Which actions the workflow may take alone, and which pause for a person, is an explicit configuration.",
    interaction: "conversation",
  },
  {
    slug: "data-intelligence",
    title: "Data intelligence",
    lead: "Decision-ready information — figures with sources, conflicts flagged, exceptions separated from noise.",
    condition: "Data exists everywhere, but decisions still start with someone assembling numbers by hand and hoping they agree.",
    outcome: "Recurring decision-ready outputs where every figure is traceable and conflicts are flagged, never averaged away.",
    path: ["Connect the sources", "Reconcile and flag conflicts", "Surface exceptions that need decisions", "Deliver with the evidence attached"],
    systems: ["Data", "Documents", "Communication"],
    decision: "What counts as an exception — thresholds, variances, ownership — is decided by your team.",
    interaction: "reconcile",
  },
  {
    slug: "custom-ai-systems",
    title: "Custom AI systems",
    lead: "Alter Engine shaped around your systems, permissions, handoffs and operating rules.",
    condition: "The work is real but it fits no product: your systems, your permissions, your sequence, your rules.",
    outcome: "A governed execution system built around the way your organisation already decides and works.",
    path: ["Map systems, roles and rules", "Design the mission and approval model", "Implement and connect", "Operate with evidence and iterate"],
    systems: ["Your existing systems", "Custom connections", "Identity and access"],
    decision: "Every authority boundary is designed with you before anything runs.",
    interaction: "custom",
  },
];

export const INTEGRATION_CATEGORIES = [
  { key: "communication", label: "Communication", desc: "Messages, channels and notifications that missions send or read.", permissions: "Send and read within granted channels only", triggers: "Inbound message, mention, schedule", actions: "Send, reply, post, notify", approval: "Outbound external messages can require approval", evidence: "Every sent message is recorded against its mission step" },
  { key: "documents", label: "Documents", desc: "Files, records and briefs that missions read, assemble and produce.", permissions: "Scoped folders and record types", triggers: "New document, updated record", actions: "Read, draft, assemble, archive", approval: "Publishing or sharing can require approval", evidence: "Artifacts are versioned and linked to the producing step" },
  { key: "data", label: "Data", desc: "Datasets, extracts and models that missions query and reconcile.", permissions: "Read-only by default; writes are explicit", triggers: "Schedule, threshold, data change", actions: "Query, extract, reconcile, score", approval: "Writes back to a source can require approval", evidence: "Every figure keeps its source reference" },
  { key: "commerce", label: "Commerce", desc: "Catalogue, pricing, orders and stock actions.", permissions: "Scoped to defined catalogues and price lists", triggers: "Order event, stock threshold", actions: "Reserve, price update, order action", approval: "Pricing and order changes pause for approval by default", evidence: "State before and after every change is retained" },
  { key: "operations", label: "Operations", desc: "Inventory, locations, logistics and operational records.", permissions: "Location and record-type scope", triggers: "Movement event, attention signal", actions: "Update record, flag attention, propose action", approval: "Structural changes require approval", evidence: "Movement history is preserved with the mission trail" },
  { key: "internal", label: "Internal systems", desc: "Your internal tools connected through a managed boundary.", permissions: "Defined per system with your team", triggers: "Defined per system", actions: "Defined per system", approval: "Access grants always pause for approval", evidence: "All internal actions are recorded" },
  { key: "custom", label: "Custom connection", desc: "A connection that does not exist yet — built with explicit scope.", permissions: "Designed with you", triggers: "Designed with you", actions: "Designed with you", approval: "Defined during design", evidence: "Defined during design" },
];

export const PRICING_SHAPES = [
  { name: "Pilot", lead: "Prove it on one mission.", points: ["Guided first mission", "Limited workspace", "Defined integration scope", "Success and evidence plan"] },
  { name: "Team", lead: "Run the work that repeats.", points: ["Multiple missions and workflows", "Team roles and approvals", "Standard integrations", "Usage visibility"] },
  { name: "Enterprise", lead: "Govern it across the organisation.", points: ["Organization controls", "SSO and advanced roles", "Governance and retention configuration", "Custom integration and deployment options", "Enterprise support"] },
];

export const COST_FACTORS = [
  { t: "People and workspaces", d: "Who works in the system and how separated their spaces must be." },
  { t: "Execution usage", d: "How much work the Engine plans, runs and checks." },
  { t: "Connected systems", d: "How many systems missions read from and act on." },
  { t: "Storage and evidence", d: "How much history and evidence you retain, and for how long." },
  { t: "Advanced controls", d: "SSO, granular roles, retention and governance configuration." },
  { t: "Support and deployment", d: "How the system is deployed and how quickly you need us." },
];

export const PRINCIPLES = [
  { t: "Outcome first", d: "Work begins from the result that must be true, not from the tool that happens to exist." },
  { t: "Governed by design", d: "Authority, approvals and boundaries are designed into the system, never bolted on." },
  { t: "Adaptive intelligence", d: "When reality changes, the route changes with it — visibly." },
  { t: "Transparent by default", d: "Progress, decisions and evidence are observable while work moves, not reconstructed after." },
  { t: "Built to endure", d: "Systems are built to survive audits, handovers and time — not just demos." },
];

export const DISCIPLINES = [
  "Product and design",
  "Frontend and interaction engineering",
  "AI systems and orchestration",
  "Data and integrations",
  "Customer implementation",
  "Operations and growth",
];

export const OPEN_ROLES = [];

export const DEV_SECTIONS = [
  { id: "architecture", t: "Architecture overview", d: "Your product or internal system submits an objective. AlterX returns a visible plan, streams execution states, raises approval events to the people you designate and returns a reviewable result with its evidence." },
  { id: "mission-model", t: "Mission schema", d: "A mission carries the objective, context, constraints and success criteria; a plan of steps with dependencies and expected outputs; the decisions made along the way; and the evidence produced.", code: `// Conceptual preview — API access is managed.
mission {
  objective:  "Prepare a decision-ready supplier comparison"
  context:    [...records]
  constraints:[...rules]
  criteria:   [...checks]
  plan:       step[]        // dependencies, systems, outputs
  decisions:  decision[]    // approvals, edits, declines
  evidence:   artifact[]    // sources, checks, trail
}` },
  { id: "states", t: "Execution states", d: "Steps move through explicit states you can observe: queued, running, waiting-approval, blocked, failed, recovered, completed, checked. State changes are events your system can subscribe to.", code: `// Conceptual preview — API access is managed.
on(mission.step.stateChanged, (e) => {
  // queued | running | waiting_approval
  // blocked | failed | recovered
  // completed | checked
  render(e.stepId, e.state, e.evidenceRef)
})` },
  { id: "approvals", t: "Approval events", d: "When a step requires human authority, execution pauses and an approval event is raised with the proposed action, affected system, reason, scope, risk and rollback. Your interface presents it; a person decides.", code: `// Conceptual preview — API access is managed.
on(mission.approval.requested, (a) => {
  show({
    action: a.proposedAction,
    system: a.affectedSystem,
    reason: a.reason, scope: a.scope,
    choices: ["approve","edit","request_context","decline"]
  })
})` },
  { id: "evidence", t: "Result and evidence", d: "The final result returns with the checks it passed, the sources behind it, the decisions taken and the full timeline — exportable and reviewable." },
  { id: "connectors", t: "Connector model", d: "Connections are permissioned per system: explicit scope, allowed actions, approval requirements and evidence behaviour. Missions can never exceed the granted scope." },
  { id: "auth", t: "Authentication and permissions", d: "Access is identity-based with workspace separation. Roles define who can create missions, approve actions, connect systems and export evidence." },
];

export const LEGAL_PAGES = {
  privacy: { title: "Privacy Policy", summary: "How AlterX collects, uses and protects information across the public website and product experiences." },
  "cookie-policy": { title: "Cookie Policy", summary: "Which cookies the AlterX website uses, why, and the choices available to you." },
  terms: { title: "Terms of Service", summary: "The terms that govern use of the AlterX website and product experiences." },
  "acceptable-use": { title: "Acceptable Use Policy", summary: "What may and may not be done with AlterX products and services." },
  dpa: { title: "Data Processing Addendum", summary: "How AlterX processes data on behalf of customers, including roles, safeguards and obligations." },
};

export const LEGAL_SECTIONS = [
  "Scope and application",
  "Definitions",
  "Information and data handling",
  "Your rights and choices",
  "Security measures",
  "Retention",
  "Contact and grievance",
];
