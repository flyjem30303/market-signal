type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    eyebrow: "閱讀合約",
    title: "先確認風險，再回到燈號與資料狀態",
    body: "風險聲明協助你理解本網站的使用邊界：燈號是市場觀察工具，不是交易指令，也不取代個人判斷。",
    next: "看完風險後，可回到首頁確認目前燈號，再到方法說明理解分數來源。"
  },
  methodology: {
    eyebrow: "閱讀合約",
    title: "先理解分數用途，再看單一標的",
    body: "方法說明只解釋燈號如何整理趨勢、風險與資料狀態；它不是預測保證，也不是投資建議。",
    next: "看完方法後，可回到市場簡報或個別標的頁確認目前觀察順序。"
  },
  privacy: {
    eyebrow: "閱讀合約",
    title: "先確認資料使用邊界，再使用會員功能",
    body: "目前公開版不啟用會員登入與個人化資料保存。未來若開放會員功能，會先補上會員功能資料邊界。",
    next: "看完隱私說明後，可回到使用條款確認服務邊界。"
  },
  terms: {
    eyebrow: "閱讀合約",
    title: "先確認使用責任，再閱讀市場資訊",
    body: "使用條款說明網站提供資訊整理與風險辨識，不提供交易服務，也不替使用者做投資決策。",
    next: "看完條款後，可回到風險聲明確認非投資建議與自行承擔風險。"
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
  ["看燈號", "先確認市場或標的目前是偏多、觀望、警戒或高風險。"],
  ["看原因", "再查看分數背後的風險來源、資料更新時間與來源狀態。"],
  ["看邊界", "最後確認是否仍為示範資料，以及內容是否只適合作為觀察輔助。"],
  ["看下一步", "需要更多脈絡時，回到市場簡報、方法說明或風險聲明。"]
] as const;

export function PublicRouteReadingContract({ context }: PublicRouteReadingContractProps) {
  const item = copy[context];

  return (
    <section className="public-route-reading-contract" aria-label="公開頁閱讀順序">
      <div className="public-route-reading-contract__intro">
        <p className="eyebrow">{item.eyebrow}</p>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <p>{item.next}</p>
        <p>這個閱讀順序能避免只看單一分數或單一警示造成誤判。</p>
      </div>
      <div className="public-route-reading-contract__steps" aria-label="閱讀步驟">
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
