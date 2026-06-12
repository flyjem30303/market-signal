type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "Disclosure Summary",
    title: "目前提供的是市場觀察輔助，不是投資建議",
    summary:
      "公開 Beta 仍以示範資料與示範分數呈現產品流程。使用者可以用它理解市場狀態、風險提示與下一步觀察，但不能把它視為買賣指令。",
    points: [
      "publicDataSource=mock；scoreSource=mock，正式市場資料尚未啟用。",
      "所有警示都需要搭配更新時間、成因與影響層級閱讀。",
      "任何個股、ETF 或指數內容都不構成投資建議，請自行查證並評估風險。"
    ]
  },
  methodology: {
    eyebrow: "Model Boundary",
    title: "方法說明只描述評分邏輯，不宣稱預測能力",
    summary:
      "目前模型用來展示如何把趨勢、風險、動能與資料品質組成可讀訊號。它不是正式投資模型，也不代表已完成真實資料覆蓋。",
    points: [
      "示範評分用來說明產品體驗，正式市場資料與 real score promotion gate 尚未通過。",
      "指標權重會隨資料來源、覆蓋率與回測品質調整。",
      "分數只能作為觀察順序，不能直接當作買賣命令。"
    ]
  },
  privacy: {
    eyebrow: "Privacy Boundary",
    title: "公開頁不要求輸入密鑰，也不顯示原始市場 payload",
    summary:
      "公開 Beta 頁面只呈現一般使用者需要的狀態與說明。使用者不需要在頁面輸入 Supabase key、內部 token 或任何交易帳戶資料。",
    points: [
      "公開頁不顯示 secrets、raw market payloads、row payloads 或 stock id payloads。",
      "若使用瀏覽器偏好設定，只會用於改善本機瀏覽體驗。",
      "資料來源升級前，頁面仍維持 mock-only 公開狀態。"
    ]
  },
  terms: {
    eyebrow: "Terms Summary",
    title: "請把公開 Beta 視為資訊產品原型",
    summary:
      "公開 Beta 可能調整資料欄位、呈現方式、指標名稱與頁面結構。服務不保證完整覆蓋、即時更新或投資結果。",
    points: [
      "目前不宣稱 complete coverage、validated forecast 或 scoreSource=real。",
      "使用者應自行判斷資料適用性，並保留獨立查證流程。",
      "正式上線前，資料來源、法務揭露與 promotion gate 需要逐項通過。"
    ]
  },
  weekly: {
    eyebrow: "Weekly Reading Boundary",
    title: "週報用來整理觀察重點，不是交易結論",
    summary:
      "週報把全市場、ETF、產業與風險項目整理成閱讀順序，協助使用者在數分鐘內知道該先看哪裡。",
    points: [
      "本週以示範資料與 freshness metadata 呈現公開閱讀流程。",
      "週報可指出觀察清單，但不代表資料已完整覆蓋或正式上線。",
      "所有訊號都必須回到個別頁面檢查成因、更新時間與影響層級。"
    ]
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
            <span>Launch Boundary</span>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
