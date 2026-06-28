import type { Metadata } from "next";

import { EnglishCorePage } from "../english-core-page";
import { SECONDARY_LOCALE } from "@/lib/i18n/config";
import { buildI18nAlternates } from "@/lib/i18n/metadata";

export const metadata: Metadata = {
  alternates: buildI18nAlternates("weekly", SECONDARY_LOCALE),
  description:
    "Weekly Market Signal context summarizes how the Taiwan market signal and risk posture changed during the week.",
  title: "Weekly Market Review"
};

export default function EnglishWeeklyPage() {
  return (
    <EnglishCorePage
      eyebrow="Weekly"
      primaryHref="/weekly"
      primaryLabel="Open weekly review"
      secondaryHref="/en/markets"
      secondaryLabel="Choose a market"
      summary="The weekly review is designed to answer what changed this week: signal movement, risk movement, supporting factors, drag factors, and next reading priorities."
      title="Weekly Market Review"
    >
      <section className="legal-quick-read" aria-label="Weekly review summary">
        <article>
          <span>Change</span>
          <strong>Week-over-week reading</strong>
          <p>Weekly context should focus on change, not repeat the daily overview.</p>
        </article>
        <article>
          <span>Drivers</span>
          <strong>Support and drag factors</strong>
          <p>The review highlights the main evidence-backed factors that moved the signal or risk posture.</p>
        </article>
        <article>
          <span>Use</span>
          <strong>Prepare the next reading</strong>
          <p>Use the weekly review as a broader context layer before returning to the daily market or target pages.</p>
        </article>
      </section>
    </EnglishCorePage>
  );
}
