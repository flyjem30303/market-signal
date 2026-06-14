import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicNextReadingFlow } from "@/components/public-next-reading-flow";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import {
  getMarketSignalRepository,
  getMarketSignalSourceStatus
} from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "市場簡報",
  description: "用 30 秒看懂目前市場氛圍，並用 3 分鐘決定是否關注、加強觀察或降低風險。"
};

export default async function BriefingPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is SignalSnapshot => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topRisk = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore)[0] ?? market;
  const strongest = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 4);
  const breadth = buildMarketBreadth(snapshots);
  const concentration = buildConcentrationSignal(snapshots);
  const playbook = buildBriefingPlaybook(market, topRisk);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="briefing_page_viewed" payload={{ page: "briefing" }} />

      <section className="briefing-public-summary" aria-label="市場狀態總覽">
        <p className="eyebrow">市場簡報</p>
        <h1>先看市場燈號，再決定今天要觀察什麼</h1>
        <p>
          指數燈號把市場資料整理成偏多、觀望、警戒與高風險四種閱讀狀態。你可以先用 30
          秒掌握市場氛圍，再用 3 分鐘確認主要風險、強勢標的與下一步觀察重點。
        </p>
      </section>

      <section className="briefing-executive-summary" aria-label="30 秒市場摘要">
        <div>
          <p className="eyebrow">30 秒市場摘要</p>
          <h1>{market.signal.title}</h1>
          <p>
            {market.asset.name} 目前分數為 {market.compositeScore}/100。風險分數最高的是{" "}
            {topRisk.asset.name}，目前為 {topRisk.riskScore}/100。請把這裡視為市場觀察輔助，而不是買賣建議。
          </p>
          <p className="runtime-boundary-line">
            資料仍會標示更新時間與來源狀態；若資料延遲或尚未完成正式資料切換，頁面會以保守提示呈現。
          </p>
        </div>
        <aside>
          <span>
            <b>市場分數</b>
            <i>
              {market.asset.name}：{market.compositeScore}/100
            </i>
          </span>
          <span>
            <b>最高風險</b>
            <i>
              {topRisk.asset.name}：{topRisk.riskScore}/100
            </i>
          </span>
        </aside>
        <div className="briefing-runtime-action-strip">
          <DecisionPill title="先看總覽" body="確認市場目前是偏多、觀望還是警戒。" tone="active" />
          <DecisionPill title="加強觀察" body="追蹤風險分數最高與變化最大的標的。" tone="hold" />
          <DecisionPill title="避免誤判" body="先確認更新時間與資料狀態，再做後續判斷。" tone="blocked" />
        </div>
        <nav aria-label="市場摘要連結">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場主指標"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>市場主指標</span>
            <strong>{market.asset.name}</strong>
            <small>查看燈號、分數與原因</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看最高風險標的"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>最高風險</span>
            <strong>{topRisk.asset.name}</strong>
            <small>確認風險來源與觀察重點</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="警示清單">
        <div className="home-public-beta-layer alerts">
          <span>警示清單</span>
          <strong>先看市場主燈號，再看風險集中在哪裡。</strong>
          <p>
            這份清單協助你快速建立觀察順序：市場總體狀態、風險最高標的、以及需要回頭理解的燈號規則。
          </p>
        </div>
        <div className="home-public-beta-alert-list">
          <BriefingCard
            href={`/stocks/${market.asset.symbol}`}
            text={`${market.asset.name} 是目前市場總覽的主要參考。先看分數，再看燈號原因。`}
            title="市場主燈號"
            value={`${market.compositeScore}/100`}
          />
          <BriefingCard
            href={`/stocks/${topRisk.asset.symbol}`}
            text={`${topRisk.asset.name} 目前風險分數最高，適合優先確認波動與防守訊號。`}
            title="風險焦點"
            value={`${topRisk.riskScore}/100`}
          />
          <BriefingCard
            href="/methodology"
            text="了解燈號如何閱讀、分數代表什麼，以及哪些情況不應過度解讀。"
            title="燈號說明"
            value="閱讀"
          />
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />

      <PublicBetaDataReadinessStatus />

      <section className="panel stock-reading-summary" aria-label="正式資料狀態提醒">
        <p className="eyebrow">資料上線提醒</p>
        <h2>正式市場資料尚未啟用，請先看更新時間、來源狀態與資料品質</h2>
        <p>
          目前公開頁仍以示範資料呈現閱讀流程。正式資料完成切換前，所有燈號都應視為市場觀察與風險辨識線索，
          不提供個股買賣建議，也不應直接當成即時市場訊號或交易指令。
        </p>
      </section>

      <section className="panel stock-reading-summary" aria-label="資料邊界">
        <p className="eyebrow">資料邊界</p>
        <h2>正式資料尚未啟用，請先看更新時間與來源狀態</h2>
        <p>
          目前先建立市場閱讀流程與資料上線閉環。正式資料完成切換前，頁面會清楚標示資料狀態，避免把示範分數誤認為即時市場訊號。
        </p>
      </section>

      <section className="briefing-breadth" id="market-structure" aria-label="市場結構">
        <BreadthCard label="偏多" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守" tone="blocked" value={breadth.defensive} />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="briefing-playbook" id="briefing-playbook" aria-label="3 分鐘行動流程">
        <p className="eyebrow">3 分鐘行動流程</p>
        <h2>用同一個順序檢查市場，降低被單一數字誤導的機率</h2>
        <p>每次打開網站時，照著三個步驟看：先確認總體燈號，再看風險集中，最後確認資料更新狀態。</p>
        <div className="playbook-grid">
          {playbook.map((item) => (
            <article className="playbook-card" key={item.title}>
              <span>{item.step}</span>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="weekly-grid">
        <BriefingList
          description="分數較高代表目前狀態相對強，但仍需搭配風險分數與資料更新時間一起判讀。"
          items={strongest}
          title="相對強勢"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高代表需要提高注意，不代表一定會下跌，也不是賣出建議。"
          items={[topRisk]}
          title="風險優先"
          valueKey="risk"
        />
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />

      <section className="panel stock-reading-summary" aria-label="閱讀提醒">
        <p className="eyebrow">閱讀提醒</p>
        <h2>燈號是觀察順序，不是交易指令</h2>
        <p>
          本站提供市場資訊整理、風險辨識與觀察輔助。任何燈號、分數或提示都不構成個別買賣建議，也不保證未來報酬。
        </p>
      </section>
    </main>
  );
}

function DecisionPill({ body, title, tone }: { body: string; title: string; tone: "active" | "hold" | "blocked" }) {
  return (
    <article className={`decision-pill ${tone}`}>
      <strong>{title}</strong>
      <span>{body}</span>
    </article>
  );
}

function BriefingCard({ href, text, title, value }: { href: string; text: string; title: string; value: string }) {
  return (
    <TrackedLink eventName="briefing_link_clicked" href={href} label={title} payload={{ area: "briefing_card", title }}>
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function BriefingList({
  description,
  items,
  title,
  valueKey
}: {
  description: string;
  items: SignalSnapshot[];
  title: string;
  valueKey: "composite" | "risk";
}) {
  return (
    <article className="panel briefing-article">
      <p className="eyebrow">{title}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="rank-list">
        {items.map((item) => (
          <TrackedLink
            className="rank-row"
            eventName="briefing_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.id}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: title, symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
            <b>{valueKey === "risk" ? item.riskScore : item.compositeScore}</b>
          </TrackedLink>
        ))}
      </div>
    </article>
  );
}

function buildMarketBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.compositeScore >= 70) summary.constructive += 1;
      else if (snapshot.riskScore >= 60 || snapshot.compositeScore < 45) summary.defensive += 1;
      else summary.watch += 1;
      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function BreadthCard({
  label,
  tone,
  value
}: {
  label: string;
  tone: "active" | "hold" | "blocked";
  value: number;
}) {
  return (
    <article className={`breadth-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>目前樣本數</p>
    </article>
  );
}

function buildConcentrationSignal(snapshots: SignalSnapshot[]) {
  const sorted = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore);
  const top = sorted[0];
  const second = sorted[1];
  const spread = top && second ? top.riskScore - second.riskScore : 0;
  return {
    headline: spread >= 12 ? "風險較集中，優先看單一焦點" : "風險分散，先看整體結構",
    primary: top,
    spread
  };
}

function ConcentrationPanel({
  concentration
}: {
  concentration: ReturnType<typeof buildConcentrationSignal>;
}) {
  return (
    <section className="panel briefing-concentration" aria-label="風險集中度">
      <p className="eyebrow">風險集中度</p>
      <h2>{concentration.headline}</h2>
      <div className="concentration-metrics">
        <article>
          <span>主要風險焦點</span>
          <strong>{concentration.primary?.asset.name ?? "-"}</strong>
        </article>
        <article>
          <span>風險分差</span>
          <strong>{concentration.spread}</strong>
        </article>
      </div>
    </section>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 目前燈號為「${market.signal.title}」。先確認總體方向，再看是否需要放慢或加強觀察。`,
      step: "1",
      title: "確認市場狀態"
    },
    {
      body: `${topRisk.asset.name} 是目前風險最高的觀察對象。請優先看波動、成交與趨勢是否同向。`,
      step: "2",
      title: "找出風險焦點"
    },
    {
      body: "最後確認資料更新時間與來源狀態。若資料延遲，請把燈號視為參考，不要當成即時判斷。",
      step: "3",
      title: "確認資料狀態"
    }
  ];
}
