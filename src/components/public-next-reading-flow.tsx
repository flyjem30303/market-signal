import { TrackedLink } from "@/components/tracked-link";
import type { TrackingEventName } from "@/lib/tracking";

type PublicNextReadingFlowContext = "briefing" | "home" | "stock" | "weekly";

type PublicNextReadingFlowProps = {
  context: PublicNextReadingFlowContext;
  stockSymbol?: string;
};

type LinkItem = {
  href: string;
  label: string;
  target: string;
};

const contextCopy = {
  briefing: {
    ariaLabel: "晨報閱讀順序",
    body: "閱讀順序：先用市場總覽確認氣氛，再到指數狀態頁看成因，最後用週報、方法說明與風險聲明複核判斷邊界。",
    eyebrow: "下一步閱讀",
    eventName: "briefing_link_clicked",
    title: "從晨報接到指數狀態與風險複核"
  },
  home: {
    ariaLabel: "首頁下一步閱讀",
    body: "先看首頁市場氣氛，再進市場晨報看原因與行動判斷；需要回看脈絡時看週報，需要確認邊界時看方法說明與風險聲明。",
    eyebrow: "下一步閱讀",
    eventName: "home_cta_clicked",
    title: "從 30 秒市場氣氛走到 3 分鐘判斷"
  },
  stock: {
    ariaLabel: "標的下一步閱讀",
    body: "先看標的燈號與成因，再回市場晨報比較市場氣氛；需要週期脈絡看週報，需要確認燈號與資料邊界看方法說明與風險聲明。",
    eyebrow: "下一步閱讀",
    eventName: "stock_link_clicked",
    title: "把單一標的放回市場與資料邊界"
  },
  weekly: {
    ariaLabel: "週報閱讀順序",
    body: "閱讀順序：先回到市場總覽，再用今日簡報確認最新氣氛，接著看指數狀態、方法說明與風險揭露。",
    eyebrow: "下一步閱讀",
    eventName: "weekly_link_clicked",
    title: "從週報回到今日市場判斷"
  }
} satisfies Record<PublicNextReadingFlowContext, {
  ariaLabel: string;
  body: string;
  eyebrow: string;
  eventName: TrackingEventName;
  title: string;
}>;

export function PublicNextReadingFlow({ context, stockSymbol = "TWII" }: PublicNextReadingFlowProps) {
  const copy = contextCopy[context];
  const links = getLinks(context, stockSymbol);

  return (
    <section className="panel next-reading-panel" aria-label={copy.ariaLabel}>
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>
      <nav className="experience-flow-nav" aria-label={`${copy.ariaLabel}連結`}>
        <span>下一步</span>
        {links.map((link) => (
          <TrackedLink
            eventName={copy.eventName}
            href={link.href}
            key={`${context}-${link.href}`}
            label={link.label}
            payload={{ area: "experience_flow", context, target: link.target }}
          >
            {link.label}
          </TrackedLink>
        ))}
      </nav>
    </section>
  );
}

function getLinks(context: PublicNextReadingFlowContext, stockSymbol: string): LinkItem[] {
  const stockHref = `/stocks/${stockSymbol}`;

  if (context === "briefing") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: stockHref, label: "指數狀態", target: "stock" },
      { href: "/weekly", label: "週報", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "今日簡報", target: "briefing" },
      { href: stockHref, label: "指數狀態", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險揭露", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場晨報", target: "briefing" },
    { href: "/weekly", label: "週報", target: "weekly" },
    { href: stockHref, label: "指數狀態", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
