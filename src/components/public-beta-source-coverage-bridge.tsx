import {
  getPublicBetaSourceCoverageRuntimeLabels,
  type PublicBetaSourceCoverageContext
} from "@/lib/public-beta-source-coverage-runtime-labels";
import { TrackedLink } from "@/components/tracked-link";

type PublicBetaSourceCoverageBridgeProps = {
  context: PublicBetaSourceCoverageContext;
  stockSymbol?: string;
};

const coverageStatusCopy = {
  blocked: "尚未放行",
  candidate: "候選確認",
  checking: "確認中",
  future: "後續階段"
} satisfies Record<string, string>;

export function PublicBetaSourceCoverageBridge({
  context,
  stockSymbol = "2330"
}: PublicBetaSourceCoverageBridgeProps) {
  const labels = getPublicBetaSourceCoverageRuntimeLabels(context, stockSymbol);
  const indexLayer = labels.layers.find((layer) => layer.id === "index-baseline") ?? labels.layers[0];
  const equityLayer = labels.coverageGapMatrix.find((item) => item.id === "listed-equity-batch1-gap") ?? labels.coverageGapMatrix[0];
  const fullCoverageLayer =
    labels.coverageGapMatrix.find((item) => item.id === "listed-equity-full-gap") ?? labels.coverageGapMatrix[0];
  const derivedLayer =
    labels.coverageGapMatrix.find((item) => item.id === "derived-indicator-layer-gap") ?? labels.coverageGapMatrix[0];

  return (
    <section className="panel stock-reading-summary public-beta-source-coverage-bridge" aria-label="資料來源與覆蓋率橋接">
      <p className="eyebrow">資料來源與覆蓋率</p>
      <h2>先確認資料範圍，再提高判斷信任度</h2>
      <p>
        {labels.summary}
        目前公開 Beta 維持示範資料與示範分數；正式市場資料尚未啟用，本區只協助使用者理解資料邊界。
      </p>
      <div className="briefing-actions">
        <SourceCoverageCard title="目前可讀" text={`${indexLayer.label}：${indexLayer.detail}`} />
        <SourceCoverageCard title="覆蓋範圍" text={`${equityLayer.label}：${equityLayer.detail}`} />
        <SourceCoverageCard
          title="全市場進度"
          text={`${fullCoverageLayer.label}：${coverageStatusCopy[fullCoverageLayer.status]}，${fullCoverageLayer.next}`}
        />
        <SourceCoverageCard
          title="升級條件"
          text={`${derivedLayer.label}：${coverageStatusCopy[derivedLayer.status]}，來源、欄位、更新節奏與品質都通過後才會進入正式資料流程。`}
        />
      </div>
      <p>
        使用者下一步：先把燈號當成閱讀線索，再確認資料來源、覆蓋範圍、更新時間與風險聲明；本網站不提供買賣建議。
      </p>
      <div className="briefing-actions" aria-label="資料來源下一步閱讀">
        <SourceCoverageActionLink
          href="/methodology"
          label="方法說明"
          text="理解市場氣氛、風險升溫、資料品質與示範分數如何被整理成閱讀順序。"
          title="查看方法說明"
        />
        <SourceCoverageActionLink
          href="/disclaimer"
          label="風險聲明"
          text="確認示範資料、非投資建議與使用者自行複核責任。"
          title="查看風險聲明"
        />
        <SourceCoverageActionLink
          href="/briefing"
          label="市場晨報"
          text="回到晨報，用市場氣氛、成因、資料狀態與下一步觀察重新檢查今日判斷。"
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
