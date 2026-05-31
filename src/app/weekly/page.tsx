import type { Metadata } from "next";
import { CommercialSlot } from "@/components/commercial-slot";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalRepository } from "@/lib/repositories/market-signal-repository";
import type { SignalSnapshot } from "@/lib/signal-model";

export const metadata: Metadata = {
  title: "台股燈號週報 | 多頭健康度、回檔風險與 ETF 加碼節奏",
  description:
    "每週整理台股多頭健康度、回檔風險、ETF 加碼節奏、AI 與半導體觀察，協助投資人追蹤市場信心。"
};

export default async function WeeklyPage() {
  const repository = getMarketSignalRepository();
  const freshness = await getDataFreshnessSnapshot();
  const snapshots = repository
    .getAssets()
    .map((asset) => repository.getSnapshot(asset.symbol, "2026-05-28"))
    .filter((snapshot): snapshot is NonNullable<typeof snapshot> => Boolean(snapshot));
  const market = snapshots.find((item) => item.asset.symbol === "TWII") ?? snapshots[0];
  const topHealth = snapshots.slice().sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 6);
  const riskHeating = snapshots.slice().sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);
  const etfs = snapshots.filter((item) => item.asset.group === "ETF").sort((a, b) => b.healthScore - a.healthScore);
  const aiSemis = snapshots
    .filter((item) => ["半導體", "IC 設計", "AI 伺服器", "電子代工"].includes(item.asset.group))
    .sort((a, b) => b.healthScore - a.healthScore);
  const breadth = buildWeeklyBreadth(snapshots);
  const topRisk = riskHeating[0];
  const topEtf = etfs[0];
  const leadingAiSemi = aiSemis[0];
  const cadence = buildWeeklyRuntimeCadence(market, breadth, topRisk, topEtf);

  return (
    <main className="page-shell">
      <PageViewTracker eventName="weekly_page_viewed" payload={{ page: "weekly" }} />
      <section className="hero">
        <p className="eyebrow">Weekly Report</p>
        <h1>台股燈號週報</h1>
        <p>
          本週追蹤多頭健康度、回檔風險與投資信心變化。現階段使用模型資料產生週報模板，
          後續可接入真實行情、新聞與法人籌碼資料。
        </p>
      </section>
      <DataFreshnessStrip freshness={freshness} />

      <section className="weekly-quick-read" aria-label="週報快速閱讀">
        <article>
          <span>市場廣度</span>
          <strong>{breadth.constructive} 個強勢</strong>
          <p>先確認強勢是否擴散到 ETF、權值股與 AI 半導體，不只看指數表面。</p>
        </article>
        <article>
          <span>風險溫度</span>
          <strong>{topRisk.asset.symbol} 風險 {topRisk.riskScore}</strong>
          <p>風險升溫排行用來提醒追價節奏，仍不是賣出或放空訊號。</p>
        </article>
        <article>
          <span>資料邊界</span>
          <strong>{freshness.scoreSourceLabel}</strong>
          <p>目前週報支援產品體驗與閱讀流程驗證，不代表真實資料或正式模型已核准。</p>
        </article>
      </section>

      <section className="weekly-runtime-cadence" aria-label="週報執行節奏">
        <div>
          <p className="eyebrow">Runtime Cadence</p>
          <h2>本週照這個節奏讀</h2>
          <p>週報不追求單日反應，而是把市場、ETF、風險與每日晨報串成一個較慢的觀察節奏。</p>
        </div>
        {cadence.map((item) => (
          <TrackedLink
            className={item.tone}
            eventName="weekly_link_clicked"
            href={item.href}
            key={item.label}
            label={item.title}
            payload={{ area: "runtime_cadence", symbol: item.symbol }}
          >
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <p>{item.text}</p>
          </TrackedLink>
        ))}
      </section>

      <section className="weekly-reading-bridge" aria-label="週報讀後路徑">
        <div>
          <p className="eyebrow">Reading Bridge</p>
          <h2>讀完週報後先看哪裡</h2>
          <p>把週報結論接回可瀏覽頁面：先確認大盤，再看 ETF、主線族群與風險升溫標的。</p>
        </div>
        <nav>
          <WeeklyBridgeLink
            href={`/stocks/${market.asset.symbol}`}
            label="市場基準"
            title={`${market.asset.symbol} ${market.asset.name}`}
            text={`綜合 ${market.compositeScore}/100，先確認大盤是否支撐週報判讀。`}
          />
          <WeeklyBridgeLink
            href={`/stocks/${topEtf.asset.symbol}`}
            label="ETF 節奏"
            title={`${topEtf.asset.symbol} ${topEtf.asset.name}`}
            text={`健康 ${topEtf.healthScore}/100，用來觀察核心部位是否仍穩。`}
          />
          <WeeklyBridgeLink
            href={`/stocks/${leadingAiSemi.asset.symbol}`}
            label="主線族群"
            title={`${leadingAiSemi.asset.symbol} ${leadingAiSemi.asset.name}`}
            text={`健康 ${leadingAiSemi.healthScore}/100，檢查 AI / 半導體主線是否延續。`}
          />
          <WeeklyBridgeLink
            href={`/stocks/${topRisk.asset.symbol}`}
            label="風險檢查"
            title={`${topRisk.asset.symbol} ${topRisk.asset.name}`}
            text={`風險 ${topRisk.riskScore}/100，追價前先拆解風險來源。`}
          />
        </nav>
      </section>

      <article className="panel weekly-article">
        <p className="eyebrow">Market Brief</p>
        <h2>本週台股總覽</h2>
        <p>
          目前 {market.asset.name} 的綜合分數為 {market.compositeScore}/100，燈號為
          「{market.signal.title}」。這代表市場仍具備一定多頭條件，但投資節奏不應只看指數位置，
          還要同步觀察產業擴散、估值壓力與籌碼是否過度集中。
        </p>
        <p>
          本週週報的核心判讀是：健康度高的標的可列入追蹤清單，風險升溫的標的則適合降低追價速度。
          對長期投資人來說，燈號不是單日買賣訊號，而是用來決定分批、等待或檢查部位風險的輔助儀表。
        </p>
      </article>

      <section className="weekly-grid">
        <WeeklyRanking title="健康度排行" items={topHealth} description="綜合分數較高，代表趨勢、基本面與資金面目前較完整。" />
        <WeeklyRanking title="風險升溫排行" items={riskHeating} description="回檔風險較高，適合檢查估值、籌碼集中與短線漲幅。" scoreKey="risk" />
      </section>

      <section className="panel">
        <p className="eyebrow">ETF Allocation</p>
        <h2>ETF 加碼節奏</h2>
        <p>
          ETF 適合用來觀察大盤型部位的分批節奏。若 0050、006208 這類大型 ETF 健康度維持高檔且風險沒有快速升溫，
          可視為市場核心權值仍有支撐；若風險分數升高，則代表新增部位更適合採取分批與等待回檔。
        </p>
        <div className="rank-list">
          {etfs.map((item) => (
            <TrackedLink
              className="rank-row"
              eventName="weekly_link_clicked"
              href={`/stocks/${item.asset.symbol}`}
              key={item.asset.id}
              label={`${item.asset.symbol} ${item.asset.name}`}
              payload={{ area: "etf_allocation", symbol: item.asset.symbol }}
            >
              <strong>{item.asset.symbol}</strong>
              <span>{item.asset.name}</span>
              <b>健 {item.healthScore}</b>
            </TrackedLink>
          ))}
        </div>
      </section>

      <section className="panel weekly-article">
        <p className="eyebrow">AI & Semiconductor</p>
        <h2>AI / 半導體觀察</h2>
        <p>
          AI 與半導體仍是台股信心的重要來源。本週可優先觀察
          {aiSemis.slice(0, 3).map((item) => ` ${item.asset.symbol} ${item.asset.name}`).join("、")} 等標的，
          因為這些公司同時影響權值、產業敘事與外資資金想像。不過當 AI 題材健康度高、估值風險也高時，
          投資人更需要把「長期成長」與「短期追價」分開判斷。
        </p>
      </section>

      <section className="panel weekly-article">
        <p className="eyebrow">Next Week Watchlist</p>
        <h2>下週觀察重點</h2>
        <p>
          下週優先看三件事：第一，台指與大型 ETF 的健康度是否同步維持；第二，AI 與半導體強勢股是否擴散到更多族群；
          第三，風險升溫排行是否開始集中在同一批熱門股。若健康度擴散、風險沒有同步升高，市場信心通常較穩；
          若分數只集中在少數權值股，則代表指數表面強勢但內部結構可能變窄。
        </p>
      </section>

      <section className="panel weekly-links">
        <h2>讀完週報後</h2>
        <a className="text-link" href="/">
          回首頁看市場廣度
        </a>
        <a className="text-link" href="/briefing">
          看每日晨報
        </a>
        <a className="text-link" href="/stocks/TWII">
          查看台指狀態
        </a>
        <a className="text-link" href="/methodology">
          了解評分方法
        </a>
        <a className="text-link" href="/disclaimer">
          確認免責聲明
        </a>
      </section>

      <article className="disclaimer">
        <h2>投資免責聲明</h2>
        <p>
          本週報為模型研究與資訊整理，不構成投資建議、買賣推薦或收益保證。投資前請自行評估風險承受度與資金規劃。
        </p>
      </article>

      <CommercialSlot context="weekly" />
    </main>
  );
}

function WeeklyBridgeLink({
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
    <TrackedLink eventName="weekly_link_clicked" href={href} label={title} payload={{ area: "reading_bridge", symbol: href.split("/").pop() }}>
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function buildWeeklyBreadth(snapshots: SignalSnapshot[]) {
  return snapshots.reduce(
    (summary, snapshot) => {
      if (snapshot.signal.key === "green" || snapshot.signal.key === "yellow") {
        summary.constructive += 1;
      } else if (snapshot.signal.key === "orange") {
        summary.watch += 1;
      } else {
        summary.defensive += 1;
      }

      return summary;
    },
    { constructive: 0, defensive: 0, watch: 0 }
  );
}

function buildWeeklyRuntimeCadence(
  market: SignalSnapshot,
  breadth: ReturnType<typeof buildWeeklyBreadth>,
  topRisk: SignalSnapshot,
  topEtf: SignalSnapshot
) {
  const marketIsConstructive = market.signal.key === "green" || market.signal.key === "yellow";
  const breadthTone = breadth.defensive > breadth.constructive ? "hold" : "active";
  const riskTone = topRisk.riskScore >= 70 ? "blocked" : "hold";
  const etfTone = topEtf.riskScore >= 60 ? "hold" : "active";

  return [
    {
      href: `/stocks/${market.asset.symbol}`,
      label: "週初",
      symbol: market.asset.symbol,
      text: marketIsConstructive
        ? `大盤為${market.signal.title}，先確認健康度是否由更多標的支撐。`
        : `大盤為${market.signal.title}，先降低速度，確認週報假設是否仍成立。`,
      title: breadthTone === "active" ? "先確認市場廣度" : "先降速看結構",
      tone: breadthTone
    },
    {
      href: `/stocks/${topEtf.asset.symbol}`,
      label: "週中",
      symbol: topEtf.asset.symbol,
      text: `${topEtf.asset.symbol} 健康 ${topEtf.healthScore}/100，檢查核心 ETF 是否支撐分批節奏。`,
      title: etfTone === "active" ? "再看 ETF 節奏" : "ETF 先保守觀察",
      tone: etfTone
    },
    {
      href: `/stocks/${topRisk.asset.symbol}`,
      label: "週末前",
      symbol: topRisk.asset.symbol,
      text: `${topRisk.asset.symbol} 風險 ${topRisk.riskScore}/100，若風險未降溫，下週先維持觀察。`,
      title: riskTone === "blocked" ? "優先拆高風險" : "最後檢查風險",
      tone: riskTone
    },
    {
      href: "/briefing",
      label: "每日校準",
      symbol: "briefing",
      text: "每天回到晨報確認風險是否擴散，避免週報結論被單日波動誤導。",
      title: "用晨報校準",
      tone: "active"
    }
  ];
}

function WeeklyRanking({
  title,
  description,
  items,
  scoreKey = "composite"
}: {
  title: string;
  description: string;
  items: SignalSnapshot[];
  scoreKey?: "composite" | "risk";
}) {
  return (
    <section className="panel">
      <p className="eyebrow">Ranking</p>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="rank-list">
        {items.map((item) => (
          <TrackedLink
            className="rank-row"
            eventName="weekly_link_clicked"
            href={`/stocks/${item.asset.symbol}`}
            key={item.asset.id}
            label={`${item.asset.symbol} ${item.asset.name}`}
            payload={{ area: "ranking", symbol: item.asset.symbol }}
          >
            <strong>{item.asset.symbol}</strong>
            <span>{item.asset.name}</span>
            <b>{scoreKey === "risk" ? `險 ${item.riskScore}` : item.compositeScore}</b>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
