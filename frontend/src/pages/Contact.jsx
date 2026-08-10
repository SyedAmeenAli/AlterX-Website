import React, { useState } from "react";
import { Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import { PageHero } from "@/components/kit";
import { BUSINESS } from "@/content/navigation";
import { usePageMeta } from "@/lib/anim";
import ContactMap from "@/components/ContactMap";

const ENDPOINT = process.env.REACT_APP_CONTACT_ENDPOINT;

const FIELDS = [
  { k: "name", label: "Name", type: "text", required: true },
  { k: "email", label: "Work email", type: "email", required: true },
  { k: "company", label: "Company", type: "text", required: true },
  { k: "role", label: "Role", type: "text", required: true },
  { k: "outcome", label: "What outcome are you trying to achieve?", type: "textarea", required: true },
  { k: "blocker", label: "What prevents it today?", type: "textarea", required: true },
  { k: "systems", label: "Systems involved (optional)", type: "text" },
  { k: "timeframe", label: "Timeframe (optional)", type: "text" },
  { k: "country", label: "Country or region", type: "text", required: true },
];

export default function Contact() {
  usePageMeta("Contact", "Tell AlterX what needs to change, which systems are involved and where human judgment belongs.");
  const [values, setValues] = useState({});
  const [consent, setConsent] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const validate = () => {
    const errs = [];
    for (const f of FIELDS) {
      if (f.required && !(values[f.k] || "").trim()) errs.push(`${f.label} is required.`);
    }
    if (values.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errs.push("Work email must be a valid email address.");
    if (!consent) errs.push("Privacy consent is required to continue.");
    return errs;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (errs.length) { setStatus(null); return; }
    if (ENDPOINT) {
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, updatesConsent: updates }),
        });
        if (!res.ok) throw new Error("bad status");
        setStatus("sent");
      } catch {
        setStatus("error");
      }
    } else {
      setStatus("email-fallback");
    }
  };

  const mailtoHref = () => {
    const subject = `AlterX enquiry — ${values.company || "[Company]"} — ${(values.outcome || "[Outcome]").slice(0, 60)}`;
    const body = FIELDS.map((f) => `${f.label}: ${values[f.k] || ""}`).join("\n") + `\nOptional updates consent: ${updates ? "yes" : "no"}`;
    return `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Bring us the outcome."
        body="Tell AlterX what needs to change, which systems are involved and where human judgment belongs."
      />
      <section className="pb-28" style={{ background: "rgba(249,249,249,0.65)" }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-[1fr_380px] gap-14">
          <form onSubmit={submit} noValidate className="max-w-2xl" data-testid="contact-form">
            {errors.length > 0 && (
              <div role="alert" className="border border-[#c9360a] bg-[#c9360a]/5 p-4 mb-8" data-testid="contact-error-summary">
                <p className="flex items-center gap-2 font-bold text-[#c9360a] text-[14px] mb-2"><AlertCircle size={15} aria-hidden="true" /> Please fix the following</p>
                <ul className="list-disc pl-5 text-[13px] text-black/70 space-y-1">
                  {errors.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6">
              {FIELDS.map((f) => (
                <div key={f.k} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <label htmlFor={`c-${f.k}`} className="block text-[13px] font-bold mb-1.5">{f.label}{f.required && <span className="text-[#c9360a]"> *</span>}</label>
                  {f.type === "textarea" ? (
                    <textarea id={`c-${f.k}`} rows={3} value={values[f.k] || ""} onChange={(e) => set(f.k, e.target.value)} className="w-full border border-black/20 bg-white px-4 py-3 text-[15px] focus:border-[#ff4d0a] focus:outline-none" data-testid={`contact-field-${f.k}`} />
                  ) : (
                    <input id={`c-${f.k}`} type={f.type} value={values[f.k] || ""} onChange={(e) => set(f.k, e.target.value)} className="w-full border border-black/20 bg-white px-4 py-3 text-[15px] focus:border-[#ff4d0a] focus:outline-none" data-testid={`contact-field-${f.k}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              <label className="flex items-start gap-3 text-[14px] text-black/70 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-[#ff4d0a]" data-testid="contact-consent" />
                I consent to AlterX processing this enquiry in line with the Privacy Policy. <span className="text-[#c9360a]">*</span>
              </label>
              <label className="flex items-start gap-3 text-[14px] text-black/70 cursor-pointer">
                <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} className="mt-1 accent-[#ff4d0a]" data-testid="contact-updates" />
                Optionally, keep me informed about AlterX product updates.
              </label>
            </div>
            <button type="submit" className="btn-primary mt-8" data-testid="contact-submit">Continue</button>

            {status === "sent" && (
              <p className="mt-6 border border-black/20 bg-[#f3f0e9] p-4 text-[14px]" role="status" data-testid="contact-success">Your enquiry has been submitted. AlterX will reply from {BUSINESS.email}.</p>
            )}
            {status === "error" && (
              <p className="mt-6 border border-[#c9360a] p-4 text-[14px] text-[#c9360a]" role="alert" data-testid="contact-endpoint-error">The submission endpoint did not accept the request. Please use the email option: <a className="underline font-bold" href={mailtoHref()}>open a prefilled email</a>.</p>
            )}
            {status === "email-fallback" && (
              <div className="mt-6 border border-black/20 bg-[#f3f0e9] p-5" role="status" data-testid="contact-email-fallback">
                <p className="font-bold text-[15px] mb-1">Continue by email</p>
                <p className="text-[14px] text-black/65 mb-4">Your details have not been submitted to a server. Open a prefilled email to AlterX to continue your enquiry.</p>
                <a href={mailtoHref()} className="btn-primary !py-2.5" data-testid="contact-mailto-btn">Open prefilled email</a>
              </div>
            )}
          </form>

          <aside className="space-y-6 lg:pt-2">
            <div className="border border-black/15 bg-[#f3f0e9] p-6">
              <p className="ax-eyebrow text-black/50 mb-4 text-[10px]">AlterX</p>
              <p className="flex items-start gap-3 text-[14px] mb-3"><MapPin size={15} className="mt-0.5 shrink-0 text-[#c9360a]" aria-hidden="true" />{BUSINESS.address}</p>
              <p className="flex items-center gap-3 text-[14px] mb-1.5"><Mail size={15} className="shrink-0 text-[#c9360a]" aria-hidden="true" /><a href={`mailto:${BUSINESS.email}`} className="font-semibold hover:text-[#c9360a]">{BUSINESS.email}</a></p>
              <p className="flex items-center gap-3 text-[14px]"><Phone size={15} className="shrink-0 text-[#c9360a]" aria-hidden="true" />{BUSINESS.phone1} · {BUSINESS.phone2}</p>
            </div>
            <p className="text-[13px] text-black/50">AlterX never silently subscribes a contact to marketing. Updates are sent only when the optional consent box is ticked.</p>
          </aside>
        </div>
      </section>
      <ContactMap />
    </>
  );
}
