type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "風險聲明",
    title: "燈號是市場資訊整理，不是投資建議",
    summary: "本頁說明資料、燈號與文字內容的使用邊界，避免使用者把示範資料或風險提示誤解成買賣建議。",
    points: ["不提供個股買賣建議。", "不保證報酬或即時精準。", "資料異常或未更新時，前台必須顯示降級狀態。"]
  },
  methodology: {
    eyebrow: "方法說明",
    title: "燈號用來降低理解門檻，不取代判斷",
    summary: "方法頁說明分數、燈號與資料更新時間如何閱讀，也保留示範資料與正式資料的清楚邊界。",
    points: ["先看市場狀態，再看原因與更新時間。", "新聞評分與 ETF 全覆蓋延後到後續階段。", "正式資料切換需通過資料來源、品質與揭露檢查。"]
  },
  privacy: {
    eyebrow: "隱私權",
    title: "公開瀏覽階段不建立會員資料",
    summary: "目前不需要複雜會員資料流；未來會員功能上線時，會另行補齊登入、追蹤與通知的資料使用說明。",
    points: ["公開頁以匿名瀏覽與基本追蹤事件為主。", "會員 watchlist 屬後續版本。", "個人化警示上線前需補隱私與通知設定。"]
  },
  terms: {
    eyebrow: "使用條款",
    title: "使用者應把本站視為資訊輔助工具",
    summary: "條款頁說明網站定位、資料延遲、資料來源與非投資建議邊界。",
    points: ["不得把燈號視為交易指令。", "正式資料來源需清楚揭露。", "使用者仍需自行承擔投資決策。"]
  },
  weekly: {
    eyebrow: "週報",
    title: "週報用於複盤與學習，不提供保證結論",
    summary: "週報協助使用者回看市場狀態與燈號變化，仍維持非投資建議定位。",
    points: ["回看燈號是否有效。", "記錄後續觀察重點。", "避免恐慌式或保證式文案。"]
  }
} as const;

export function RouteLocalTrustCopyPanel({ context }: RouteLocalTrustCopyPanelProps) {
  const copy = copyByContext[context];

  return (
    <section className="route-local-trust-copy panel" aria-label={`${copy.eyebrow} route trust copy`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <div className="route-local-trust-copy-grid">
        {copy.points.map((point) => (
          <article key={point}>
            <span>重點</span>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
