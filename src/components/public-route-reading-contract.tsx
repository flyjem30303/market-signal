type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    title: "如何閱讀風險聲明",
    body: "這一頁說明網站能做什麼、不能做什麼，以及使用者在解讀燈號時應保留哪些判斷空間。",
    next: "讀完後可回到首頁看市場狀態，再到方法頁確認燈號成因。"
  },
  methodology: {
    title: "如何閱讀方法說明",
    body: "這一頁說明燈號如何由趨勢、風險、資料品質與市場廣度組成，幫助使用者理解分數背後的原因。",
    next: "讀完後可回到市場總覽，對照燈號、原因與資料更新時間。"
  },
  privacy: {
    title: "如何閱讀隱私說明",
    body: "這一頁說明網站目前蒐集的互動資料與使用邊界，協助使用者理解追蹤事件的用途。",
    next: "讀完後可回到首頁或條款頁，確認使用資料與服務邊界。"
  },
  terms: {
    title: "如何閱讀服務條款",
    body: "這一頁說明網站定位、使用限制、資料延遲與非投資建議邊界，避免使用者誤解服務用途。",
    next: "讀完後可回到風險聲明，確認燈號只作為觀察輔助。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], { body: string; next: string; title: string }>;

const steps = [
  ["閱讀流程", "先看頁面主旨，再確認原因、風險提醒、資料邊界與下一步觀察。"],
  ["原因", "每個公開頁都應說明為什麼需要這個資訊，而不是只列規則或術語。"],
  ["風險提醒", "所有燈號與說明都不構成投資建議，也不保證報酬。"],
  ["資料邊界", "目前仍維持示範資料與模擬分數，正式資料上線前會清楚標示。"],
  ["下一步觀察", "使用者應回到市場總覽、個別標的或方法頁，交叉檢查狀態與時間。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="公開頁閱讀流程">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">閱讀流程</p>
        <h2>{item.title}</h2>
        <p>六個閱讀檢查點：狀態、原因、風險提醒、資料邊界、更新時間與下一步觀察。</p>
        <p>{item.body}</p>
        <p>{item.next}</p>
        <p>示範資料只用來呈現產品體驗；正式資料與真實分數必須等資料來源、品質、回讀與正式資料切換檢查完成。</p>
        <p>使用者可根據頁面資訊決定關注、加強觀察或等待更多資料。</p>
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
