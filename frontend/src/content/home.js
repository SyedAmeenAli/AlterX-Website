export const HERO = {
  eyebrow: "ALTER ENGINE",
  line1: "Start with the outcome.",
  line2: "Watch it become",
  phrases: ["a clear plan.", "work in motion.", "the right approval.", "a checked result."],
  paragraph: "Alter Engine structures complex work, carries out approved steps and keeps important decisions open to review.",
};

export const STAGES = ["Understand", "Plan", "Approve", "Act", "Check"];

export const PRODUCT_PANELS = [
  {
    key: "engine",
    category: "FLAGSHIP PRODUCT",
    title: "Alter Engine",
    description: "Turn one objective into a clear sequence of work. Review the plan, approve important actions and inspect the result.",
    cta: "Explore Alter Engine",
    to: "/alter-engine",
  },
  {
    key: "cognitive",
    category: "INVENTORY OPERATIONS",
    title: "Cognitive AI",
    description: "Bring product information, stock attention, location activity and inventory decisions into one operating view.",
    cta: "Explore Cognitive AI",
    to: "/cognitive-ai",
  },
  {
    key: "workflows",
    category: "ENTERPRISE",
    title: "Custom workflows",
    description: "Shape Alter Engine around your existing systems, permissions, handoffs and operating rules.",
    cta: "Discuss a workflow",
    to: "/contact",
  },
  {
    key: "build",
    category: "DEVELOPERS AND PRODUCTS",
    title: "Build with AlterX",
    description: "Bring planned, approval-aware Alter Engine workflows into an existing product or internal environment.",
    cta: "Explore developer access",
    to: "/developers",
  },
];

export const ENGINE_STORY = [
  { stage: "Understand", copy: "The required result is clarified before the work begins." },
  { stage: "Plan", copy: "The route appears before any important action runs." },
  { stage: "Approve", copy: "Human judgment returns exactly where authority matters." },
  { stage: "Act", copy: "Approved work moves while current progress remains visible." },
  { stage: "Check", copy: "The result is checked against the original requirement and returned with its trail." },
];

export const RUNWAY_ROWS = [
  { cap: "Starts with the required result", a: ["Limited", 0.34], f: ["No", 0.16], e: ["Yes", 1], why: "Alter Engine begins from the outcome that must be true at the end, not from a prompt or a trigger." },
  { cap: "Creates the plan", a: ["Suggests only", 0.4], f: ["No", 0.14], e: ["Yes", 1], why: "A visible plan of tasks, dependencies and expected outputs is produced before anything runs." },
  { cap: "Handles multiple dependent steps", a: ["Limited", 0.36], f: ["Requires manual setup", 0.58], e: ["Yes", 1], why: "Sequential and parallel steps stay connected to the same objective and to each other." },
  { cap: "Uses approved systems", a: ["Depends on configuration", 0.42], f: ["Yes", 0.66], e: ["Yes", 1], why: "Connections are permissioned. Every step runs only within the scope that was granted." },
  { cap: "Pauses for human decisions", a: ["No", 0.18], f: ["No", 0.18], e: ["Yes", 1], why: "Important actions stop and wait. The right person approves, edits, requests context or declines." },
  { cap: "Shows current progress", a: ["No", 0.2], f: ["Limited", 0.44], e: ["Yes", 1], why: "Running, waiting and completed steps remain visible while the mission moves." },
  { cap: "Checks the result", a: ["No", 0.18], f: ["No", 0.2], e: ["Yes", 1], why: "The output is compared against the original success criteria before it is returned." },
  { cap: "Responds when a step fails", a: ["No", 0.16], f: ["Stops or repeats", 0.4], e: ["Yes", 1], why: "Failures are classified. The route can retry, change, ask for clarification or stop." },
  { cap: "Preserves evidence", a: ["No", 0.14], f: ["Limited", 0.38], e: ["Yes", 1], why: "Decisions, approvals, artifacts and checks keep their trail behind every outcome." },
];

export const ORBIT_NODES = [
  { key: "outcome", label: "Outcome first", copy: "Every mission starts from the result that must be true at the end. The objective stays attached to every step, decision and check." },
  { key: "authority", label: "Human authority", copy: "Actions that matter pause for the right person. Approval is a first-class state, not an afterthought buried in a log." },
  { key: "progress", label: "Visible progress", copy: "Running, waiting and completed work stays observable. Nothing important disappears into a spinner." },
  { key: "checked", label: "Checked results", copy: "The output is compared against the original requirement. A weak step goes back for revision before the result is returned." },
  { key: "recovery", label: "Recovery and evidence", copy: "Failures are classified and routed — retry, alternate route, clarification or stop — and every event keeps its trail." },
];

export const VOICE_INDUSTRIES = [
  {
    key: "financial",
    label: "Financial services",
    scenario: "A customer questions a transaction. The workflow confirms identity, collects the right context, applies policy, and sends a sensitive action for human approval.",
    transcript: [
      { who: "customer", text: "There's a charge on my account I don't recognise from Tuesday." },
      { who: "agent", text: "I can look into that. Let me first confirm it's really you." },
      { who: "sys", text: "Identity confirmed · account context retrieved · transaction located" },
      { who: "agent", text: "I can see the charge. Based on policy this qualifies for a dispute." },
      { who: "sys", text: "Proposed action: open dispute and issue provisional credit", approval: true },
      { who: "agent", text: "A specialist has approved the dispute. You'll see a provisional credit within two days." },
    ],
    understood: ["Unrecognised transaction", "Identity verification required", "Dispute policy applies", "Provisional credit needs human approval"],
    outcome: "Dispute opened with approval. Customer informed. Evidence retained.",
  },
  {
    key: "gaming",
    label: "Gaming",
    scenario: "A player reports an account or purchase issue. The workflow keeps the conversation, account context, policy and resolution path connected.",
    transcript: [
      { who: "customer", text: "I bought an item pack but it never showed up in my inventory." },
      { who: "agent", text: "Let's check your purchase and account together." },
      { who: "sys", text: "Purchase record found · delivery state: failed · account in good standing" },
      { who: "agent", text: "The delivery failed on our side. I can re-issue the pack." },
      { who: "sys", text: "Proposed action: re-grant purchased items to the account", approval: true },
      { who: "agent", text: "Done — the pack is back in your inventory. Anything else?" },
    ],
    understood: ["Failed item delivery", "Purchase verified", "Re-grant path available", "Grant action requires approval"],
    outcome: "Items re-granted after approval. Resolution recorded against the purchase.",
  },
  {
    key: "retail",
    label: "Retail",
    scenario: "A customer asks about stock, delivery or return options. The workflow connects product, inventory, order and policy information.",
    transcript: [
      { who: "customer", text: "Do you have the ceramic table lamp in stock, and can it arrive by Friday?" },
      { who: "agent", text: "Checking stock and delivery windows for your address." },
      { who: "sys", text: "Stock: 14 units · nearest location: 2 · Friday delivery: available" },
      { who: "agent", text: "Yes — in stock, and Friday delivery is available. Shall I reserve one?" },
      { who: "sys", text: "Proposed action: reserve one unit against the order", approval: true },
      { who: "agent", text: "Reserved. You'll receive the confirmation shortly." },
    ],
    understood: ["Stock availability question", "Delivery deadline: Friday", "Reservation possible", "Reservation is a system action"],
    outcome: "Unit reserved with confirmation. Inventory record updated in the demonstration.",
  },
  {
    key: "travel",
    label: "Travel",
    scenario: "A traveller's plans change. The workflow gathers the booking context, identifies available options and returns important decisions to the right person.",
    transcript: [
      { who: "customer", text: "My meeting moved — I need to come back a day earlier." },
      { who: "agent", text: "Let me pull up your booking and see what's possible." },
      { who: "sys", text: "Booking retrieved · earlier return options: 3 · fare difference applies" },
      { who: "agent", text: "There are three earlier options. The 4pm option has the smallest fare difference." },
      { who: "sys", text: "Proposed action: rebook to 4pm return with fare adjustment", approval: true },
      { who: "agent", text: "Rebooked. Your updated itinerary is on its way." },
    ],
    understood: ["Return date change", "Booking context retrieved", "Three viable options", "Rebooking requires confirmation"],
    outcome: "Rebooked after approval. Itinerary and fare adjustment recorded.",
  },
];

export const SECURITY_PRINCIPLES = [
  { t: "Identity and access", d: "Who can see and do what is defined before work moves." },
  { t: "Workspace separation", d: "Missions, data and evidence stay inside their workspace." },
  { t: "Permissioned connections", d: "Systems are connected with explicit scope, never blanket access." },
  { t: "Human approvals", d: "Sensitive actions pause for the person with authority." },
  { t: "Activity and evidence", d: "Every decision and action keeps its trail." },
  { t: "Retention", d: "What is kept, and for how long, is a configuration — not an accident." },
];

export const WORK_ENTRIES = [
  {
    slug: "irepairme",
    name: "iRepairMe",
    category: "AI-enabled websites",
    title: "Building an AI-enabled website experience for iRepairMe.",
    description: "A digital experience that helps visitors understand service options, complete key actions and hand off to the right team.",
    label: "Customer review pending approval",
    condition: "Visitors arrived with a broken device and left without a clear next step. Service options, pricing logic and handoff lived in separate places.",
    outcome: "A visitor understands their repair options, completes the key action and reaches the right team without friction.",
    path: ["Understand the visitor's device and issue", "Map to the right service options", "Guide the key action", "Hand off to the right team with context"],
    systems: ["Website experience", "Service catalogue", "Team handoff"],
    decision: "Service routing rules and escalation boundaries were defined with the iRepairMe team and remain under their control.",
  },
  {
    slug: "rare-casual",
    name: "Rare Casual",
    category: "Cognitive AI",
    title: "Connecting inventory, campaigns and business visibility through Cognitive AI.",
    description: "A connected environment for product information, inventory activity, campaign operations and business visibility.",
    label: "Customer review pending approval",
    condition: "Product information, stock movement and campaign work lived in disconnected tools. Attention went to whoever shouted loudest, not to what the inventory said.",
    outcome: "One connected record of products, stock, locations and campaigns — with attention signals surfacing what actually needs a decision.",
    path: ["Structure the product record", "Track stock and location activity", "Surface attention signals", "Connect campaigns to inventory truth"],
    systems: ["Product catalogue", "Inventory record", "Campaign operations"],
    decision: "Catalogue confirmation and campaign actions pause for human review before entering the record.",
  },
  {
    slug: "simple-architect",
    name: "Simple Architect",
    category: "AI-enabled websites",
    title: "Designing and building a clear digital website experience for Simple Architect.",
    description: "A focused digital experience mapping services and portfolio details clearly for prospective clients.",
    label: "Customer review pending approval",
    condition: "A strong portfolio was hidden behind an unclear structure. Prospective clients could not quickly understand services, process or fit.",
    outcome: "A clear route from first visit to enquiry — services, portfolio and process mapped for the way clients actually evaluate an architect.",
    path: ["Clarify the service structure", "Design the portfolio presentation", "Map the enquiry route", "Build and refine the experience"],
    systems: ["Website experience", "Portfolio content", "Enquiry handling"],
    decision: "Content structure and portfolio selection were reviewed and approved by the Simple Architect team.",
  },
];

export const RESOURCES = [
  { slug: "designing-human-checkpoints", type: "Guide", title: "Designing human checkpoints", value: "Where human judgment belongs in automated work — and how to design the pause.", read: "7 min" },
  { slug: "evidence-by-design", type: "Guide", title: "Evidence by design", value: "Why the trail behind a result matters as much as the result.", read: "6 min" },
  { slug: "a-mission-is-not-just-a-workflow", type: "Insight", title: "A mission is not just a workflow", value: "The difference between repeating steps and pursuing an outcome.", read: "5 min" },
  { slug: "from-demo-to-governed-system", type: "Insight", title: "From an AI demonstration to a governed system", value: "What changes when AI work has to survive an audit.", read: "8 min" },
  { slug: "one-connected-record", type: "Insight", title: "Why inventory needs one connected record", value: "Disconnected tools create disconnected decisions.", read: "5 min" },
  { slug: "image-based-capture", type: "Guide", title: "How image-based capture reduces repetitive entry", value: "From a product photo to a confirmable structured record.", read: "4 min" },
  { slug: "understanding-stagnant-stock", type: "Guide", title: "Understanding stagnant stock", value: "Seeing the inventory that quietly stops moving — and deciding what to do.", read: "6 min" },
  { slug: "campaigns-to-inventory", type: "Insight", title: "Connecting campaigns to inventory decisions", value: "Campaign work should answer to inventory truth.", read: "5 min" },
];

export const COMPOSER_CHIPS = [
  "Compare three suppliers and prepare a decision brief",
  "Review stagnant inventory and propose actions",
  "Plan a customer onboarding workflow with approvals",
  "Prepare a weekly operating report from multiple sources",
];
