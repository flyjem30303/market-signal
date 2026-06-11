type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "Disclosure Summary",
    title: "目前是示範型資訊服務，不是投資建議",
    summary:
      "網站會呈現市場狀態、資料時效、模型限制與風險提醒，但目前仍維持 mock-only Beta；任何燈號、分數或排名都不能視為買賣建議。",
    points: [
      "publicDataSource=mock、scoreSource=mock，代表公開頁仍是示範資料與示範分數。",
      "資料可能延遲、缺漏或無法更新，使用者應自行複核原始來源與自身風險承受度。",
      "所有風險提示都只用於資訊整理，不保證報酬，也不代表個別投資建議。"
    ]
  },
  methodology: {
    eyebrow: "Model Boundary",
    title: "方法論說明的是閱讀順序，不是正式模型結論",
    summary:
      "目前分數用來展示指數狀態儀表站的閱讀流程；它尚未代表完整覆蓋、正式預測能力或個人化建議。",
    points: [
      "分數仍是 mock score，尚未通過 real promotion gate。",
      "資料時效可被展示，但不等於資料完整、模型可信或來源權利已完成。",
      "未來切換真實資料前，必須通過來源權利、覆蓋率、品質與回退條件。"
    ]
  },
  privacy: {
    eyebrow: "Privacy Boundary",
    title: "公開頁不要求輸入密鑰，也不展示原始市場 payload",
    summary:
      "目前公開頁只呈現整理後的示範資訊，不會要求使用者輸入 Supabase key、資料供應商密鑰或其他敏感內容。",
    points: [
      "公開頁不顯示 secrets、raw market payload、row payload 或可反推敏感資料的內容。",
      "若未來接入真實資料，仍會以最小揭露、可追溯與可回退為原則。",
      "使用者互動資料應只用於產品體驗改善與基本分析，不作為個人化投資判斷。"
    ]
  },
  terms: {
    eyebrow: "Terms Summary",
    title: "請把目前版本視為公開 Beta 示範服務",
    summary:
      "目前網站適合用來理解產品方向與資訊組織方式，不適合直接作為交易、投資配置或風險承諾依據。",
    points: [
      "網站不宣稱 complete coverage、validated forecast 或 scoreSource=real。",
      "燈號與卡片可能過期、缺漏或失準，使用者必須自行判斷與複核。",
      "正式上線前會補齊資料來源、法務揭露、品質檢查與錯誤回退說明。"
    ]
  },
  weekly: {
    eyebrow: "Weekly Reading Boundary",
    title: "週報是市場閱讀輔助，不是即時完整市場資料",
    summary:
      "週報用來示範如何把大盤、ETF、族群與風險提示串成可閱讀的決策輔助流程；目前仍不代表完整即時資料或投資建議。",
    points: [
      "週報節奏仍依 mock 資料與 freshness metadata 呈現。",
      "目前覆蓋率仍是 partial coverage / readiness，缺漏或延遲資料可能影響解讀。",
      "正式週報上線前，需要資料覆蓋、來源權利、品質分級、回退條件與結果覆核都通過。"
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
