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
  blocked: "等待條件",
  candidate: "候選中",
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
    <section className="panel stock-reading-summary public-beta-source-coverage-bridge" aria-label="資料來源與覆蓋狀態">
      <p className="eyebrow">資料來源與覆蓋狀態</p>
      <h2>先知道資料能信到哪裡，再閱讀燈號</h2>
      <p>
        {labels.summary}
        目前公開 Beta 會清楚標示資料來源與覆蓋率、資料範圍、資料品質、示範資料與正式資料的差異；正式市場資料尚未啟用前，
        不提供買賣建議，也避免使用者把尚未升級的資料當成即時行情。
      </p>
      <div className="briefing-actions">
        <SourceCoverageCard title="目前基準" text={`${indexLayer.label}：${indexLayer.detail}`} />
        <SourceCoverageCard title="覆蓋狀態" text={`${equityLayer.label}：${equityLayer.detail}`} />
        <SourceCoverageCard
          title="後續擴充"
          text={`${fullCoverageLayer.label}：${coverageStatusCopy[fullCoverageLayer.status]}，${fullCoverageLayer.next}`}
        />
        <SourceCoverageCard
          title="升級條件"
          text={`${derivedLayer.label}：${coverageStatusCopy[derivedLayer.status]}，${derivedLayer.next}`}
        />
      </div>
      <p>
        使用者應先看資料狀態、覆蓋範圍與更新時間，再用燈號判斷是否關注、加強觀察或降低風險。
      </p>
      <div className="briefing-actions" aria-label="資料來源下一步閱讀">
        <SourceCoverageActionLink
          href="/methodology"
          label="方法說明"
          text="了解燈號如何由分數、風險、趨勢與資料狀態組成。"
          title="查看方法說明"
        />
        <SourceCoverageActionLink
          href="/disclaimer"
          label="免責聲明"
          text="確認本站是市場資訊整理與風險辨識工具，不提供個股買賣建議。"
          title="查看風險聲明"
        />
        <SourceCoverageActionLink
          href="/briefing"
          label="市場簡報"
          text="回到市場晨報，用同一套閱讀順序比較指數、ETF 與個股狀態。"
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
