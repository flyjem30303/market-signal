"use client";

import { trackEvent } from "@/lib/tracking";

type CommercialSlotProps = {
  context: "briefing" | "stock" | "weekly";
};

export function CommercialSlot({ context }: CommercialSlotProps) {
  const copy =
    context === "stock"
      ? "會員功能未來可提供更完整的標的追蹤、警示條件與盤後複盤，但不會提供個股買賣建議。"
      : context === "briefing"
        ? "會員專區未來會延伸市場三層解讀、watchlist 與盤後複盤，協助使用者建立固定觀察流程。"
        : "週報內容未來可作為會員深度回看素材，協助追蹤燈號變化與市場脈絡。";

  return (
    <aside className="commercial-slot" aria-label="會員與揭露說明">
      <p className="eyebrow">Disclosure</p>
      <h2>會員內容預告</h2>
      <p>{copy}</p>
      <p>目前公開 Beta 仍以免費市場總覽為主；所有內容都是資訊整理與風險辨識，不是投資建議。</p>
      <nav aria-label="信任與揭露連結">
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
          服務條款
        </a>
        <a
          href="/privacy"
          onClick={() => trackEvent("commercial_disclosure_link_clicked", { context, href: "/privacy", label: "privacy" })}
        >
          隱私權政策
        </a>
      </nav>
    </aside>
  );
}
