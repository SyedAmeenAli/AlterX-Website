import React from "react";
import { ArrowRight } from "lucide-react";
import { BUSINESS, SOCIALS } from "@/content/navigation";
import "./ContactMap.css";

const instagram = SOCIALS.find((s) => s.key === "Instagram" && s.url);

/* Full-width location section, added immediately after the existing
   contact form + details grid — smallest change to the current page,
   no rebuild of the form/aside above it. */
export default function ContactMap() {
  return (
    <section className="pb-28" style={{ background: "rgba(249,249,249,0.65)" }} data-testid="contact-map-section">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <p className="ax-eyebrow text-black/50 text-[10px]">Location</p>
          {instagram && (
            <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold text-[#c9360a] hover:text-[#ff4d0a] inline-flex items-center gap-1.5" data-testid="contact-instagram-link">
              Instagram <ArrowRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="contact-map">
          <iframe
            className="contact-map__iframe"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.512079233366!2d78.39085544976031!3d17.405642879684105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97d79e3fd579%3A0x4679a5449b8f238c!2sAsset%20Infra!5e0!3m2!1sen!2sin!4v1786340800630!5m2!1sen!2sin"
            title="AlterX location map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <p className="mt-4 text-[13px] text-black/50">{BUSINESS.address}</p>
      </div>
    </section>
  );
}
