// app/contact/page.jsx
import NavBarLight from "@/components/NavBarLight";

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
                Juan Carlos Ramírez — Following NYC
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

              <form
                action={FORMSPREE_ACTION}
                method="POST"
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2 shadow-sm focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                  />
                </div>

                <input
                  type="hidden"
                  name="_subject"
                  value="New message from your website"
                />
                <div className="hidden">
                  <label htmlFor="_gotcha">Leave this empty</label>
                  <input
                    id="_gotcha"
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-neutral-900 text-white px-4 py-2 font-medium shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                  Send Message
                </button>

                <p className="text-xs text-neutral-500">
                  By submitting, you agree to be contacted about your message.
                </p>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
