type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    eyebrow: "閱讀流程",
    title: "把風險聲明放回市場判斷流程",
    body: "使用者看完風險聲明後，應回到燈號、成因、更新時間與資料邊界一起判斷，不把單一分數當成交易指令。",
    next: "回到首頁或市場簡報，先看目前市場狀態，再確認是否需要加強觀察。"
  },
  methodology: {
    eyebrow: "閱讀流程",
    title: "用同一套順序閱讀每個燈號",
    body: "方法頁負責說明燈號如何形成；正式判斷仍要回到市場狀態、原因、更新時間、風險提醒與資料邊界。",
    next: "看完方法後，回到首頁或市場簡報，用同一套順序檢查目前市場。"
  },
  privacy: {
    eyebrow: "閱讀流程",
    title: "隱私頁說明資料使用，不改變市場判斷邊界",
    body: "隱私說明讓使用者知道網站目前不需要交易帳戶或金融授權；市場判斷仍應依照燈號、原因、更新時間與資料邊界閱讀。",
    next: "若未來會員功能開放，仍會先說明資料蒐集範圍，再讓使用者建立追蹤。"
  },
  terms: {
    eyebrow: "閱讀流程",
    title: "使用條款先定義本網站能做與不能做的事",
    body: "條款頁確認本站是資訊整理與風險辨識工具；使用者仍要回到市場狀態、原因、更新時間與資料邊界做自主判斷。",
    next: "接受條款邊界後，再回到首頁、簡報或週報建立觀察清單。"
  }
} satisfies Record<PublicRouteReadingContractProps["context"], {
  body: string;
  eyebrow: string;
  next: string;
  title: string;
}>;

const steps = [
  ["市場狀態", "先看目前偏多、觀望、警戒或高風險。"],
  ["原因", "再看燈號背後的主要成因與警示來源。"],
  ["更新時間", "確認資料更新時間與是否可能延遲。"],
  ["風險提醒", "判斷是否需要降低解讀信心或加強複核。"],
  ["資料邊界", "確認目前是否仍為示範資料與示範分數。"],
  ["下一步觀察", "最後決定要關注、加強觀察或等待更多資料。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="公開頁閱讀流程">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">{item.eyebrow}</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <p>{item.next}</p>
      </div>
      <div className="public-route-reading-contract__steps" aria-label="六個閱讀檢查點">
        {steps.map(([title, body]) => (
          <article key={title}>
            <strong>{title}</strong>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
