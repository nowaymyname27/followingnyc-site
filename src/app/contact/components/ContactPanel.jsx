// app/contact/components/ContactPanel.jsx
"use client";

import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("../ContactForm"), { ssr: false });
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "YOUR_FORM_ID";

export default function ContactPanel() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
      <h2 className="text-2xl font-semibold mb-6">Contact Me</h2>

      {FORMSPREE_ID === "YOUR_FORM_ID" && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
          Set <code>NEXT_PUBLIC_FORMSPREE_ID</code> in your env or replace{" "}
          <code>YOUR_FORM_ID</code>.
        </div>
      )}

      <ContactForm />
    </section>
  );
}
