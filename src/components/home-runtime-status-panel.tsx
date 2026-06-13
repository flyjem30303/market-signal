import { TrackedLink } from "@/components/tracked-link";
import { getRuntimeProductSummary } from "@/lib/runtime-product-summary";

type HomeRuntimeStatusPanelProps = {
  selectedSymbol: string;
};

export function HomeRuntimeStatusPanel({ selectedSymbol }: HomeRuntimeStatusPanelProps) {
  const productSummary = getRuntimeProductSummary(selectedSymbol);

  return (
    <section className="home-runtime-status-panel" aria-label="公開 Beta 使用狀態">
      <div>
        <p className="eyebrow">使用狀態</p>
        <h2>先用固定流程閱讀市場氣氛</h2>
        <p>
          首頁先回答三件事：市場現在偏強、觀望或偏防守；主要風險在哪裡；下一步應觀察什麼。
        </p>
      </div>

      <div className="runtime-product-summary" aria-label="公開 Beta 產品狀態">
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
        <span>資料狀態</span>
        <strong>目前維持示範資料</strong>
        <p>正式資料來源、覆蓋率與品質通過後，才會提高公開信任等級。</p>
      </article>

      <nav aria-label="公開 Beta 下一步閱讀">
        <TrackedLink eventName="home_cta_clicked" href={`/stocks/${selectedSymbol}`} label="查看標的狀態" payload={{ area: "home_runtime_status" }}>
          查看標的狀態
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
