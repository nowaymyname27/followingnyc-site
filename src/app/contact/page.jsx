// app/contact/page.jsx
"use client";

import NavBarLight from "@/components/NavBarLight";
import TopShim from "./components/TopShim";
import BackgroundWrapper from "./components/BackgroundWrapper";
import AboutFollowingNYC from "./components/AboutFollowingNYC";
import ContactPanel from "./components/ContactPanel";

export default function ContactPage() {
  return (
    <>
      <TopShim />
      <NavBarLight />

      <BackgroundWrapper
        image="/contact-bg.jpg"
        overlayClass="bg-white/40"
        className="pt-24"
      >
        <div className="mx-auto max-w-5xl w-full px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <AboutFollowingNYC />
          <ContactPanel />
        </div>
      </BackgroundWrapper>
    </>
  );
}
