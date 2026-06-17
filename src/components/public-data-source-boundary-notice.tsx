type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "資料來源與使用邊界",
    lead: "首頁提供市場狀態總覽、風險提示與觀察順序。請先確認資料來源、更新時間與風險聲明，再使用燈號作為輔助判斷。"
  },
  briefing: {
    title: "市場快報的資料邊界",
    lead: "市場快報用來縮短閱讀時間，協助使用者快速掌握市場氛圍；所有內容仍屬資訊整理，不是買賣建議。"
  },
  stock: {
    title: "標的頁不是交易指令",
    lead: "標的燈號協助理解單一標的的狀態、風險與資料時間，不提供個股買賣建議，也不保證任何投資結果。"
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
          <strong>不是投資建議</strong>
          <span>燈號只協助辨識市場狀態與風險，不提供買賣建議、保證報酬或個人化資產配置。</span>
        </li>
        <li>
          <strong>不是秒級報價</strong>
          <span>Phase 1 以每日資料與可理解決策輔助為主，前台需標示資料時間與可能延遲。</span>
        </li>
        <li>
          <strong>資料異常會降級</strong>
          <span>若來源、更新或品質不符合條件，前台應顯示示範、延遲、部分資料或不可用狀態。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        本網站目標是降低市場資訊理解門檻；任何燈號都應搭配資料時間、風險提示與使用者自己的判斷。
      </p>
    </section>
  );
}
