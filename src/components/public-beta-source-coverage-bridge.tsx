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
      <h2>正式資料升級前，公開頁先維持清楚揭露</h2>
      <p>
        {contextLabel}
        目前先以台股大盤與上市股票日收盤價作為主範圍。ETF 全量覆蓋、新聞評分與會員深度內容會在後續版本補齊。
      </p>
      <div className="briefing-actions">
        <SourceCoverageCard title="資料來源" text="只使用可驗證、可追溯且符合公開使用條件的資料來源；未確認前不切換正式資料模式。" />
        <SourceCoverageCard title="覆蓋範圍" text="目前聚焦台股大盤與上市股票日收盤價，先完成公開 Beta 可用閉環。" />
        <SourceCoverageCard title="品質審核" text="資料品質、更新時間、來源揭露與回復機制都要完成檢查。" />
        <SourceCoverageCard title="使用者揭露" text="若仍是示範資料，前台必須清楚標示，不讓使用者誤判。" />
      </div>
      <div className="briefing-actions" aria-label="資料來源下一步">
        <SourceCoverageActionLink
          href="/methodology"
          label="查看方法說明"
          text="了解燈號如何閱讀、哪些資料仍在示範邊界，以及正式資料升級前的限制。"
          title="查看方法說明"
        />
        <SourceCoverageActionLink
          href="/disclaimer"
          label="查看風險聲明"
          text="確認本站定位為資訊整理與風險辨識，不是投資建議。"
          title="查看風險聲明"
        />
        <SourceCoverageActionLink
          href="/briefing"
          label="回市場快報"
          text="用 30 秒摘要與 3 分鐘閱讀流程理解目前市場氛圍。"
          title="回市場快報"
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
  if (context === "stock") return `此區塊說明 ${stockSymbol} 標的頁的資料邊界。`;
  if (context === "weekly") return "此區塊說明週報頁的資料來源與覆蓋限制。";
  if (context === "briefing") return "此區塊說明市場快報的資料來源與覆蓋限制。";
  return "此區塊說明首頁市場總覽的資料來源與覆蓋限制。";
}
