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
    ariaLabel: "市場快報延伸閱讀",
    body: "看完快報後，可以回到總覽、標的燈號或方法說明，確認資料時間與燈號邏輯。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "把快報接成完整觀察流程"
  },
  home: {
    ariaLabel: "首頁延伸閱讀",
    body: "先用首頁掌握市場氛圍，再進一步查看快報、標的燈號與方法說明。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "從總覽進入更完整的觀察流程"
  },
  stock: {
    ariaLabel: "標的頁延伸閱讀",
    body: "標的燈號適合搭配市場快報與方法說明一起閱讀，避免只看單一分數。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "回到市場脈絡中理解標的"
  },
  weekly: {
    ariaLabel: "週報延伸閱讀",
    body: "週報適合回看趨勢與風險變化，再連回市場快報與標的燈號追蹤。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "把本週變化接到每日觀察"
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
        <span>建議閱讀順序</span>
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
      { href: "/weekly", label: "週報回顧", target: "weekly" },
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
    { href: "/weekly", label: "週報回顧", target: "weekly" },
    { href: stockHref, label: "標的燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
