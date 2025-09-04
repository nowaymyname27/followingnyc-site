// app/contact/ContactForm.jsx
"use client";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "YOUR_FORM_ID";
const FORMSPREE_ACTION = `https://formspree.io/f/${FORMSPREE_ID}`;

export default function ContactForm() {
  return (
    <>
      {FORMSPREE_ID === "YOUR_FORM_ID" && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
          Set <code>NEXT_PUBLIC_FORMSPREE_ID</code> in your env or replace
          <code> YOUR_FORM_ID</code> in this file.
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
    </>
  );
}
