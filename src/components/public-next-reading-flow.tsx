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
    ariaLabel: "市場快報下一步",
    body: "讀完快報後，可以回首頁確認總覽，或進入標的頁看單一標的的燈號與風險。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "從 30 秒快讀進到 3 分鐘觀察"
  },
  home: {
    ariaLabel: "首頁下一步",
    body: "首頁先看市場氛圍，再進入快報、週報或標的頁確認原因與更新時間。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "先看總覽，再看原因"
  },
  stock: {
    ariaLabel: "標的頁下一步",
    body: "看完單一標的後，可以回市場快報確認整體氛圍，避免只用單一標的判斷。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "把標的放回市場脈絡"
  },
  weekly: {
    ariaLabel: "週報下一步",
    body: "週報整理較長時間的觀察重點，下一步可回首頁或進入快報確認最新狀態。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "用週報補足時間脈絡"
  }
} satisfies Record<
  PublicNextReadingFlowContext,
  {
    ariaLabel: string;
    body: string;
    eyebrow: string;
    eventName: TrackingEventName;
    title: string;
  }
>;

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
        <span>建議閱讀</span>
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
      { href: stockHref, label: "標的燈號", target: "stock" },
      { href: "/weekly", label: "週報", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場快報", target: "briefing" },
      { href: stockHref, label: "標的燈號", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場快報", target: "briefing" },
    { href: "/weekly", label: "週報", target: "weekly" },
    { href: stockHref, label: "標的燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
