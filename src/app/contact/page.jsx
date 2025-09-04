// app/contact/page.jsx
"use client";
import NavBarLight from "@/components/NavBarLight";
import dynamic from "next/dynamic";

const ContactForm = dynamic(() => import("./ContactForm"), { ssr: false });
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "YOUR_FORM_ID";
const FORMSPREE_ACTION = `https://formspree.io/f/${FORMSPREE_ID}`;

export default function ContactPage() {
  return (
    <>
      {/* Top shim */}
      <div className="fixed inset-x-0 top-0 h-6 bg-opacity-100 z-30" />
      <NavBarLight />

      {/* Background wrapper */}
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/contact-bg.jpg')" }}
      >
        {/* Optional overlay */}
        <div className="absolute inset-0 bg-white/40" />

        {/* Page content */}
        <div className="relative pt-24">
          <div className="mx-auto max-w-5xl w-full px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* About Me in a white box */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
              <h1 className="text-3xl font-bold tracking-tight mb-4">
                Following NYC
              </h1>
              <p className="leading-relaxed mb-5 text-stone-800">
                Since 2011, I’ve been documenting Manhattan through street
                photography, iconic parades, and portraits of models during
                NYFW. My most extensive archive on Pexels has surpassed 1.3
                million views and 2,000 downloads, with highlights including a
                Burning Man photo (8.9M views) and iconic landmarks like the
                Statue of Liberty and Times Square, each downloaded over 1,000
                times.
              </p>
              <p className="leading-relaxed text-stone-800">
                My work has been featured in BBC, MSN, Cambridge, Wikipedia,
                Quartz, Bustle, and CNET. In 2025, I begin a new chapter with
                the launch of my state-of-the-art website, integrating AI
                technology and showcasing my complete collections from 2011. The
                site will highlight my unique style of intervened photography,
                blending models, the city, and graphic text into bold visual
                compositions.
              </p>
            </section>

            {/* Contact Form */}
            <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
              <h2 className="text-2xl font-semibold mb-6">Contact Me</h2>

              {FORMSPREE_ID === "YOUR_FORM_ID" && (
                <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
                  Set <code>NEXT_PUBLIC_FORMSPREE_ID</code> in your env or
                  replace <code>YOUR_FORM_ID</code> in this file.
                </div>
              )}
              <ContactForm />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
