type RouteLocalTrustCopyPanelProps = {
  context: "disclaimer" | "methodology" | "privacy" | "terms" | "weekly";
};

const copyByContext = {
  disclaimer: {
    eyebrow: "Disclosure Summary",
    title: "目前公開內容僅供產品閱讀與風險理解",
    summary:
      "本網站目前仍是 mock-only Beta。畫面可能展示分數、燈號、摘要與資料新鮮度 metadata，但它們不是即時市場資料、完整覆蓋、正式模型結論或個人化投資建議。",
    points: [
      "publicDataSource=mock；scoreSource=mock 仍是公開頁狀態。",
      "資料可能缺漏、延遲、尚未驗證或只代表部分覆蓋；這是 missing/delayed data 風險。",
      "任何買賣、持有、避險或配置決策，都必須由使用者自行判斷並承擔風險；本頁維持 non-investment advice 邊界。"
    ]
  },
  methodology: {
    eyebrow: "Model Boundary",
    title: "方法論說明的是讀盤框架，不是保證結果",
    summary:
      "目前分數與指標用於展示決策輔助流程。它們會受資料來源、缺漏、延遲、模型假設與覆蓋率影響，不能被解讀為預測、保證績效或正式投資建議。",
    points: [
      "模型輸出仍是 mock score，尚未通過 real promotion gate。",
      "資料新鮮度代表 metadata / readiness，不等於即時行情已上線。",
      "正式切到 real 前，source rights、coverage、quality、rollback 與 post-run review 都要通過。"
    ]
  },
  privacy: {
    eyebrow: "Privacy Boundary",
    title: "公開頁不應輸入機密，也不展示原始資料 payload",
    summary:
      "目前公開體驗維持 mock 顯示。使用者不需要在公開頁輸入 Supabase key、券商帳密、付款資訊或其他機密；公開頁也不應揭露 raw market payload、row payload 或 stock id payload。",
    points: [
      "瀏覽器端只保留必要的體驗與分析狀態，不承諾保存投資紀錄。",
      "資料來源、寫入與讀回流程由後端 gate 管控，不在公開頁輸出秘密或原始列資料。",
      "若未來加入帳號或付費功能，需要另行補齊隱私、資料保存與刪除政策。"
    ]
  },
  terms: {
    eyebrow: "Terms Summary",
    title: "請把目前網站視為 mock Beta 決策輔助介面",
    summary:
      "目前網站可用來理解功能流程、讀盤框架與風險揭露，但不代表真實資料已完整上線，也不代表任何資料商授權、模型績效或投資建議已被核准。",
    points: [
      "公開頁不得宣稱 complete coverage、validated forecast 或 scoreSource=real。",
      "若資料缺漏、延遲、不可用或來源權利未完成，系統應降低信心或保留 mock 狀態。",
      "使用者應自行確認資訊來源、風險承受度與交易決策。"
    ]
  },
  weekly: {
    eyebrow: "Weekly Reading Boundary",
    title: "週報是產品流程示範，不是即時市場結論",
    summary:
      "週報目前用 mock signal 串起市場、ETF、產業與風險的閱讀流程。它可以幫助理解未來產品怎麼呈現，但不能當成即時行情、完整市場覆蓋或買賣建議。",
    points: [
      "週報 cadence 仍依 mock 資料與 freshness metadata 呈現。",
      "coverage 仍是 partial coverage / readiness，缺漏或延遲資料可能影響解讀。",
      "正式週報上線前，需要資料覆蓋、source rights、品質分級、rollback 與 post-run review 通過。"
    ]
  }
} as const;

export function RouteLocalTrustCopyPanel({ context }: RouteLocalTrustCopyPanelProps) {
  const copy = copyByContext[context];

  return (
    <section className="route-local-trust-copy panel" aria-label={`${copy.eyebrow} route trust copy`}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.summary}</p>
      </div>
      <div className="route-local-trust-copy-grid">
        {copy.points.map((point) => (
          <article key={point}>
            <span>Launch Boundary</span>
            <p>{point}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
