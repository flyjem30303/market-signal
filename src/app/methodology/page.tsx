import type { Metadata } from "next";
import { DataFreshnessStrip } from "@/components/data-freshness-strip";
import { PageViewTracker } from "@/components/page-view-tracker";
import { TrackedLink } from "@/components/tracked-link";
import { TrustRuntimeBoundaryNotice } from "@/components/trust-runtime-boundary-notice";
import { getDataFreshnessSnapshot } from "@/lib/data-freshness-source";
import { getMarketSignalSourceStatus } from "@/lib/repositories/market-signal-repository";

export const metadata: Metadata = {
  title: "評分方法論",
  description: "說明台股燈號的多頭健康度、回檔風險度、六大模組、資料品質與回測揭露原則。"
};

const modules = [
  ["價格趨勢", "18%", "收盤價、均線、相對強弱、成交量", "觀察趨勢是否延續，是否出現結構轉弱。"],
  ["獲利基本面", "18%", "月營收、EPS、毛利率、營益率", "確認獲利是否支撐目前評價。"],
  ["估值壓力", "16%", "PE、PB、殖利率、歷史分位", "判斷是否進入追價或過熱區。"],
  ["市場廣度 / 族群", "14%", "同產業上漲比例、站上均線比例", "檢查漲勢是否擴散，而不是只靠少數權值股。"],
  ["籌碼資金", "16%", "三大法人、融資、借券、當沖比", "觀察資金是否穩定，散戶槓桿是否偏熱。"],
  ["宏觀與上游", "18%", "SOX、NASDAQ、VIX、10Y、DXY、USD/TWD", "評估外部環境是否支持風險資產。"]
];

const qualityLevels = [
  ["A", "核心資料完整，更新時間正常，燈號可作為主要觀察依據。"],
  ["B", "少數非核心資料缺漏，分數仍可參考，但需保留解讀空間。"],
  ["C", "重要資料缺漏，分數需保守解讀，避免過度依賴單日燈號。"],
  ["D", "資料不足，不應產生正式燈號，只能顯示資料不足。"]
];

export default async function MethodologyPage() {
  const freshness = await getDataFreshnessSnapshot();
  const marketSignalSourceStatus = getMarketSignalSourceStatus();

  return (
    <main className="page-shell">
      <PageViewTracker eventName="methodology_page_viewed" payload={{ page: "methodology" }} />
      <section className="hero">
        <p className="eyebrow">Methodology</p>
        <h1>評分方法論</h1>
        <p>
          台股燈號的定位是市場狀態儀表，協助投資人觀察多頭健康度與回檔風險。
          分數不是買賣建議，也不是收益保證。
        </p>
      </section>
      <DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />
      <TrustRuntimeBoundaryNotice context="methodology" />

      <section className="method-quick-read" aria-label="方法論快速摘要">
        <article>
          <span>目前定位</span>
          <strong>市場狀態儀表</strong>
          <p>協助使用者理解健康度、風險度與資料限制，不直接輸出買賣指令。</p>
        </article>
        <article>
          <span>目前資料</span>
          <strong>{freshness.scoreSourceLabel}</strong>
          <p>現階段仍用來驗證產品體驗；正式模型需完成真實資料、回測與角色審核。</p>
        </article>
        <article>
          <span>公開宣稱</span>
          <strong>尚未開放</strong>
          <p>不能宣稱真實績效、真實訊號或投資建議，直到公開宣稱 gate 完成。</p>
        </article>
      </section>

      <section className="method-application-bridge" aria-label="方法論應用路徑">
        <div>
          <p className="eyebrow">Apply The Method</p>
          <h2>把方法拿去對照頁面</h2>
          <p>先理解評分邏輯，再回到實際頁面檢查市場、週期、單一標的與資料邊界。</p>
        </div>
        <nav>
          <MethodBridgeLink href="/briefing" label="每日節奏" title="看晨報" text="用市場廣度、風險升溫與主線族群練習每日判讀。" />
          <MethodBridgeLink href="/weekly" label="週期觀察" title="看週報" text="把健康度、風險度與 ETF 節奏放到一週脈絡中看。" />
          <MethodBridgeLink href="/stocks/TWII" label="市場基準" title="看台指" text="用指數頁對照大盤健康度、風險度與資料品質。" />
          <MethodBridgeLink href="/stocks/2330" label="個股拆解" title="看 2330" text="進入個股頁檢查模組、趨勢、新聞信心與回測摘要。" />
        </nav>
      </section>

      <section className="method-runtime-map" aria-label="方法論 runtime 對照">
        <div>
          <p className="eyebrow">Runtime Map</p>
          <h2>分數進頁面後怎麼讀</h2>
          <p>方法論不是獨立文件，它要回到首頁、晨報、週報與個股頁，形成一致的 mock 閱讀流程。</p>
        </div>
        <article>
          <span>第一步</span>
          <strong>先看狀態</strong>
          <p>確認資料狀態、分數來源與燈號，只判斷目前可讀取程度，不直接推導投資動作。</p>
        </article>
        <article>
          <span>第二步</span>
          <strong>再拆模組</strong>
          <p>把健康度、風險度、趨勢、技術、籌碼、基本面與新聞信心分開交叉檢查。</p>
        </article>
        <article>
          <span>第三步</span>
          <strong>確認停止線</strong>
          <p>資料來源、回測或公開宣稱不足時，停止升級結論，只保留觀察與產品驗證。</p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>健康度、風險度與綜合燈號</h2>
        <div className="method-grid">
          <article>
            <h3>多頭健康度</h3>
            <p>衡量趨勢、基本面、資金與產業支撐是否仍存在。分數越高，代表多頭條件越完整。</p>
          </article>
          <article>
            <h3>回檔風險度</h3>
            <p>衡量估值、籌碼、波動、集中度與宏觀壓力是否升高。分數越高，代表追價需要更謹慎。</p>
          </article>
          <article>
            <h3>綜合燈號</h3>
            <p>把健康度與風險度合併，作為投資節奏參考。燈號反映風險環境，不代表交易指令。</p>
          </article>
        </div>
      </section>

      <section className="panel method-section">
        <h2>六大評分模組</h2>
        <div className="method-table" role="table" aria-label="六大評分模組">
          <div className="method-row method-head" role="row">
            <span>模組</span>
            <span>權重</span>
            <span>主要資料</span>
            <span>專業判讀</span>
          </div>
          {modules.map(([name, weight, data, comment]) => (
            <div className="method-row" role="row" key={name}>
              <strong>{name}</strong>
              <span>{weight}</span>
              <span>{data}</span>
              <span>{comment}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="weekly-grid">
        <article className="panel method-section">
          <h2>股票與 ETF 分開校準</h2>
          <p>
            個股需要更重視基本面、估值、籌碼與產業資料；ETF 則需要更重視成分股廣度、
            整體市場趨勢、折溢價、成交量與大盤風險。正式模型會分開校準，避免同一套權重套用所有標的。
          </p>
        </article>

        <article className="panel method-section">
          <h2>回測揭露原則</h2>
          <p>
            每個燈號都應揭露樣本期間、樣本數、20 日與 60 日平均報酬、勝率、最大回檔、
            是否含交易成本，以及是否存在存活者偏誤。
          </p>
        </article>
      </section>

      <section className="panel method-section">
        <h2>資料品質分級</h2>
        <div className="quality-grid">
          {qualityLevels.map(([level, text]) => (
            <article className="quality-card" key={level}>
              <strong>{level}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <article className="disclaimer">
        <h2>目前限制</h2>
        <p>
          目前版本仍使用 mock model 與合成報酬，適合驗證產品體驗，不適合作為真實投資模型。
          正式上線前必須接入真實資料、記錄模型版本，並完成回測揭露。
        </p>
      </article>

      <section className="method-guardrail-grid" aria-label="方法論使用邊界">
        <article>
          <h2>可以怎麼用</h2>
          <p>用來比較標的狀態、檢查風險是否升溫、安排閱讀順序與觀察清單。</p>
        </article>
        <article>
          <h2>不可以怎麼用</h2>
          <p>不能把燈號直接視為買進、賣出、加碼、減碼或任何形式的投資建議。</p>
        </article>
        <article>
          <h2>何時能升級</h2>
          <p>需完成真實資料來源、權利、資料品質、回測、法遵、投資與 CEO/董事長授權 gate。</p>
        </article>
      </section>

      <section className="panel method-links">
        <h2>理解方法後</h2>
        <TrustTextLink href="/" label="回首頁看 mock 覆蓋地圖" />
        <TrustTextLink href="/briefing" label="看每日晨報" />
        <TrustTextLink href="/weekly" label="看本週週報" />
        <TrustTextLink href="/disclaimer" label="確認免責聲明" />
        <TrustTextLink href="/terms" label="查看使用條款" />
      </section>
    </main>
  );
}

function MethodBridgeLink({
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
    <TrackedLink eventName="trust_link_clicked" href={href} label={title} payload={{ area: "methodology_application_bridge" }}>
      <span>{label}</span>
      <strong>{title}</strong>
      <p>{text}</p>
    </TrackedLink>
  );
}

function TrustTextLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink className="text-link" eventName="trust_link_clicked" href={href} label={label} payload={{ area: "methodology_next_links" }}>
      {label}
    </TrackedLink>
  );
}
