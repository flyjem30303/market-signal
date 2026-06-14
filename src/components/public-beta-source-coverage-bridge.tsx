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
    <section className="panel stock-reading-summary public-beta-source-coverage-bridge" aria-label="資料來源與覆蓋率">
      <p className="eyebrow">資料來源與覆蓋率</p>
      <h2>正式市場資料尚未啟用，先把資料範圍、覆蓋範圍與升級條件說清楚</h2>
      <p>
        {contextLabel}
        目前公開頁以示範資料呈現市場閱讀流程，不提供買賣建議。正式資料需要完成合法來源確認、欄位契約、資料範圍、覆蓋範圍與異常回退後，才會切換成正式資料狀態。
      </p>
      <div className="briefing-actions">
        <SourceCoverageCard title="指數基準" text="優先確認大盤指數每日收盤與基本交易資訊，作為市場總覽的基礎。" />
        <SourceCoverageCard title="ETF 與核心標的" text="逐步補齊常用 ETF 與代表性標的，避免一開始承諾完整市場覆蓋。" />
        <SourceCoverageCard title="全市場覆蓋" text="上市櫃全量覆蓋屬於後續資料建置工作，不阻塞目前免費公開頁；這也是正式資料升級條件之一。" />
        <SourceCoverageCard title="衍生指標" text="均線、乖離、波動與資金流等指標需等基礎資料穩定後再擴充。" />
      </div>
      <p>使用者看到任何燈號時，都應同時看到資料來源狀態、更新時間與可能延遲，而不是只看單一分數。</p>
      <p>下一步可查看方法說明、查看風險聲明，或回到市場晨報重新整理今日觀察順序。</p>
      <div className="briefing-actions" aria-label="資料來源下一步閱讀">
        <SourceCoverageActionLink
          href="/methodology"
          label="查看方法說明"
          text="了解燈號如何形成，以及資料狀態如何影響解讀信心。"
          title="查看方法說明"
        />
        <SourceCoverageActionLink
          href="/disclaimer"
          label="查看風險聲明"
          text="確認本站定位是市場資訊整理與風險辨識，不是投資建議。"
          title="查看風險聲明"
        />
        <SourceCoverageActionLink
          href="/briefing"
          label="回到市場晨報"
          text="用市場簡報完成 30 秒快讀與 3 分鐘觀察判斷。"
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
  if (context === "stock") return `目前標的 ${stockSymbol} 的頁面仍以示範資料呈現。`;
  if (context === "weekly") return "週報目前用示範資料整理一週閱讀流程。";
  if (context === "briefing") return "市場簡報目前用示範資料建立判讀順序。";
  return "首頁目前用示範資料呈現市場總覽。";
}
