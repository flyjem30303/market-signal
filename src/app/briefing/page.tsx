import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { PublicBetaDataReadinessStatus } from "@/components/public-beta-data-readiness-status";
import { PublicBetaMembershipMvpRoadmap } from "@/components/public-beta-membership-mvp-roadmap";
import { PublicBetaPublicStatusSurface } from "@/components/public-beta-public-status-surface";
import { PublicBetaSourceCoverageBridge } from "@/components/public-beta-source-coverage-bridge";
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
  description: "用 30 秒看懂今日市場氣氛，並在 3 分鐘內完成關注、加強觀察或降低風險的行動判斷。"
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

      <section className="briefing-executive-summary" aria-label="市場簡報摘要">
        <div>
          <p className="eyebrow">市場簡報</p>
          <h1>30 秒看懂今日市場氣氛，3 分鐘行動判斷</h1>
          <p>
            今日先看 {market.asset.name} 的市場主燈號，再看風險最高的 {topRisk.asset.name}
            。這個頁面把市場狀態、風險來源、更新時間與下一步閱讀排成固定順序，降低資訊過載。
          </p>
          <p className="runtime-boundary-line">
            正式市場資料尚未啟用；目前公開頁以示範資料呈現閱讀流程，不提供個股買賣建議。請先確認資料時間與風險聲明，再做下一步觀察。
          </p>
        </div>
        <aside>
          <span>
            <b>市場主燈號</b>
            <i>
              {market.asset.name}：{market.compositeScore}/100
            </i>
          </span>
          <span>
            <b>風險觀察起點</b>
            <i>
              {topRisk.asset.name}：{topRisk.riskScore}/100
            </i>
          </span>
        </aside>
        <div className="briefing-runtime-action-strip">
          <DecisionPill title="先讀市場氣氛" body="用主燈號判斷今天偏多、觀望、警戒或高風險。" tone="active" />
          <DecisionPill title="再看風險與廣度" body="確認風險是否集中，或是否擴散到多個標的。" tone="hold" />
          <DecisionPill title="最後確認資料邊界" body="回到更新時間、方法說明與風險聲明，避免過度解讀。" tone="blocked" />
        </div>
        <nav aria-label="市場簡報快速連結">
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${market.asset.symbol}`}
            label="查看市場主燈號"
            payload={{ area: "briefing_summary", symbol: market.asset.symbol }}
          >
            <span>市場主燈號</span>
            <strong>{market.asset.name}</strong>
            <small>查看主燈號原因</small>
          </TrackedLink>
          <TrackedLink
            eventName="briefing_link_clicked"
            href={`/stocks/${topRisk.asset.symbol}`}
            label="查看風險觀察起點"
            payload={{ area: "briefing_summary", symbol: topRisk.asset.symbol }}
          >
            <span>風險觀察</span>
            <strong>{topRisk.asset.name}</strong>
            <small>查看風險原因</small>
          </TrackedLink>
        </nav>
      </section>

      <section className="home-public-beta-layers briefing-alert-decision-list" aria-label="今日警示清單">
        <div className="home-public-beta-layer alerts">
          <span>警示清單</span>
          <strong>今日警示清單：先看市場主燈號，再看風險最高標的</strong>
          <p>
            這裡不是買賣清單，而是今日觀察順序。使用者可以先用 30 秒確認市場氣氛，再用 3
            分鐘複核風險原因、資料時間與下一步閱讀。
          </p>
        </div>
        <div className="home-public-beta-alert-list">
          <BriefingCard
            href={`/stocks/${market.asset.symbol}`}
            text={`${market.asset.name} 是目前市場主燈號，用來判斷今天的市場背景。`}
            title="市場主燈號"
            value={`${market.compositeScore}/100`}
          />
          <BriefingCard
            href={`/stocks/${topRisk.asset.symbol}`}
            text={`${topRisk.asset.name} 風險分數最高，適合作為加強觀察清單的第一個標的。`}
            title="風險觀察"
            value={`${topRisk.riskScore}/100`}
          />
          <BriefingCard
            href="/methodology"
            text="目前使用示範資料與示範分數；正式資料尚未啟用，燈號只用於閱讀流程展示。"
            title="資料邊界"
            value="示範資料"
          />
        </div>
      </section>

      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <PublicBetaPublicStatusSurface />
      <PublicBetaDataReadinessStatus />
      <PublicBetaSourceCoverageBridge context="briefing" />

      <section className="briefing-breadth" id="market-structure" aria-label="市場結構">
        <BreadthCard label="偏多觀察" tone="active" value={breadth.constructive} />
        <BreadthCard label="觀望整理" tone="hold" value={breadth.watch} />
        <BreadthCard label="防守警戒" tone="blocked" value={breadth.defensive} />
      </section>

      <ConcentrationPanel concentration={concentration} />

      <section className="briefing-playbook" id="briefing-playbook" aria-label="三分鐘判斷流程">
        <p className="eyebrow">3 分鐘判斷流程</p>
        <h2>把市場燈號轉成可執行的觀察順序</h2>
        <p>每日市場晨報的市場行動摘要：30 秒看市場氣氛，3 分鐘判斷順序是先看市場氣氛，再看風險成因與市場廣度，最後整理下一步觀察。</p>
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
          description="分數較強的標的可用來觀察市場是否仍有支撐，但仍需搭配資料狀態與風險提示。"
          items={strongest}
          title="相對強勢觀察"
          valueKey="composite"
        />
        <BriefingList
          description="風險分數較高的標的，適合放在加強觀察清單中。高風險不等於立即操作。"
          items={[topRisk]}
          title="風險觀察"
          valueKey="risk"
        />
      </section>

      <PublicNextReadingFlow context="briefing" stockSymbol={market.asset.symbol} />

      <section className="panel stock-reading-summary" aria-label="下一階段會員功能">
        <p className="eyebrow">下一階段會員功能</p>
        <h2>會員內容會把看到燈號延伸成理解燈號與追蹤變化</h2>
        <p>
          會員下一階段才會開放登入、每日市場三層解讀、自選追蹤、自訂警示與盤後複盤。目前公開頁只先展示會員
          MVP 路線，避免會員架構拖慢公開 Beta 上線。
        </p>
      </section>
      <PublicBetaMembershipMvpRoadmap />

      <article className="disclaimer">
        <h2>使用提醒</h2>
        <p>本網站是市場資訊整理與風險辨識輔助工具，不提供個股買賣建議，也不保證任何投資結果。</p>
      </article>
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
      <p>市場廣度</p>
    </article>
  );
}

function buildConcentrationSignal(snapshots: SignalSnapshot[]) {
  const sorted = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore);
  const top = sorted[0];
  const second = sorted[1];
  const spread = top && second ? top.riskScore - second.riskScore : 0;
  return {
    headline: spread >= 12 ? "風險相對集中" : "風險分布較平均",
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
          <span>最高風險標的</span>
          <strong>{concentration.primary?.asset.name ?? "-"}</strong>
        </article>
        <article>
          <span>風險差距</span>
          <strong>{concentration.spread}</strong>
        </article>
      </div>
    </section>
  );
}

function buildBriefingPlaybook(market: SignalSnapshot, topRisk: SignalSnapshot) {
  return [
    {
      body: `${market.asset.name} 是今天的市場背景，用來判斷整體氣氛是偏多、觀望或警戒。`,
      step: "1",
      title: "先讀市場氣氛"
    },
    {
      body: `${topRisk.asset.name} 是今天的風險觀察起點，用來確認是否需要加強觀察。`,
      step: "2",
      title: "再看風險與廣度"
    },
    {
      body: "最後回到資料狀態、方法說明與風險聲明，避免把示範分數當成交易指令。",
      step: "3",
      title: "最後確認資料邊界"
    }
  ];
}
