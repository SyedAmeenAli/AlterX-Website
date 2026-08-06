export const SCENARIOS = [
  {
    key: "supplier-comparison",
    title: "Supplier comparison",
    objective: "Compare three suppliers and prepare a decision brief",
    clarify: {
      question: "Should the comparison weight unit cost, lead time and quality history equally, or should one criterion lead?",
      context: ["Three candidate suppliers identified", "Existing quotes are 40+ days old", "Q3 packaging contract renewal"],
      constraints: ["No commitments may be made without approval", "Use only approved communication channels"],
      criteria: ["Side-by-side comparison across cost, lead time, quality", "A written recommendation with reasoning", "Evidence trail for each data point"],
    },
    steps: [
      { id: "s1", label: "Collect supplier records", system: "Documents", output: "Supplier profile set", detail: "Gather existing profiles, contracts and quality notes for all three suppliers." },
      { id: "s2", label: "Request updated quotes", system: "Communication", output: "Three current quotes", approval: true, detail: "Draft and send quote requests to each supplier contact.", approvalCard: { action: "Send quote request emails to 3 supplier contacts", system: "Communication (email)", reason: "Existing quotes are older than 40 days and no longer decision-grade.", scope: "3 outbound messages, no commitments, no pricing disclosure", risk: "Low — outbound request only", rollback: "Follow-up message withdrawing the request" } },
      { id: "s3", label: "Normalize pricing data", system: "Data", output: "Comparable cost model", parallel: true, detail: "Convert quotes into a like-for-like cost model including logistics." },
      { id: "s4", label: "Score suppliers against criteria", system: "Data", output: "Weighted scorecard", failure: true, detail: "Apply the agreed weighting across cost, lead time and quality history.", failureCard: { what: "Quality-history data for Supplier B is incomplete", classification: "Missing input data", impact: "Scorecard would be built on partial evidence", evidence: "2 of 6 expected quality records located" } },
      { id: "s5", label: "Assemble decision brief", system: "Documents", output: "Decision-ready brief", detail: "Compose the comparison, recommendation and reasoning into one brief." },
    ],
    verify: {
      result: "A decision-ready supplier comparison brief with a weighted scorecard and written recommendation.",
      checks: [
        { label: "All three suppliers covered", state: "pass" },
        { label: "Quotes are current (< 7 days)", state: "pass" },
        { label: "Recommendation reasoning is complete", state: "weak", note: "Reasoning for lead-time weighting is thin — returned for revision" },
        { label: "Every data point has a source", state: "pass" },
      ],
      weakStep: "s5",
      artifacts: ["Supplier profile set", "Three current quotes", "Comparable cost model", "Weighted scorecard", "Decision brief v2"],
    },
  },
  {
    key: "stagnant-inventory",
    title: "Stagnant inventory review",
    objective: "Review stagnant inventory and propose actions",
    clarify: {
      question: "What counts as stagnant for this review — 60 days without movement, 90, or a custom threshold?",
      context: ["Inventory spread across 2 locations", "Seasonal items present in the catalogue", "Last review was one quarter ago"],
      constraints: ["No price changes without approval", "Donation and write-off need finance sign-off"],
      criteria: ["A ranked list of stagnant items with value at risk", "One proposed action per item group", "Approval points identified before execution"],
    },
    steps: [
      { id: "s1", label: "Pull movement history", system: "Inventory record", output: "Movement dataset", detail: "Extract stock movement across both locations for the review window." },
      { id: "s2", label: "Identify stagnant items", system: "Data", output: "Stagnant item list", detail: "Apply the agreed threshold and rank by value at risk." },
      { id: "s3", label: "Group items and propose actions", system: "Data", output: "Action proposal per group", detail: "Markdown, bundle, relocate or hold — one proposal per group." },
      { id: "s4", label: "Apply markdown to Group A", system: "Commerce", output: "Updated pricing", approval: true, detail: "Group A carries the highest value at risk.", approvalCard: { action: "Apply 20% markdown to 14 items in Group A", system: "Commerce (pricing)", reason: "Group A has not moved in 90+ days and carries the highest value at risk.", scope: "14 items, one location, price change only", risk: "Medium — revenue impact if demand was mis-read", rollback: "Restore previous prices from the recorded state" } },
      { id: "s5", label: "Prepare review summary", system: "Documents", output: "Stagnant stock report", failure: true, detail: "Summarise findings, actions taken and items awaiting decisions.", failureCard: { what: "Location 2 movement export timed out", classification: "Connection interruption", impact: "Summary would omit one location", evidence: "Export completed for location 1 only" } },
    ],
    verify: {
      result: "A ranked stagnant-stock review with actions proposed per group and one approved markdown applied.",
      checks: [
        { label: "Both locations covered", state: "pass" },
        { label: "Every group has a proposed action", state: "pass" },
        { label: "Approvals recorded for pricing changes", state: "pass" },
        { label: "Value-at-risk totals reconcile", state: "weak", note: "Group C total did not reconcile — returned for revision" },
      ],
      weakStep: "s5",
      artifacts: ["Movement dataset", "Stagnant item list", "Action proposals", "Markdown approval record", "Stagnant stock report v2"],
    },
  },
  {
    key: "customer-onboarding",
    title: "Customer onboarding workflow",
    objective: "Plan a customer onboarding workflow with approvals",
    clarify: {
      question: "Does onboarding include provisioning system access, or does it stop at the signed welcome pack?",
      context: ["New customer signed last week", "Three teams participate in onboarding", "Access provisioning is sensitive"],
      constraints: ["Access grants always require approval", "Welcome communication uses the approved template"],
      criteria: ["Every onboarding step assigned to an owner", "Access requests routed through approval", "Customer receives a clear timeline"],
    },
    steps: [
      { id: "s1", label: "Assemble customer context", system: "Documents", output: "Onboarding context pack", detail: "Contract scope, contacts, and success goals in one place." },
      { id: "s2", label: "Draft the onboarding plan", system: "Data", output: "Step-by-step plan", detail: "Steps, owners and dependencies across the three teams." },
      { id: "s3", label: "Provision workspace access", system: "Internal systems", output: "Access granted", approval: true, detail: "Create accounts and grant the scoped access the contract allows.", approvalCard: { action: "Grant workspace access to 4 customer users", system: "Internal systems (access)", reason: "The contract includes workspace access for up to five named users.", scope: "4 users, standard role, customer workspace only", risk: "Medium — access is sensitive by definition", rollback: "Revoke the granted accounts" } },
      { id: "s4", label: "Send welcome sequence", system: "Communication", output: "Welcome sent", failure: true, detail: "Send the approved welcome pack and timeline.", failureCard: { what: "Welcome template variable failed to resolve", classification: "Template configuration error", impact: "Customer would receive a broken message", evidence: "Render preview shows unresolved {timeline} field" } },
      { id: "s5", label: "Schedule kickoff review", system: "Communication", output: "Kickoff scheduled", detail: "Book the kickoff with all three teams and the customer." },
    ],
    verify: {
      result: "A complete onboarding plan with owners, approved access provisioning and a scheduled kickoff.",
      checks: [
        { label: "Every step has an owner", state: "pass" },
        { label: "Access grant has an approval record", state: "pass" },
        { label: "Welcome message rendered correctly", state: "pass" },
        { label: "Timeline shared with the customer", state: "weak", note: "Timeline missing one milestone — returned for revision" },
      ],
      weakStep: "s2",
      artifacts: ["Onboarding context pack", "Onboarding plan", "Access approval record", "Welcome sequence", "Kickoff invitation"],
    },
  },
  {
    key: "weekly-report",
    title: "Weekly operating report",
    objective: "Prepare a weekly operating report from multiple sources",
    clarify: {
      question: "Should the report lead with exceptions that need decisions, or with the full metric summary?",
      context: ["Four source systems feed the report", "Leadership reads it Monday morning", "Last week two numbers conflicted"],
      constraints: ["No numbers without a named source", "Conflicting figures must be flagged, not averaged"],
      criteria: ["One page, decision-first", "Every figure traceable to its source", "Exceptions clearly separated from noise"],
    },
    steps: [
      { id: "s1", label: "Collect source extracts", system: "Data", output: "Four source extracts", detail: "Pull the weekly extract from each connected source." },
      { id: "s2", label: "Reconcile overlapping figures", system: "Data", output: "Reconciled dataset", failure: true, detail: "Compare figures reported by more than one system.", failureCard: { what: "Revenue figure conflicts between two sources", classification: "Data conflict", impact: "Report could publish a wrong headline number", evidence: "Source A: 4.2% variance vs Source B" } },
      { id: "s3", label: "Draft exception summary", system: "Documents", output: "Exception list", detail: "Surface only what needs a decision this week." },
      { id: "s4", label: "Publish to leadership channel", system: "Communication", output: "Report delivered", approval: true, detail: "Post the finished report to the leadership channel.", approvalCard: { action: "Publish the weekly report to the leadership channel", system: "Communication (channel post)", reason: "The report reaches the full leadership group and becomes the operating record.", scope: "One post, leadership channel only", risk: "Low — publication only, no data change", rollback: "Retract the post and publish a corrected version" } },
      { id: "s5", label: "Archive with sources", system: "Documents", output: "Archived report", detail: "Store the report with links to every source extract." },
    ],
    verify: {
      result: "A one-page, decision-first weekly operating report with every figure traceable to its source.",
      checks: [
        { label: "All four sources included", state: "pass" },
        { label: "Conflicts flagged, not averaged", state: "pass" },
        { label: "Exception list is decision-ready", state: "weak", note: "One exception lacks a proposed action — returned for revision" },
        { label: "Archive links resolve", state: "pass" },
      ],
      weakStep: "s3",
      artifacts: ["Four source extracts", "Reconciled dataset", "Exception list v2", "Published report", "Archive record"],
    },
  },
];

export function matchScenario(objective = "") {
  const o = objective.toLowerCase();
  if (/(supplier|vendor|procure|quote|compare)/.test(o)) return SCENARIOS[0];
  if (/(inventory|stock|stagnant|sku|warehouse)/.test(o)) return SCENARIOS[1];
  if (/(onboard|customer setup|welcome|provision)/.test(o)) return SCENARIOS[2];
  if (/(report|weekly|summary|operating|dashboard)/.test(o)) return SCENARIOS[3];
  return SCENARIOS[0];
}
