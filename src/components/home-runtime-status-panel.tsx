import { TrackedLink } from "@/components/tracked-link";
import { getRuntimeDecisionSummary } from "@/lib/runtime-decision-summary";
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";

type HomeRuntimeStatusPanelProps = {
  selectedSymbol: string;
};

export function HomeRuntimeStatusPanel({ selectedSymbol }: HomeRuntimeStatusPanelProps) {
  const productSummary = getRuntimeProductSummary(selectedSymbol);
  const decisionSummary = getRuntimeDecisionSummary();

  return (
    <section className="home-runtime-status-panel" aria-label="首頁資料與 runtime 狀態">
      <div>
        <p className="eyebrow">資料狀態</p>
        <h2>目前維持示範資料；正式資料來源、覆蓋率與品質通過後才會切換</h2>
        <p>
          使用者現在可以閱讀市場燈號、風險提示與下一步觀察重點。公開資料來源仍維持 mock，避免把尚未完成 promotion 的資料誤認為正式訊號。
        </p>
        <p>
          {decisionSummary.decisionLabel}: {decisionSummary.currentProgressPercent}%；{decisionSummary.safetyStopLine}
        </p>
      </div>

      <div className="runtime-product-summary" aria-label="首頁 runtime 摘要">
        {[
          { className: "active", item: productSummary.useNow },
          { className: "blocked", item: productSummary.notLiveYet },
          { className: "readying", item: productSummary.nextGate },
          { className: "active", item: productSummary.readonlyDecision }
        ].map(({ className, item }) => (
          <article className={className} key={item.label}>
            <span>{item.displayLabel}</span>
            <strong>{item.displayTitle}</strong>
            <p>{item.displayBody}</p>
          </article>
        ))}
      </div>

      <article className="home-runtime-status-panel__data">
        <span>Mock / real boundary</span>
        <strong>公開資料來源：示範資料；分數來源：示範分數</strong>
        <p>正式資料升級前，公開頁先維持清楚揭露：目前是示範資料與示範分數，非投資建議。</p>
      </article>

      <nav aria-label="首頁下一步閱讀">
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${selectedSymbol}`} label="查看標的燈號" payload={{ area: "home_runtime_status" }}>
          查看標的燈號
        </TrackedLink>
        <TrackedLink eventName="home_cta_clicked" href="/briefing" label="查看市場晨報" payload={{ area: "home_runtime_status" }}>
          查看市場晨報
        </TrackedLink>
        <TrackedLink eventName="trust_link_clicked" href="/methodology" label="查看方法說明" payload={{ area: "home_runtime_status" }}>
          查看方法說明
        </TrackedLink>
      </nav>
    </section>
  );
}
