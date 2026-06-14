type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "風險提醒",
    title: "市場風險自負，燈號只協助整理觀察順序",
    summary:
      "指數燈號提供市場資訊整理、風險辨識與觀察輔助，不提供個股買賣建議，也不保證任何報酬或結果。",
    points: [
      "燈號不是交易指令，請搭配自己的風險承受度與投資期限判斷。",
      "正式資料尚未啟用前，公開頁以示範資料說明產品閱讀流程。",
      "資料延遲、來源異常或模型限制都可能影響判斷，使用者需自行承擔風險。"
    ]
  },
  methodology: {
    eyebrow: "方法邊界",
    title: "燈號以趨勢、風險與資料狀態組成",
    summary:
      "方法說明用來解釋分數如何輔助閱讀市場，不是預測模型，也不是保證正確的投資結論。",
    points: [
      "分數只代表觀察排序，不能單獨作為買進、賣出或持有依據。",
      "正式資料切換前，所有公開分數仍維持示範用途。",
      "資料來源、更新時間與錯誤回退狀態會在正式資料上線時同步揭露。"
    ]
  },
  privacy: {
    eyebrow: "隱私邊界",
    title: "會員功能資料邊界會在啟用前明確說明",
    summary:
      "目前公開版不啟用會員登入、付款、持久化自選追蹤或個人化警示。未來若開放會員功能，會先說明收集目的、使用範圍與保存方式。",
    points: [
      "目前公開頁不需要註冊即可閱讀市場燈號與資料狀態。",
      "會員功能資料邊界會在會員階段實作前另行揭露。",
      "網站分析只應用於改善閱讀流程，不用來提供個人化投資建議。"
    ]
  },
  terms: {
    eyebrow: "使用邊界",
    title: "使用者需自行承擔風險，網站不提供交易服務",
    summary:
      "本網站提供資訊整理與風險辨識輔助，不代替投資決策、不串接券商下單，也不提供資產配置建議。",
    points: [
      "使用者需自行承擔風險，並自行確認資料是否符合自己的使用目的。",
      "正式資料尚未啟用前，公開頁內容只代表示範資料與閱讀流程。",
      "任何會員或進階功能都不得改變非投資建議與非交易服務定位。"
    ]
  },
  weekly: {
    eyebrow: "週報邊界",
    title: "週報整理市場狀態，不給買賣指令",
    summary:
      "週報用來回看燈號、風險與資料狀態的變化，協助建立觀察流程，不提供個別標的交易建議。",
    points: [
      "本週市場狀態整理只代表資訊摘要與觀察方向。",
      "不是買賣指令，也不保證隔週市場方向。",
      "請先確認資料更新時間、來源狀態與公開資料邊界。"
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
            <span>重點</span>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
