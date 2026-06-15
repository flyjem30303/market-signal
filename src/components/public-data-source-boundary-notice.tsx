type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前資料仍是示範狀態",
    lead: "首頁用來呈現指數燈號的閱讀方式。資料真實化完成前，請把分數與燈號視為產品示範。"
  },
  briefing: {
    title: "市場快報仍保留資料邊界",
    lead: "快報協助整理市場氛圍與觀察重點，但目前尚未宣稱使用完整真實資料。"
  },
  stock: {
    title: "個別標的頁仍是觀察輔助",
    lead: "標的燈號用來示範如何閱讀狀態、原因與風險，不能視為個股買賣建議。"
  }
} as const;

export function PublicDataSourceBoundaryNotice({ context }: PublicDataSourceBoundaryNoticeProps) {
  const copy = contextCopy[context];

  return (
    <section className="public-data-source-boundary-notice" aria-label="資料來源與風險邊界">
      <div className="public-data-source-boundary-notice__intro">
        <p className="eyebrow">資料邊界</p>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <ul>
        <li>
          <strong>來源</strong>
          <span>正式切換前會清楚標示來源、更新時間與資料延遲。</span>
        </li>
        <li>
          <strong>用途</strong>
          <span>本網站定位是市場資訊整理與風險辨識，不是交易指令。</span>
        </li>
        <li>
          <strong>限制</strong>
          <span>資料異常、延遲或覆蓋率不足時，前台會保留提示，避免使用者誤判。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        所有燈號都應搭配原因、更新時間與風險提示一起閱讀。
      </p>
    </section>
  );
}
