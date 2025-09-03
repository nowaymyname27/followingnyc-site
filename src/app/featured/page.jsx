// app/news/page.jsx
import NavBarLight from "@/components/NavBarLight";
import FeaturedSection from "./FeaturedSection";
import TestimonialsSection from "./TestimonialsSection";

export const revalidate = 900;

export default function FeaturedPage() {
  return (
    <>
      <div className="fixed inset-x-0 top-0 h-6 bg-background z-30" />
      <NavBarLight />
      <main className="pt-24 min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
          <FeaturedSection />
          <TestimonialsSection />
        </div>
      </main>
    </>
  );
}
