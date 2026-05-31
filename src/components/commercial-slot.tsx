type CommercialSlotProps = {
  context: "briefing" | "stock" | "weekly";
};

export function CommercialSlot({ context }: CommercialSlotProps) {
  const copy =
    context === "stock"
      ? "未來此區可放置券商開戶、投資工具或資料服務合作，但不得影響本頁模型分數。"
      : context === "briefing"
        ? "未來此區可放置晨報贊助、投資工具或資料服務合作，但不得被包裝成今日買賣指令。"
        : "未來此區可放置週報贊助、投資工具或理財書籍合作，但需清楚標示商業合作。";

  return (
    <aside className="commercial-slot" aria-label="商業合作揭露">
      <p className="eyebrow">Sponsored Disclosure</p>
      <h2>商業合作預留區</h2>
      <p>{copy}</p>
      <p>若使用者透過合作連結註冊、購買或開戶，本網站可能取得廣告收入或佣金。</p>
      <nav aria-label="商業合作相關說明">
        <a href="/disclaimer">查看免責聲明</a>
        <a href="/terms">查看使用條款</a>
      </nav>
    </aside>
  );
}
