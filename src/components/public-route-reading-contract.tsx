type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    title: "如何閱讀風險聲明",
    body: "本頁說明網站內容的限制：燈號是資訊整理與觀察輔助，不是投資建議。",
    next: "讀完後可回到方法說明，了解燈號如何形成。"
  },
  methodology: {
    title: "如何閱讀方法說明",
    body: "本頁說明燈號如何把趨勢、風險與資料品質整理成可理解的狀態。",
    next: "讀完後可回首頁或市場快報，將方法套用到實際頁面。"
  },
  privacy: {
    title: "如何閱讀隱私政策",
    body: "本頁說明目前公開版如何處理基礎互動資料，以及未來會員功能需要另行揭露的項目。",
    next: "讀完後可搭配使用條款一起確認服務邊界。"
  },
  terms: {
    title: "如何閱讀使用條款",
    body: "本頁說明使用者與網站之間的基本責任，尤其是資料延遲、資訊用途與風險判斷邊界。",
    next: "讀完後可查看風險聲明，確認本網站不提供買賣建議。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], { body: string; next: string; title: string }>;

const steps = [
  ["先看定位", "確認本網站是市場資訊整理與風險辨識工具。"],
  ["再看限制", "確認資料可能延遲、覆蓋率仍在補齊，且不保證即時完整。"],
  ["最後看行動", "把燈號當作觀察起點，而不是直接交易指令。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="頁面閱讀說明">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">閱讀說明</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <p>{item.next}</p>
      </div>
      <div className="public-route-reading-contract__steps" aria-label="閱讀步驟">
        {steps.map(([title, body]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
