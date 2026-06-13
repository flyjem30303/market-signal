export function BriefingPublicBetaGateSummary() {
  return (
    <section className="panel briefing-public-beta-gate-summary" aria-label="資料使用狀態摘要">
      <div>
        <p className="eyebrow">資料使用狀態</p>
        <h2>先看市場氣氛，再確認資料限制</h2>
        <p>
          本站目前用示範資料呈現指數狀態儀表站的閱讀方式。正式資料上線前，所有燈號、分數與警示都只用來協助理解流程，
          不能視為即時行情或個人化投資建議。
        </p>
      </div>

      <div className="briefing-public-beta-gate-grid">
        <article className="ready">
          <span>30 秒可用</span>
          <strong>看市場氣氛</strong>
          <p>先看大盤、ETF 與主要標的的強弱排列，快速掌握今天偏穩、觀察或防守。</p>
        </article>

        <article className="ready">
          <span>3 分鐘要複核</span>
          <strong>看成因與時間</strong>
          <p>再確認警示成因、更新時間、影響級別與資料狀態，避免只看單一分數。</p>
        </article>

        <article className="hold">
          <span>資料限制</span>
          <strong>示範資料</strong>
          <p>正式市場資料尚未啟用；頁面會明確標示資料限制與可閱讀範圍。</p>
        </article>

        <article className="hold">
          <span>不能直接做</span>
          <strong>不能當成買賣指令</strong>
          <p>本頁只做市場狀態與風險辨識，不提供買進、賣出、持有或保證報酬建議。</p>
        </article>
      </div>

      <footer className="briefing-public-beta-gate-footer">
        <strong>使用邊界</strong>
        <p>目前不把示範資料當成正式資料，不提供買賣建議，也不宣稱即時或完整市場覆蓋。</p>
      </footer>
    </section>
  );
}
