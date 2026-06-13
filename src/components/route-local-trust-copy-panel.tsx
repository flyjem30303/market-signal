type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "揭露摘要",
    title: "本網站不提供買賣建議",
    summary: "燈號、分數與警示是市場狀態整理工具，使用者仍需自行判斷資料適用性與投資風險。",
    points: [
      "目前資料與分數皆為示範狀態，正式資料尚未啟用。",
      "所有警示都應搭配成因、更新時間與影響層級閱讀。",
      "任何標的內容都不是個別投資建議、保證報酬或交易指令。"
    ]
  },
  methodology: {
    eyebrow: "方法摘要",
    title: "先看市場氣氛，再看風險來源",
    summary: "方法頁說明的是閱讀順序與指標邏輯，目的在降低資訊整理時間，而不是取代使用者判斷。",
    points: [
      "示範分數用來呈現產品流程，不代表正式模型結論。",
      "資料來源、覆蓋率與品質通過前，不宣稱完整市場覆蓋。",
      "若訊號互相矛盾，應先觀察與複核，不應直接行動。"
    ]
  },
  privacy: {
    eyebrow: "隱私摘要",
    title: "公開頁不需要輸入機密資訊",
    summary: "使用公開 Beta 頁面不需要提供密鑰、交易帳戶、身份資料或任何敏感資訊。",
    points: [
      "公開頁只呈現必要摘要，不展示逐筆資料內容或系統處理內容。",
      "若未來提供收藏或偏好設定，會清楚說明資料用途。",
      "資料來源升級前，頁面仍維持示範資料狀態。"
    ]
  },
  terms: {
    eyebrow: "條款摘要",
    title: "公開 Beta 內容可能調整",
    summary: "功能、資料欄位、指標與頁面文案在 Beta 期間可能變動，使用者應自行查證重要資訊。",
    points: [
      "目前不承諾即時行情、完整覆蓋或正式預測能力。",
      "使用者應自行評估風險、交易成本與資料適用性。",
      "正式上線前，資料來源、法務揭露與升級流程仍會持續調整。"
    ]
  },
  weekly: {
    eyebrow: "週報摘要",
    title: "週報用來整理觀察順序",
    summary: "週報協助使用者從市場氣氛、ETF、風險樣本與資料邊界建立下週觀察清單。",
    points: [
      "週報不是即時行情，也不是完整市場資料庫。",
      "週報中的標的僅作為觀察樣本，不代表買賣建議。",
      "資料來源與覆蓋率通過前，週報仍以示範資料輔助閱讀。"
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
            <span>使用邊界</span>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
