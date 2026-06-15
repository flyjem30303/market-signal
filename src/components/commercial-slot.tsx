"use client";

import { trackEvent } from "@/lib/tracking";

type CommercialSlotProps = {
  context: "briefing" | "stock" | "weekly";
};

export function CommercialSlot({ context }: CommercialSlotProps) {
  const copy =
    context === "stock"
      ? "本頁先提供標的燈號、分數與資料狀態，協助你把單一標的放回市場脈絡。"
      : context === "briefing"
        ? "快報先協助你快速理解市場氣氛、風險來源與下一步觀察順序。"
        : "週報先協助你回看一段時間的市場變化，整理下週可追蹤的觀察重點。";

  return (
    <aside className="commercial-slot" aria-label="公開版使用提醒">
      <p className="eyebrow">公開版提醒</p>
      <h2>先看懂市場，再決定是否深入追蹤</h2>
      <p>{copy}</p>
      <p>目前公開版不提供投資建議、保證報酬或個人化交易判斷；正式資料上線前仍維持示範模式。</p>
      <nav aria-label="信任與風險連結">
        <a
          href="/disclaimer"
          onClick={() => trackEvent("commercial_disclosure_link_clicked", { context, href: "/disclaimer", label: "disclaimer" })}
        >
          風險聲明
        </a>
        <a
          href="/terms"
          onClick={() => trackEvent("commercial_disclosure_link_clicked", { context, href: "/terms", label: "terms" })}
        >
          使用條款
        </a>
        <a
          href="/privacy"
          onClick={() => trackEvent("commercial_disclosure_link_clicked", { context, href: "/privacy", label: "privacy" })}
        >
          隱私政策
        </a>
      </nav>
    </aside>
  );
}
