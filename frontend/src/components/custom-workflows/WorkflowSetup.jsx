import { useState } from "react";
import { Check } from "lucide-react";
import "./workflow-setup.css";

/*
  WorkflowSetup — mechanics absorbed from an onboarding-wizard reference
  (stepper, choice selection, content transitions), fully re-skinned: no
  business name / legal name / monthly revenue / profile image. This
  configures a workflow, not a SaaS account. The right side is a live
  interpretation driven by the actual selections — not a stock image.
*/

const STEPS = ["Outcome", "Systems", "Authority", "Review"];

const SYSTEM_OPTIONS = ["Supplier records", "Current quotes", "Quality notes", "ERP"];
const AUTHORITY_OPTIONS = ["Supplier commitment", "Order creation", "External communication"];
const REVIEW_OPTIONS = ["Delivery reliability", "Quality evidence", "Commercial terms"];

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export default function WorkflowSetup() {
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState("");
  const [systems, setSystems] = useState([]);
  const [authority, setAuthority] = useState([]);
  const [review, setReview] = useState([]);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div className="axw-setup" data-testid="workflow-setup">
      <div className="axw-form">
        <p className="axw-eyebrow">Define the workflow</p>
        <h3 className="axw-title">Start with the outcome and show AlterX where people and systems need to stay in control.</h3>

        <div className="axw-steps">
          {STEPS.map((s, i) => (
            <span key={s} className={`axw-step ${i === step ? "is-active" : i < step ? "is-done" : ""}`}>
              STEP {i + 1} / 4 · {s}
            </span>
          ))}
        </div>

        <div className="axw-panel">
          {step === 0 && (
            <>
              <label className="axw-label" htmlFor="axw-outcome">What needs to be completed?</label>
              <textarea
                id="axw-outcome"
                className="axw-textarea"
                placeholder="Prepare a supplier comparison before tomorrow's review."
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                rows={3}
                data-testid="axw-outcome-input"
              />
            </>
          )}
          {step === 1 && (
            <>
              <p className="axw-label">Which systems are involved?</p>
              <div className="axw-chips">
                {SYSTEM_OPTIONS.map((o) => (
                  <button type="button" key={o} className={`axw-chip ${systems.includes(o) ? "is-selected" : ""}`} onClick={() => setSystems((prev) => toggle(prev, o))} data-testid={`axw-system-${o.toLowerCase().replace(/\s+/g, "-")}`}>
                    {systems.includes(o) && <Check size={12} aria-hidden="true" />} {o}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="axw-label">Where is approval required?</p>
              <div className="axw-chips">
                {AUTHORITY_OPTIONS.map((o) => (
                  <button type="button" key={o} className={`axw-chip ${authority.includes(o) ? "is-selected" : ""}`} onClick={() => setAuthority((prev) => toggle(prev, o))} data-testid={`axw-authority-${o.toLowerCase().replace(/\s+/g, "-")}`}>
                    {authority.includes(o) && <Check size={12} aria-hidden="true" />} {o}
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <p className="axw-label">What should be checked before completion?</p>
              <div className="axw-chips">
                {REVIEW_OPTIONS.map((o) => (
                  <button type="button" key={o} className={`axw-chip ${review.includes(o) ? "is-selected" : ""}`} onClick={() => setReview((prev) => toggle(prev, o))} data-testid={`axw-review-${o.toLowerCase().replace(/\s+/g, "-")}`}>
                    {review.includes(o) && <Check size={12} aria-hidden="true" />} {o}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="axw-nav">
          {step > 0 && <button type="button" className="axw-btn-ghost" onClick={back} data-testid="axw-back-btn">Back</button>}
          {step < 3 ? (
            <button type="button" className="axw-btn-primary" onClick={next} data-testid="axw-next-btn">Continue</button>
          ) : (
            <button type="button" className="axw-btn-primary" data-testid="axw-review-btn">Review workflow</button>
          )}
        </div>
      </div>
    </div>
  );
}
