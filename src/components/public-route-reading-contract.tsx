type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    eyebrow: "風險閱讀順序",
    title: "先理解用途，再使用燈號",
    body: "指數燈號整理市場資訊與風險線索，目的是協助使用者建立觀察順序，不是替任何人做投資決策。",
    next: "閱讀任何燈號時，請先看資料更新時間、來源狀態與風險聲明，再決定是否需要加強觀察。"
  },
  methodology: {
    eyebrow: "方法閱讀順序",
    title: "燈號是摘要，不是單一答案",
    body: "方法說明會把分數、趨勢、風險與資料狀態拆開，讓使用者知道燈號如何形成，也知道哪些地方還需要複核。",
    next: "建議先看市場主燈號，再看成因與資料狀態，最後回到個別標的頁確認細節。"
  },
  privacy: {
    eyebrow: "資料閱讀順序",
    title: "先公開總覽，後續才擴充會員資料",
    body: "目前公開頁以市場資訊展示為主；未來會員功能若加入自選追蹤與提醒，會把資料用途、保存範圍與刪除方式寫清楚。",
    next: "在會員功能正式開放前，任何個人化資料流程都應維持最小化與可說明。"
  },
  terms: {
    eyebrow: "使用閱讀順序",
    title: "可以用來觀察市場，不能用來取代判斷",
    body: "使用者可以用本站做市場觀察與風險辨識，但仍需自行判斷並承擔投資決策結果。",
    next: "重要決策前請自行確認資料來源、更新時間、風險與個人情況。"
  }
} satisfies Record<
  PublicRouteReadingContractProps["context"],
  {
    body: string;
    eyebrow: string;
    next: string;
    title: string;
  }
>;

const steps = [
  ["市場狀態", "先確認市場目前偏多、觀望、警戒或高風險。"],
  ["原因", "再確認是趨勢、成交量、波動或資料狀態造成變化。"],
  ["風險提醒", "判斷是否需要關注、加強觀察或等待更多資料。"],
  ["資料邊界", "確認資料更新時間與可能延遲，避免把舊資料當作即時訊號。"],
  ["下一步觀察", "回到市場總覽、晨報、週報或個別標的頁複核。"],
  ["使用邊界", "所有內容都是資訊整理與風險辨識，不是買賣建議。"]
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
        <p>四步閱讀流程先看市場狀態、原因、風險提醒與資料邊界；公開頁也補上下一步觀察、資訊輔助與使用邊界，避免把燈號誤讀成買賣建議。</p>
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
