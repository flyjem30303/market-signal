type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前使用示範資料，正式市場資料尚未啟用",
    lead: "首頁先示範市場燈號的閱讀方式；正式資料來源、覆蓋率、品質檢查與回讀流程完成前，不宣稱真實即時資料。"
  },
  briefing: {
    title: "市場快報先說清楚資料邊界",
    lead: "快報用來整理市場燈號、原因與下一步觀察。正式資料尚未啟用前，所有分數都是示範分數。"
  },
  stock: {
    title: "標的頁使用示範資料",
    lead: "個股、ETF 與指數頁目前用示範資料呈現閱讀順序；正式資料上線前，不提供買賣建議或即時報價。"
  }
} as const;

export function PublicDataSourceBoundaryNotice({ context }: PublicDataSourceBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="public-data-source-boundary-notice" aria-label="資料來源與使用邊界">
      <div className="public-data-source-boundary-notice__intro">
        <p className="eyebrow">資料邊界</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul>
        <li>
          <strong>資料不是即時報價</strong>
          <span>Phase 1 以示範資料說明產品體驗；正式資料需通過來源權利、欄位契約、品質檢查與回讀驗證。</span>
        </li>
        <li>
          <strong>分數只輔助觀察</strong>
          <span>市場分數與風險分數用來排序觀察重點，不代表買賣指令，也不保證未來結果。</span>
        </li>
        <li>
          <strong>非投資建議</strong>
          <span>使用者需自行承擔風險，並依自身狀況確認資料是否符合使用目的。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        若資料延遲、來源異常或品質不足，前台應降級顯示並清楚揭露，不讓使用者誤以為資料已正式上線。
      </p>
    </section>
  );
}
