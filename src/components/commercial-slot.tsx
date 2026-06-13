"use client";

import { trackEvent } from "@/lib/tracking";

type CommercialSlotProps = {
  context: "briefing" | "stock" | "weekly";
};

export function CommercialSlot({ context }: CommercialSlotProps) {
  const copy =
    context === "stock"
      ? "下一階段會員功能會提供更完整的標的追蹤、警示條件與盤後複盤，但目前仍以公開示範頁為主。"
      : context === "briefing"
        ? "會員功能將協助使用者追蹤每日市場三層解讀、watchlist 與盤後複盤。"
        : "會員週報可延伸更多歷史回看與情境式風險解讀。";

  return (
    <aside className="commercial-slot" aria-label="會員功能與風險揭露">
      <p className="eyebrow">Disclosure</p>
      <h2>會員功能預覽</h2>
      <p>{copy}</p>
      <p>公開 Beta 階段不開放會員登入、付費或個人化警示；所有內容仍是資訊整理，不提供個股買賣建議。</p>
      <nav aria-label="信任與條款連結">
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
          隱私說明
        </a>
      </nav>
    </aside>
  );
}
