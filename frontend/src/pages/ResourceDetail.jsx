import React from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, FillLink } from "@/components/kit";
import { RESOURCES } from "@/content/home";
import { usePageMeta } from "@/lib/anim";

const BODIES = {
  "designing-human-checkpoints": {
    capability: "Human approval in Alter Engine",
    next: { label: "See an approval in the demo", to: "/try-alter-engine" },
    paras: [
      "Automation fails quietly in two directions. Either it asks a person to confirm everything — and the person stops reading — or it asks for nothing and makes a decision it had no authority to make. A checkpoint is not a popup; it is a designed transfer of authority.",
      "A good checkpoint answers five questions before it asks for a signature: what action is proposed, which system it touches, why the system believes it is right, what the scope and risk are, and how it can be undone. If the person has to open three other tools to answer those questions, the checkpoint has failed.",
      "The second design decision is placement. Checkpoints belong where authority genuinely matters — spend, external commitments, access grants, irreversible changes — not on every step. Alter Engine treats the approval point as part of the plan, visible before anything runs, so nobody is surprised by where the work pauses.",
      "Finally, a checkpoint should leave a trail. The decision, the person, the moment and the reasoning belong in the mission record. That is the difference between an approval and a click.",
    ],
  },
  "evidence-by-design": {
    capability: "Evidence and mission trail",
    next: { label: "Export evidence in the demo", to: "/try-alter-engine" },
    paras: [
      "Most systems can tell you what happened. Very few can show you why it was allowed to happen. Evidence by design means the trail is produced by the work itself — not reconstructed afterwards from logs and memory.",
      "In a mission, every meaningful object leaves a mark: the objective as it was stated, the plan as it was approved, each decision with its owner, each artifact with its producing step, each check with its result. Nothing needs to be remembered because nothing was ever unrecorded.",
      "The practical test is simple: could a person who was not there review the outcome and understand it without interviewing anyone? If the answer is yes, the system has evidence. If the answer is 'ask the person who ran it', the system has folklore.",
      "Evidence also changes behaviour upstream. When teams know that decisions carry their reasoning forward, the reasoning improves. The trail is not surveillance — it is the memory of the work.",
    ],
  },
  "a-mission-is-not-just-a-workflow": {
    capability: "The mission model",
    next: { label: "Read the mission model", to: "/developers" },
    paras: [
      "A workflow repeats steps. A mission pursues an outcome. The difference sounds semantic until something goes wrong — which, in real work, is exactly when the difference matters.",
      "A workflow that hits a missing input stops or repeats. A mission classifies the failure, weighs the alternatives, and can change route while keeping the objective fixed. The steps are a means; the outcome is the contract.",
      "This is also why missions can be judged. A workflow succeeds when its steps ran. A mission succeeds when the result satisfies the success criteria that were stated before the work began. Those criteria — not the steps — are what the final check is measured against.",
      "Workflows still matter: a mission that worked is worth repeating, and saving it as a workflow preserves its structure and approval points. But the workflow serves the mission, never the reverse.",
    ],
  },
  "from-demo-to-governed-system": {
    capability: "Governance in Alter Engine",
    next: { label: "Explore security", to: "/security" },
    paras: [
      "Every AI demonstration is impressive, because demonstrations are allowed to fail privately. A governed system is different: it has to survive an audit, a handover, a bad week and a sceptical reviewer.",
      "The gap between the two is rarely intelligence. It is accountability: who authorised the action, what scope it ran within, what evidence it left, and what happened when a step failed. A demo answers none of these; a governed system answers all of them by construction.",
      "Moving from demo to system means adding boundaries before adding features: identity, workspace separation, permissioned connections, approval points and retention rules. It is slower. It is also the only version that a serious business can run twice.",
      "The uncomfortable truth: if a system cannot show its work, it does not matter how good the work was. Governance is what makes intelligence usable.",
    ],
  },
  "one-connected-record": {
    capability: "Cognitive AI",
    next: { label: "Explore Cognitive AI", to: "/cognitive-ai" },
    paras: [
      "Inventory problems are rarely inventory problems. They are record problems: the catalogue says one thing, the shelf says another, the campaign was planned against a third, and every team trusts its own copy.",
      "Disconnected tools create disconnected decisions. A markdown decided without movement history, a campaign planned without stock truth, a reorder placed without location context — each locally reasonable, collectively expensive.",
      "One connected record means product information, stock activity, locations and campaign operations answer to the same truth. Attention signals rise from the record itself: what stopped moving, what conflicts, what needs a person.",
      "The record does not replace judgment. It makes judgment possible — because the person deciding finally sees the same inventory the business actually has.",
    ],
  },
  "image-based-capture": {
    capability: "Cognitive AI capture",
    next: { label: "See the capture flow", to: "/cognitive-ai" },
    paras: [
      "The most expensive field in any catalogue is the one a person typed for the four-hundredth time. Repetitive entry is not just slow — it is where errors are manufactured.",
      "Image-based capture inverts the flow: the product photo arrives first, and the structured record — name, colour, material, category, type, proposed SKU — is extracted as a proposal. The person's job changes from typing to confirming.",
      "Confirmation is the important part. Extraction can be wrong, and a wrong record entered confidently is worse than no record. In Cognitive AI, nothing enters the catalogue until a person has reviewed the proposal — the human checkpoint is the design, not a fallback.",
      "The result is a catalogue built at the speed of a camera with the accuracy of a reviewer — and an entry process people no longer avoid.",
    ],
  },
  "understanding-stagnant-stock": {
    capability: "Attention signals in Cognitive AI",
    next: { label: "Run the stagnant inventory demo", to: "/try-alter-engine/new?objective=Review stagnant inventory and propose actions" },
    paras: [
      "Stagnant stock is quiet. It does not break anything, it does not page anyone — it just sits, tying up cash and space while newer stock moves around it.",
      "Seeing it requires a definition, and the definition is a business decision: sixty days without movement? Ninety? Seasonal exceptions? The threshold belongs to the operator, not the software — but once agreed, the record can watch it continuously.",
      "The second step is ranking by value at risk. Twelve stagnant items are not equal: one group might hold most of the trapped value. Attention should follow money, not item counts.",
      "The final step is proposing actions — markdown, bundle, relocate, hold — with the pricing changes paused for approval. The system surfaces and proposes; the person decides. That is what makes the review repeatable instead of heroic.",
    ],
  },
  "campaigns-to-inventory": {
    capability: "Campaign connection in Cognitive AI",
    next: { label: "Explore Cognitive AI", to: "/cognitive-ai" },
    paras: [
      "Campaigns are promises about inventory. A promotion promises stock exists; a launch promises it will arrive; a clearance promises it should leave. When campaign tools cannot see inventory truth, those promises are guesses.",
      "The failure modes are familiar: the hero product that sold out on day two, the clearance that discounted stock which was already moving, the campaign planned against a catalogue that no longer matched the shelf.",
      "Connecting campaigns to the inventory record means campaign decisions inherit stock truth automatically — what exists, where it is, how it is moving — and inventory decisions can see what campaigns are about to demand.",
      "The connection also works backwards: campaign results become inventory evidence. What the promotion actually moved feeds the next stagnant-stock review. The loop closes.",
    ],
  },
};

export default function ResourceDetail() {
  const { slug } = useParams();
  const r = RESOURCES.find((e) => e.slug === slug);
  const body = BODIES[slug];
  usePageMeta(r ? r.title : "Resource", r ? r.value : "");
  if (!r || !body) return <Navigate to="/resources" replace />;
  return (
    <>
      <PageHero eyebrow={`${r.type} · ${r.read} read`} title={r.title} body={r.value} />
      <section className="bg-[#fbfaf7] pb-28">
        <div className="max-w-[860px] mx-auto px-6 md:px-10">
          <article className="space-y-6" data-testid="resource-body">
            {body.paras.map((p, i) => (
              <p key={i} className={`text-[17px] leading-relaxed text-black/75 ${i === 0 ? "text-[19px] font-medium text-black/85" : ""}`}>{p}</p>
            ))}
          </article>
          <div className="mt-14 border border-black/15 bg-[#f3f0e9] p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="ax-eyebrow text-black/50 text-[10px] mb-1.5">Related capability</p>
              <p className="font-bold text-[17px]">{body.capability}</p>
            </div>
            <Link to={body.next.to} className="btn-primary shrink-0" data-testid="resource-next-cta">
              {body.next.label} <ArrowRight size={14} className="ax-arrow" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-8"><FillLink to="/resources">All resources</FillLink></div>
        </div>
      </section>
    </>
  );
}
