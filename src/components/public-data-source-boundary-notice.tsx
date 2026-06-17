type PublicDataSourceBoundaryNoticeProps = {
  context: "home" | "briefing" | "stock";
};

const contextCopy = {
  home: {
    title: "目前公開版使用示範資料",
    lead: "首頁用來驗證市場總覽、燈號與風險提示的閱讀流程；正式資料啟用前，所有數字都應視為示範。"
  },
  briefing: {
    title: "市場摘要目前是示範解讀",
    lead: "本頁協助使用者理解 30 秒總覽與 3 分鐘觀察流程；正式資料、延遲與來源揭露會在審核通過後再啟用。"
  },
  stock: {
    title: "標的頁目前是示範燈號",
    lead: "標的頁呈現的是可讀的指標結構與風險提示，不代表正式行情、即時報價或投資建議。"
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
          <strong>不是即時報價</strong>
          <span>正式資料上線前，本網站不宣稱秒級即時性；正式上線後也會清楚標示資料時間與可能延遲。</span>
        </li>
        <li>
          <strong>資料異常會降級</strong>
          <span>若來源、更新或品質不符合條件，前台應顯示示範、延遲、部分資料或不可用狀態。</span>
        </li>
      </ul>
      <p className="public-data-source-boundary-notice__footnote">
        目前版本的目標是讓使用者快速理解市場氛圍；正式資料與分數切換需另行通過來源、品質、回退與公開文案審核。
      </p>
    </section>
  );
}
