import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import { Reveal, MaskLines } from "@/lib/anim";
import { Eyebrow } from "@/components/kit";
import "./AlterEngineFAQ.css";

/* AlterEngineFAQ — editorial accordion, one open at a time. Approved
   Alter Engine FAQ copy only, no invented integrations/uptime/API claims. */

const FAQS = [
  {
    q: "Is Alter Engine a chatbot?",
    a: "No. Alter Engine is designed for work that continues beyond an answer. It starts with an objective, structures the work into a visible plan, carries out approved steps and checks what comes back.",
  },
  {
    q: "Does Alter Engine act without approval?",
    a: "Not where the workflow requires a person to decide. Important actions can pause for review, and the relevant person can approve, revise or stop the work before it continues.",
  },
  {
    q: "Can Alter Engine work with our existing systems?",
    a: "Alter Engine is designed to work around approved systems, tools and permissions. The exact connections and authority available depend on the workflow and the access that has been approved.",
  },
  {
    q: "What happens when a step fails?",
    a: "A failed step does not need to disappear into a generic error. Depending on the workflow, the work can retry, revise the plan, request more information, escalate for review or stop.",
  },
  {
    q: "Can we inspect what Alter Engine did?",
    a: "The product is designed to keep the path of the work visible. Plans, important decisions, execution states, checks and supporting evidence can remain available for review.",
  },
  {
    q: "How is access provided?",
    a: "Access is reviewed around the outcome or workflow being evaluated. Tell AlterX what needs to be completed, which systems are involved and where people need to remain in control.",
  },
  {
    q: "Is there a public API?",
    a: "Developer access is managed around the product or internal system being built.",
    cta: { label: "Request developer access", to: "/contact" },
  },
  {
    q: "What kinds of work are suitable for Alter Engine?",
    a: "Alter Engine is most relevant to multi-step work that crosses systems, people or decisions and where progress, authority and the final result need to remain visible.",
  },
];

export default function AlterEngineFAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section id="faq" className="text-[#f9f9f9] py-24 md:py-32 relative" style={{ background: "#090909", scrollMarginTop: "calc(var(--header-height) + 24px)" }} data-testid="engine-faq">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[34%_1fr] gap-12 lg:gap-16">
        <div>
          <Reveal><Eyebrow dark className="mb-6">FAQ</Eyebrow></Reveal>
          <MaskLines as="h2" lines={["Questions before", "you start."]} className="ax-display text-4xl md:text-[52px] leading-[0.98]" />
          <Reveal delay={0.12}>
            <p className="mt-6 text-white/60 max-w-sm">Clear answers about how Alter Engine plans, acts, pauses and returns results.</p>
          </Reveal>
        </div>

        <div className="ax-faq-list">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="ax-faq-row" data-open={isOpen}>
                <button
                  type="button"
                  className="ax-faq-question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  data-testid={`faq-question-${i}`}
                >
                  <span className="ax-faq-rule" aria-hidden="true" />
                  <span className="ax-faq-question-text">{item.q}</span>
                  <Plus size={18} className="ax-faq-plus" aria-hidden="true" />
                </button>
                <div className="ax-faq-answer-wrap" id={`faq-answer-${i}`}>
                  <div className="ax-faq-answer-inner">
                    <p className="ax-faq-answer">{item.a}</p>
                    {item.cta && (
                      <Link to={item.cta.to} className="ax-faq-cta">
                        {item.cta.label} <ArrowRight size={13} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
