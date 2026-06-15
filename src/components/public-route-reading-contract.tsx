type PublicRouteReadingContractProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms";
};

const copy = {
  disclaimer: {
    eyebrow: "公開頁閱讀流程",
    title: "先看資料邊界，再理解風險聲明",
    body: "風險聲明的重點是協助使用者知道本站只做資訊整理與觀察輔助，不提供買賣建議。",
    next: "閱讀完風險聲明後，回到首頁或晨報時仍要先確認市場狀態、資料時間與下一步觀察。"
  },
  methodology: {
    eyebrow: "公開頁閱讀流程",
    title: "先理解燈號怎麼形成，再回到市場狀態",
    body: "方法說明頁用來解釋狀態、風險提醒與資料邊界，避免使用者把單一分數當成完整結論。",
    next: "讀完方法後，請回到首頁、晨報或標的頁，依照六個閱讀檢查點重新複核。"
  },
  privacy: {
    eyebrow: "公開頁閱讀流程",
    title: "先了解資料使用方式，再使用追蹤功能",
    body: "隱私頁說明網站如何處理基本使用資料；目前版本仍以公開閱讀與非登入體驗為主。",
    next: "閱讀後可回到市場頁面，依序看市場狀態、風險提醒、資料邊界與下一步觀察。"
  },
  terms: {
    eyebrow: "公開頁閱讀流程",
    title: "先確認使用條款，再閱讀市場提示",
    body: "條款頁提醒使用者，網站內容是資訊整理與風險辨識，不是交易工具或個人化投資建議。",
    next: "閱讀後可回到首頁或晨報，依照風險提醒與下一步觀察建立自己的檢查流程。"
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
  ["市場狀態", "先看目前是偏多、觀望、警戒或高風險，不急著做單一結論。"],
  ["風險提醒", "再看風險熱度、成因與是否有異常提示，避免只看分數。"],
  ["資料邊界", "確認資料時間、來源狀態、缺口與延遲說明，正式資料未啟用時要降低解讀信心。"],
  ["下一步觀察", "最後決定是關注、加強觀察或等待更多資料，而不是把頁面當成買賣建議。"]
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
        <p>六個閱讀檢查點：市場狀態、風險提醒、資料邊界、資料時間、原因說明、下一步觀察。</p>
        <p>原因會說明燈號為何偏綠、偏黃或偏紅；更新時間則協助判斷資料是否仍適合解讀。</p>
        <p>目標是協助使用者做出關注、加強觀察或等待更多資料的判斷。</p>
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
