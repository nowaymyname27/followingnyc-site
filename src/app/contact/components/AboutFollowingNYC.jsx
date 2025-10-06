// app/contact/components/AboutFollowingNYC.jsx
import { SiInstagram } from "react-icons/si";

export default function AboutFollowingNYC() {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Following NYC</h1>
      <p className="leading-relaxed mb-5 text-stone-800">
        Since 2011, I’ve been documenting Manhattan through street photography,
        iconic parades, and portraits of models during NYFW. My most extensive
        archive on Pexels has surpassed 1.3 million views and 2,000 downloads,
        with highlights including a Burning Man photo (8.9M views) and iconic
        landmarks like the Statue of Liberty and Times Square, each downloaded
        over 1,000 times.
      </p>
      <p className="leading-relaxed text-stone-800 mb-6">
        My work has been featured in BBC, MSN, Cambridge, Wikipedia, Quartz,
        Bustle, and CNET. In 2025, I begin a new chapter with the launch of my
        state-of-the-art website, integrating AI technology and showcasing my
        complete collections from 2011. The site will highlight my unique style
        of intervened photography, blending models, the city, and graphic text
        into bold visual compositions.
      </p>

      {/* Instagram Link */}
      <a
        href="https://instagram.com/followingnyc"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors"
      >
        <SiInstagram size={22} />
      </a>
    </section>
  );
}
