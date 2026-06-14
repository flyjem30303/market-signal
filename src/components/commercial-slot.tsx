"use client";

import { trackEvent } from "@/lib/tracking";

type CommercialSlotProps = {
  context: "briefing" | "stock" | "weekly";
};

export function CommercialSlot({ context }: CommercialSlotProps) {
  const copy =
    context === "stock"
      ? "後續會員功能會提供更完整的標的追蹤、燈號原因與盤後複盤，目前公開版先提供基礎觀察。"
      : context === "briefing"
        ? "會員內容將延伸市場三層解讀、watchlist 與個人化提醒，公開版仍保留核心市場總覽。"
        : "週報會員版會補上盤後複盤與觀察清單，目前先以公開摘要協助快速理解市場。";

  return (
    <aside className="commercial-slot" aria-label="會員內容預告">
      <p className="eyebrow">Disclosure</p>
      <h2>會員內容預告</h2>
      <p>{copy}</p>
      <p>指數燈號網站不提供投資建議或保證報酬；會員內容也會維持資訊整理、風險辨識與觀察輔助定位。</p>
      <nav aria-label="揭露與條款">
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
