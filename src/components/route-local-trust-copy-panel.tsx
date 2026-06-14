type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "信任提醒",
    title: "所有燈號都只能作為觀察輔助",
    summary: "網站提供市場資訊整理與風險辨識，不會替使用者做投資決策，也不承諾任何報酬。",
    points: [
      "燈號代表當下條件整理，不代表買進或賣出指令。",
      "資料可能延遲或異常，閱讀時應同步查看更新時間。",
      "任何投資決策仍需自行評估風險、資金與持有期限。"
    ]
  },
  methodology: {
    eyebrow: "方法提醒",
    title: "燈號以多個條件交叉判斷",
    summary: "方法頁說明燈號如何由趨勢、風險、資金與資料品質整理而來，避免只看單一分數。",
    points: [
      "燈號不是預測工具，而是市場狀態整理工具。",
      "分數會受資料來源、更新頻率與模型假設影響。",
      "真實資料接入前，前台仍以示範資料說明閱讀方式。"
    ]
  },
  privacy: {
    eyebrow: "隱私提醒",
    title: "公開版只收集必要的使用行為訊號",
    summary: "目前以基本頁面瀏覽與互動事件協助改善內容，不會要求使用者提供敏感金融資料。",
    points: [
      "會員功能開放前，不會要求券商帳戶或交易資料。",
      "互動紀錄只用於改善頁面閱讀與產品體驗。",
      "未來會員功能會另行揭露資料使用範圍。"
    ]
  },
  terms: {
    eyebrow: "條款提醒",
    title: "使用網站代表理解資訊輔助定位",
    summary: "條款頁界定網站服務範圍、資料限制與使用者責任，讓公開版與會員版邊界更清楚。",
    points: [
      "網站不提供個別買賣建議或資產配置建議。",
      "資料來源、更新時間與可能延遲會在前台揭露。",
      "會員功能上線前會補齊對應服務條款。"
    ]
  },
  weekly: {
    eyebrow: "週報提醒",
    title: "週報用來建立固定觀察流程",
    summary: "週報整理本週市場氛圍、風險標的與下一步觀察清單，不是交易指令。",
    points: [
      "先看大盤燈號，再看 ETF 與高風險標的。",
      "風險升高時，優先確認資料更新時間與成因。",
      "會員版未來會補上盤後複盤與歷史燈號回看。"
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
            <span>資料邊界</span>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
