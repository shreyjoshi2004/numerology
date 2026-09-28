import AnkKundaliCalculator from "@/components/AnkKundaliCalculator";
import { StudioPage, StudioPageHeader } from "@/components/StudioPage";

export const metadata = {
  title: "Ank Kundali — Numerology",
  description: "Generate a Vedic grid Ank Kundali chart from a date of birth, with Moolank, Bhagyank, zodiac, and latent number placement.",
};

export default function AnkKundaliPage() {
  return (
    <StudioPage>
      <StudioPageHeader eyebrow="Calculate" title="Ank Kundali" />
      <div className="bg-white border border-[var(--color-rule)] rounded-2xl p-4 sm:p-6 lg:p-7 max-w-3xl">
        <AnkKundaliCalculator />
      </div>
    </StudioPage>
  );
}
