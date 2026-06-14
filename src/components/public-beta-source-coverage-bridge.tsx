import { TrackedLink } from "@/components/tracked-link";

type PublicBetaSourceCoverageBridgeProps = {
  context: "briefing" | "home" | "stock" | "weekly";
  stockSymbol?: string;
};

export function PublicBetaSourceCoverageBridge({
  context,
  stockSymbol = "2330"
}: PublicBetaSourceCoverageBridgeProps) {
  const contextLabel = getContextLabel(context, stockSymbol);

  return (
    <section className="panel stock-reading-summary public-beta-source-coverage-bridge" aria-label="資料來源與覆蓋率說明">
      <p className="eyebrow">資料來源與覆蓋率</p>
      <h2>正式市場資料尚未啟用，先清楚說明資料範圍、覆蓋範圍與升級條件</h2>
      <p>
        {contextLabel}
        目前公開版仍以示範資料呈現閱讀流程；正式資料切換前，需完成合法免費可自動化來源、欄位合約、覆蓋率與錯誤回退檢查。
      </p>
      <div className="briefing-actions">
        <SourceCoverageCard title="資料範圍" text="確認資料來源可公開使用、自動化讀取，並保留來源頁、條款位置與更新頻率。" />
        <SourceCoverageCard title="覆蓋範圍" text="先補核心指數、ETF 與主要觀察標的，再擴到全市場清單與歷史區間。" />
        <SourceCoverageCard title="品質檢查" text="每批資料都要檢查日期、缺漏、重複、欄位型別與可回溯雜湊。" />
        <SourceCoverageCard title="升級條件" text="資料延遲或異常時，前台必須清楚顯示狀態，避免使用者把示範資料當成正式資料。" />
      </div>
      <p>這個區塊不代表正式資料已啟用；它只說明從示範資料升級到正式資料前必須完成的條件，也不提供買賣建議。</p>
      <div className="briefing-actions" aria-label="資料來源說明連結">
        <SourceCoverageActionLink
          href="/methodology"
          label="查看方法說明"
          text="了解燈號、分數、資料品質與錯誤回退的判讀方式。"
          title="查看方法說明"
        />
        <SourceCoverageActionLink
          href="/disclaimer"
          label="查看風險聲明"
          text="確認本網站定位為市場資訊整理與風險辨識，不是投資建議。"
          title="查看風險聲明"
        />
        <SourceCoverageActionLink
          href="/briefing"
          label="回到市場晨報"
          text="回到 30 秒市場狀態與 3 分鐘觀察重點。"
          title="回到市場晨報"
        />
      </div>
    </section>
  );
}

function SourceCoverageCard({ text, title }: { text: string; title: string }) {
  return (
    <article>
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function SourceCoverageActionLink({
  href,
  label,
  text,
  title
}: {
  href: string;
  label: string;
  text: string;
  title: string;
}) {
  return (
    <TrackedLink
      eventName="trust_link_clicked"
      href={href}
      label={label}
      payload={{ area: "source_coverage_bridge_action_path" }}
    >
      <strong>{title}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function getContextLabel(context: PublicBetaSourceCoverageBridgeProps["context"], stockSymbol: string) {
  if (context === "stock") return `這個標的頁正在閱讀 ${stockSymbol} 的示範燈號。`;
  if (context === "weekly") return "週報頁用來整理較長時間的市場觀察。";
  if (context === "briefing") return "市場簡報頁用來整理今日市場氣氛與後續觀察。";
  return "首頁用來快速理解整體市場氣氛。";
}
