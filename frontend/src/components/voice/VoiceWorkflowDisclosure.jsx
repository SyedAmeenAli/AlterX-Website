import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import "./voice-disclosure.css";

/*
  VoiceWorkflowDisclosure — compact AlterX workflow object, mechanics
  absorbed from a voice-chat-room reference (collapsed pill -> expanded
  transcript/state disclosure). Fully re-skinned: no avatars, no random
  names, no audio. Abstract participant marks only (human warm-white,
  Alter Engine orange), a small static waveform, transcript fragment,
  approval state. Used as a mega-menu / solution-preview supporting object
  — the real experience remains the homepage/solution-page VoiceDemo.
*/
export default function VoiceWorkflowDisclosure({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <button
      type="button"
      className={`axv-disclosure ${open ? "is-open" : ""}`}
      onClick={() => setOpen((o) => !o)}
      data-testid="voice-workflow-disclosure"
      aria-expanded={open}
    >
      <div className="axv-collapsed">
        <span className="axv-mark axv-mark--human" aria-hidden="true" />
        <span className="axv-mark axv-mark--engine" aria-hidden="true" />
        <span className="axv-wave" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} style={{ "--i": i }} />
          ))}
        </span>
        <span className="axv-label">Conversation in progress</span>
      </div>

      <div className="axv-expanded" data-testid="voice-disclosure-expanded">
        <p className="axv-line axv-line--human">
          <span className="axv-speaker">Customer</span>
          “I need to change the delivery address.”
        </p>
        <p className="axv-line axv-line--engine">
          <span className="axv-speaker">Alter Engine</span>
          “I can prepare that change. I’ll need your confirmation first.”
        </p>
        <div className="axv-approval">
          <ShieldCheck size={13} aria-hidden="true" />
          Approval required
        </div>
      </div>
    </button>
  );
}
