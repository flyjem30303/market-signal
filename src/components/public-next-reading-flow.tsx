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
    ariaLabel: "市場簡報下一步",
    body: "看完市場簡報後，可以回到總覽確認燈號，也可以進入個別標的頁查看細節。",
    eyebrow: "下一步",
    eventName: "briefing_link_clicked",
    title: "從市場總覽接到具體觀察"
  },
  home: {
    ariaLabel: "首頁下一步",
    body: "首頁先看整體市場氣氛，再進入市場簡報、個別標的或方法說明確認判讀方式。",
    eyebrow: "下一步",
    eventName: "home_cta_clicked",
    title: "用 30 秒建立市場第一印象"
  },
  stock: {
    ariaLabel: "個股頁下一步",
    body: "個股頁適合確認單一標的狀態；若要避免只看單點，建議回到簡報或總覽交叉檢查。",
    eyebrow: "下一步",
    eventName: "stock_link_clicked",
    title: "不要只看單一分數"
  },
  weekly: {
    ariaLabel: "週報下一步",
    body: "週報用來回看趨勢與變化，接著可回到首頁或簡報確認目前狀態。",
    eyebrow: "下一步",
    eventName: "weekly_link_clicked",
    title: "從回顧接回當前狀態"
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
      <nav className="experience-flow-nav" aria-label={`${copy.ariaLabel}導覽`}>
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
      { href: "/weekly", label: "市場週報", target: "weekly" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  if (context === "weekly") {
    return [
      { href: "/", label: "市場總覽", target: "home" },
      { href: "/briefing", label: "市場簡報", target: "briefing" },
      { href: stockHref, label: "標的燈號", target: "stock" },
      { href: "/methodology", label: "方法說明", target: "methodology" },
      { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
    ];
  }

  return [
    { href: "/briefing", label: "市場簡報", target: "briefing" },
    { href: "/weekly", label: "市場週報", target: "weekly" },
    { href: stockHref, label: "標的燈號", target: "stock" },
    { href: "/methodology", label: "方法說明", target: "methodology" },
    { href: "/disclaimer", label: "風險聲明", target: "disclaimer" }
  ];
}
