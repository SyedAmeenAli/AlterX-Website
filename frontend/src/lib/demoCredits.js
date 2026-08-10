/*
  DEMO_CREDIT_MODEL — the one formula behind every "demo credits" number
  shown in the Try Alter Engine workspace. Illustrative only, no billing
  attached, no real product credit model exists to source this from.
*/
export const DEMO_CREDIT_MODEL = {
  planningBase: 3,
  perInput: 1,
  perActionStep: 2,
  actionStepsBase: 2,
  perCheck: 1,
  perApproval: 1,
};

// Illustrative demo allowance shown on the Usage page. No real billing or
// credit system exists behind this — it exists only so "usage" has a
// visible ceiling in the demo, exactly like DEMO_CREDIT_MODEL above.
export const DEMO_CREDIT_POOL = 1000;

export function estimateWorkflowUsage({ inputs = [], checks = [], authority = [] }) {
  const planning = DEMO_CREDIT_MODEL.planningBase + inputs.length * DEMO_CREDIT_MODEL.perInput;
  const action = DEMO_CREDIT_MODEL.actionStepsBase + authority.length * DEMO_CREDIT_MODEL.perActionStep;
  const checking = checks.length * DEMO_CREDIT_MODEL.perCheck + authority.length * DEMO_CREDIT_MODEL.perApproval;
  return { planning, action, checking, total: planning + action + checking };
}

// Same formula family, applied to a running/finished mission instead of a
// workflow draft — derived from real mission state, not a stored number.
export function estimateMissionUsage(mission, scenario) {
  const stepCount = scenario?.steps?.length || 0;
  const approvalSteps = scenario?.steps?.filter((s) => s.approval).length || 0;
  const planning = DEMO_CREDIT_MODEL.planningBase + stepCount * DEMO_CREDIT_MODEL.perInput;
  const action = DEMO_CREDIT_MODEL.actionStepsBase + (mission?.completedSteps?.length || 0) * DEMO_CREDIT_MODEL.perActionStep;
  const checking = approvalSteps * DEMO_CREDIT_MODEL.perApproval + (mission?.decisions?.length || 0) * DEMO_CREDIT_MODEL.perCheck;
  return { planning, action, checking, total: planning + action + checking };
}
