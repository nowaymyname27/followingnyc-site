// app/contact/page.jsx
import NavBarLight from "@/components/NavBarLight";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "YOUR_FORM_ID";
const FORMSPREE_ACTION = `https://formspree.io/f/${FORMSPREE_ID}`;

export default function ContactPage() {
  return (
    <>
      {/* Top shim to match your global pattern */}
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />
      <NavBarLight />

      {/* Content padded to clear fixed nav */}
      <div className="pt-24 min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl w-full px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* About Me */}
          <section className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold tracking-tight mb-4">About Me</h1>
            <p className="leading-relaxed mb-4 text-stone-700">
              Hello! I'm a passionate developer and designer who loves building
              clean, functional, and visually appealing web experiences. With a
              background in modern frontend frameworks and backend technologies,
              I enjoy turning ideas into interactive products.
            </p>
            <p className="leading-relaxed text-stone-700">
              Outside of coding, I’m deeply interested in photography, writing,
              and exploring creative projects. Feel free to reach out if you'd
              like to collaborate or just chat!
            </p>
          </section>

          {/* Contact Form (Formspree) */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold mb-6">Contact Me</h2>

            {/* If FORMSPREE_ID isn't set, show a small warning (rendered server-side) */}
            {FORMSPREE_ID === "YOUR_FORM_ID" && (
              <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
                Set <code>NEXT_PUBLIC_FORMSPREE_ID</code> in your env or replace{" "}
                <code>YOUR_FORM_ID</code> in this file.
              </div>
            )}

            <form action={FORMSPREE_ACTION} method="POST" className="space-y-4">
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

              {/* Optional: subject & honeypot */}
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

              {/* Optional: redirect after submit (set your own thank-you page) */}
              {/* <input type="hidden" name="_next" value="https://yourdomain.com/thanks" /> */}

              <button
                type="submit"
                className="w-full rounded-md bg-neutral-900 text-white px-4 py-2 font-medium shadow hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              >
                Send Message
              </button>

              <p className="text-xs text-neutral-500">
                This form is powered by Formspree. By submitting, you agree to
                be contacted about your message.
              </p>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}
