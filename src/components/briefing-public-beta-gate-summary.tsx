export function BriefingPublicBetaGateSummary() {
  return (
    <section className="panel briefing-public-beta-gate-summary" aria-label="公開 Beta 使用者閱讀路徑">
      <div>
        <p className="eyebrow">公開 Beta 閱讀路徑</p>
        <h2>先讓使用者看懂市場狀態，再逐步補齊正式資料</h2>
        <p>
          目前首頁、快報與標的頁會優先呈現市場燈號、成因、更新時間與風險提示。正式資料尚未完全開放前，所有公開頁都要清楚標示資料邊界。
        </p>
      </div>

      <div className="briefing-public-beta-gate-grid">
        <article className="ready">
          <span>30 秒閱讀</span>
          <strong>先看市場氛圍</strong>
          <p>使用者進站後可以快速理解目前是偏多、觀望、警戒或高風險。</p>
        </article>

        <article className="ready">
          <span>3 分鐘拆解</span>
          <strong>再看原因與觀察重點</strong>
          <p>每個燈號都應搭配成因、資料更新時間與下一步觀察方向。</p>
        </article>

        <article className="hold">
          <span>資料邊界</span>
          <strong>示範資料需清楚揭露</strong>
          <p>正式資料升級前，不讓使用者誤以為目前燈號已連接正式行情。</p>
        </article>

        <article className="hold">
          <span>會員延伸</span>
          <strong>先不放入公開主流程</strong>
          <p>現階段先完成免費公開版，會員深度解讀與 watchlist 留到後續階段。</p>
        </article>
      </div>

      <footer className="briefing-public-beta-gate-footer">
        <strong>使用者承諾</strong>
        <p>本站提供市場資訊整理與風險辨識，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。</p>
      </footer>
    </section>
  );
}
