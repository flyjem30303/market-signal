import { getPublicBetaDataReadinessStatus } from "@/lib/public-beta-data-readiness-status";

export function PublicBetaDataReadinessStatus() {
  const status = getPublicBetaDataReadinessStatus();

  return (
    <section className="public-beta-data-readiness-status" aria-label="公開 Beta 資料準備狀態">
      <div className="public-beta-data-readiness-status-main">
        <p className="eyebrow">資料可信度</p>
        <h2>{status.headline}</h2>
        <p>目前資料可以怎麼使用：先用來理解燈號讀法、風險提示與觀察順序，不把它當成正式行情或交易指令。</p>
        <p>{status.summary}</p>
        <p>{status.stopLine}</p>
      </div>
      <article className="readying">
        <span>目前可用</span>
        <strong>公開頁已可閱讀燈號與風險提示</strong>
        <p>使用者可用 30 秒看市場氛圍，再用 3 分鐘複核原因、更新時間與觀察重點。</p>
      </article>
      <article className="readying">
        <span>正式資料</span>
        <strong>仍需來源與覆蓋率條件通過</strong>
        <p>正式資料上線前，必須確認來源權利、欄位契約、資料品質、回補範圍與異常降級規則。</p>
      </article>
      <article className="active">
        <span>使用邊界</span>
        <strong>目前為示範資料與示範分數</strong>
        <p>公開頁會明確標示資料狀態；不宣稱即時真實資料，也不提供個股買賣建議。</p>
      </article>
      <div className="public-beta-data-actionability" aria-label="公開頁資料可行動性">
        <p className="eyebrow">可行動閱讀順序</p>
        <article className="active">
        <span>30 秒可用</span>
        <strong>先看市場燈號</strong>
          <p>快速知道目前是偏多、觀望、警戒或高風險狀態，不需要先讀完所有指標。</p>
        </article>
        <article className="readying">
        <span>3 分鐘要複核</span>
        <strong>再看成因與更新時間</strong>
          <p>複核訊號來源、主要風險、時間脈絡與是否需要加強觀察。</p>
        </article>
        <article className="blocked">
        <span>不能當成買賣指令</span>
        <strong>只做風險辨識與觀察輔助</strong>
          <p>燈號不是買賣指令，也不保證報酬；使用者仍需自行判斷與承擔投資風險。</p>
        </article>
      </div>
      <div className="public-beta-data-upgrade-readiness" aria-label="正式資料升級檢查">
        <p className="eyebrow">正式資料升級前檢查</p>
        <article className="readying">
          <span>檢查 1</span>
          <strong>來源可用條件</strong>
          <p>確認來源是否允許自動化、轉換、摘要呈現與商業網站使用。</p>
        </article>
        <article className="readying">
          <span>檢查 2</span>
          <strong>欄位與覆蓋率</strong>
          <p>確認日期、收盤價、成交量、更新時間與缺值處理規則穩定。</p>
        </article>
        <article className="blocked">
          <span>檢查 3</span>
          <strong>回退與公開說明</strong>
          <p>確認目標市場、指數、ETF 與股票清單的資料覆蓋、歷史回補與異常降級。</p>
        </article>
      </div>
    </section>
  );
}
