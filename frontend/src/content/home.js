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
    audio: "/audio/financial.mp3",
    scenario: "A customer questions a transaction. The workflow confirms the account, locates the transaction, and sends the dispute for human approval before it touches the account record.",
    transcript: [
      { who: "customer", text: "There's a charge on my account from Tuesday that I don't recognize." },
      { who: "agent", text: "I can look into that. Before anything changes, I'll confirm the account and check the transaction context." },
      { who: "sys", text: "Account confirmed · transaction located" },
      { who: "customer", text: "Yes, that's my account — I definitely didn't make that purchase." },
      { who: "agent", text: "I've confirmed the account and found the transaction. I can prepare a dispute, but submitting it changes the account record." },
      { who: "sys", text: "Proposed action: submit dispute for review", approval: true },
      { who: "agent", text: "Approved. I've prepared the dispute and attached the relevant account activity for review." },
    ],
    understood: ["Unrecognised transaction from Tuesday", "Account and transaction confirmed", "Dispute would change the account record", "Submitting the dispute needs approval"],
    outcome: "Dispute prepared with account activity attached for review. Nothing submitted without approval.",
  },
  {
    key: "gaming",
    label: "Gaming",
    audio: "/audio/game.mp3",
    scenario: "A player's purchase never delivered. The workflow checks the purchase and entitlement, and sends the recovery for approval before touching the account.",
    transcript: [
      { who: "customer", text: "I bought an item yesterday, but it still isn't showing up in my account." },
      { who: "agent", text: "I'll check the purchase, your account entitlement, and whether the item was delivered correctly." },
      { who: "sys", text: "Purchase found · payment completed · entitlement incomplete" },
      { who: "customer", text: "The payment definitely went through — I just don't have the item." },
      { who: "agent", text: "The entitlement didn't finish correctly. I can recover it without creating another charge, but I'll need your go-ahead." },
      { who: "sys", text: "Proposed action: recover entitlement without a new charge", approval: true },
      { who: "agent", text: "Approved. Entitlement rechecked and recovered — your original purchase remains unchanged." },
    ],
    understood: ["Item never appeared after purchase", "Payment completed, entitlement failed", "Recovery possible without a new charge", "Recovery action requires approval"],
    outcome: "Entitlement recovered and rechecked. Original purchase left unchanged.",
  },
  {
    key: "retail",
    label: "Retail",
    audio: "/audio/retail.mp3",
    scenario: "A customer needs one item on an order sent to a different address. The workflow checks the shipment and sends the change for confirmation before it commits.",
    transcript: [
      { who: "customer", text: "I ordered two items, but I need the second one delivered to a different address." },
      { who: "agent", text: "I'll check the order, the delivery status, and whether the shipment can still be changed." },
      { who: "sys", text: "Order found · shipment not yet committed" },
      { who: "customer", text: "Can you send the second item to my office instead?" },
      { who: "agent", text: "The shipment hasn't been committed yet, so the destination can still be updated — but changing the order needs your confirmation." },
      { who: "sys", text: "Proposed action: update delivery address for item two", approval: true },
      { who: "agent", text: "Approved. I've prepared the delivery update and attached the new destination to the order summary." },
    ],
    understood: ["Second item needs a new delivery address", "Shipment not yet committed", "Destination change is possible", "Order change requires confirmation"],
    outcome: "Delivery address updated, with the new destination attached to the order summary.",
  },
  {
    key: "travel",
    label: "Travel",
    audio: "/audio/travel.mp3",
    scenario: "A traveller's connection shrinks to 20 minutes after a flight change. The workflow reviews the booking, finds an alternative, and shows exactly what changes before confirming.",
    transcript: [
      { who: "customer", text: "My flight changed, and now the connection is only 20 minutes — I don't think I'll make it." },
      { who: "agent", text: "I'll review your booking, the new connection time, and the available alternatives before suggesting any change." },
      { who: "customer", text: "I'd rather arrive a little later than risk missing the connection." },
      { who: "sys", text: "Booking reviewed · alternative found: longer connection, later arrival" },
      { who: "agent", text: "I found an alternative with a longer connection and a later arrival. I can prepare that change and show you exactly what would be affected before anything is confirmed." },
      { who: "customer", text: "Okay, show me the alternative first." },
      { who: "sys", text: "Proposed action: rebook to the later-arrival alternative", approval: true },
      { who: "agent", text: "Approved. Here's the revised route — you can review the new connection and arrival time before deciding." },
    ],
    understood: ["Connection dropped to 20 minutes", "Booking and alternatives reviewed", "Longer-connection alternative found", "Rebooking needs confirmation before it's final"],
    outcome: "Revised route prepared. Nothing changed until the traveller reviewed and confirmed.",
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

// Illustrative workflow examples — not customer case studies. No company
// name, outcome, or metric here is real; each shows product behaviour only.
export const WORK_ENTRIES = [
  {
    slug: "supplier-comparison",
    name: "Supplier comparison",
    category: "Illustrative workflow",
    title: "Comparing supplier information before a sourcing decision.",
    description: "A structured comparison that keeps quotes, quality evidence and the commitment point visible before anything is approved.",
    label: "Illustrative workflow — not a customer case study",
    condition: "A sourcing team needs to compare current supplier information before a decision, with quotes and quality evidence scattered across separate threads and files.",
    outcome: "A reviewable comparison with its supporting evidence, ready for the person who holds the commitment decision.",
    path: ["Structure the objective and current supplier options", "Gather quotes and quality evidence into one view", "Surface the comparison for review", "Hold the commitment point for approval"],
    systems: ["Supplier records", "Quote and evidence sources", "Approval routing"],
    decision: "The commitment point — choosing and confirming a supplier — remains an explicit human approval, not an automatic step.",
  },
  {
    slug: "inventory-exception-review",
    name: "Inventory exception review",
    category: "Illustrative workflow",
    title: "Turning a stock discrepancy into a reviewable exception.",
    description: "A workflow that surfaces an inventory exception with its evidence, instead of letting it sit unnoticed in a report.",
    label: "Illustrative workflow — not a customer case study",
    condition: "A stock count doesn't match the system record, and it isn't clear who should look at it or what evidence supports either number.",
    outcome: "A structured exception with the discrepancy, its evidence and a proposed next step, waiting on a decision from the person responsible.",
    path: ["Detect the discrepancy against the expected record", "Attach the supporting evidence", "Propose a next step", "Route the exception for review before anything changes"],
    systems: ["Inventory record", "Stock count source", "Review routing"],
    decision: "Nothing in the inventory record changes until the exception is reviewed and a decision is made by the responsible person.",
  },
  {
    slug: "order-change-approval",
    name: "Order change approval",
    category: "Illustrative workflow",
    title: "Handling a mid-order change without losing the audit trail.",
    description: "A workflow that structures a requested order change — what's changing, why, and what it affects — before it is committed.",
    label: "Illustrative workflow — not a customer case study",
    condition: "An order needs to change after it was placed — a different delivery address, quantity or item — and the change needs to be checked against what has already been committed.",
    outcome: "A clear, reviewable change request with what it affects, ready for approval before the order record is updated.",
    path: ["Capture the requested change and its reason", "Check it against what has already been committed", "Show exactly what would be affected", "Hold the change for approval before it is applied"],
    systems: ["Order record", "Fulfilment status", "Approval routing"],
    decision: "The order record is only updated after the change is reviewed and approved — nothing is applied silently.",
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
