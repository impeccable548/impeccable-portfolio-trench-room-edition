import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Gauge, Layers, PackageCheck, Send } from "lucide-react";
import shotJimothy from "@/assets/case-jimothy.jpg.asset.json";
import shotCalldog from "@/assets/case-calldog.jpg.asset.json";
import shotPattern from "@/assets/case-pattern.jpg.asset.json";
import shotTomochi from "@/assets/case-tomochi.jpg.asset.json";
import avatar from "@/assets/impeccable-avatar.jpg.asset.json";

const X_URL = "https://x.com/impeccable_477";
const X_HANDLE = "@impeccable_477";
const TG_URL = "https://t.me/Impecc_able";

const TITLE = "Impeccable — Web3 Full-Stack Developer & Landing Page Builder";
const DESC =
  "Impeccable builds fast, polished landing pages, hubs and tooling for Solana token projects, plus full-stack web apps and trading bots. Concepts shipped in hours.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: Index,
});

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: "opacity 720ms ease, transform 720ms cubic-bezier(.2,.9,.2,1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(22px)",
      }}
    >
      {children}
    </div>
  );
}

type Project = {
  name: string;
  ticker: string;
  concept: string;
  style: string;
  tags: string[];
  shot: string;
};

const PROJECTS: Project[] = [
  {
    name: "Jimothy The Raccoon",
    ticker: "$JIMOTHY",
    concept: "Homepage + live chart hub for a viral Seattle raccoon meme coin.",
    style: "Neubrutalist — thick black borders, hard offset shadows, earthy charcoal & orange.",
    tags: ["Brutalist", "Landing page", "Live chart"],
    shot: shotJimothy.url,
  },
  {
    name: "CALLDOG",
    ticker: "$CALLDOG",
    concept: "Community hub with real-time market stats for a dog-themed Solana coin.",
    style: "Neubrutalist — tan, black and a loud orange accent, raw grid rhythm.",
    tags: ["Brutalist", "Realtime stats", "Community"],
    shot: shotCalldog.url,
  },
  {
    name: "Pattern Recognition",
    ticker: "$PATTERN",
    concept: "Signal-themed hub built around a creator's 'recognize the pattern' narrative.",
    style: "Brutalist with scanline, grid and glitch motifs — bone, black, forest green + amber.",
    tags: ["Brutalist", "Motion", "Narrative"],
    shot: shotPattern.url,
  },
  {
    name: "Tomochi",
    ticker: "$tomochi",
    concept: "Character-IP hub for an 18-month-old brand with 130K+ cross-platform reach.",
    style: "Soft kawaii — pastel palette, rounded cards, gentle shadows and float animation.",
    tags: ["Kawaii", "Character IP", "Gallery"],
    shot: shotTomochi.url,
  },
];

const VALUES = [
  {
    icon: Gauge,
    title: "Fast turnaround",
    body: "Full concepts designed and shipped in hours, not weeks. You see a live, working site the same day you brief me — momentum matters most when a project is trending.",
  },
  {
    icon: Layers,
    title: "Tailored per project",
    body: "No template reuse. Brutalist, kawaii, minimal or something else — the design is pulled from your brand, token art and community tone, so it never looks recycled.",
  },
  {
    icon: PackageCheck,
    title: "Clean handoff",
    body: "You get the full codebase and complete ownership: typed React, semantic tokens, responsive down to small phones, and metadata set up for sharing.",
  },
];

function Index() {
  const [copied, setCopied] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyHandle = useCallback(() => {
    navigator.clipboard.writeText(X_HANDLE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* NAV */}
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
          scrolled ? "border-hairline bg-background/85 backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <a href="#top" className="group flex items-center gap-2.5">
            <img
              src={avatar.url}
              alt="Impeccable avatar"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-hairline transition group-hover:ring-primary/60"
            />
            <span className="font-display text-base font-bold tracking-tight">Impeccable</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {[
              ["About", "#about"],
              ["Work", "#work"],
              ["Why me", "#why"],
              ["Contact", "#contact"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="lift hover:text-foreground">
                {label}
              </a>
            ))}
          </nav>

          <button
            onClick={copyHandle}
            className="lift flex items-center gap-2 rounded-full border border-hairline bg-surface px-3.5 py-2 font-mono text-xs text-muted-foreground hover:border-primary/60 hover:text-foreground"
          >
            {copied ? <Check size={13} className="text-primary" /> : <Copy size={13} />}
            <span className="hidden sm:inline">{copied ? "Copied" : X_HANDLE}</span>
            <span className="sm:hidden">{copied ? "Copied" : "@"}</span>
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-40" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[460px]"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, var(--signal) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
          <div className="animate-rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
              Available for new builds
            </span>
          </div>

          <h1 className="mt-7 font-display text-[clamp(3rem,12vw,7.5rem)] font-bold leading-[0.92] tracking-[-0.045em]">
            Impeccable
          </h1>

          <p className="mt-6 max-w-2xl text-balance-tight text-lg leading-relaxed text-muted-foreground md:text-2xl">
            Full-stack web3 developer shipping{" "}
            <span className="text-foreground">fast, polished landing pages, hubs and tooling</span> for
            Solana projects — designed to match your brand, live the same day.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="lift inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 font-display text-base font-semibold text-primary-foreground hover:-translate-y-0.5 hover:glow-ring"
            >
              <XIcon /> Get in touch on X
            </a>
            <a
              href="#work"
              className="lift inline-flex items-center gap-2 rounded-full border border-hairline bg-surface px-6 py-3.5 font-display text-base font-semibold hover:-translate-y-0.5 hover:border-primary/50"
            >
              See the work <ArrowUpRight size={17} />
            </a>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-4">
            {[
              ["4+", "Projects shipped"],
              ["< 24h", "Concept to live"],
              ["100%", "Code ownership"],
              ["Solana", "Ecosystem focus"],
            ].map(([k, v]) => (
              <div key={v} className="bg-surface px-5 py-6">
                <dt className="font-display text-2xl font-bold tracking-tight md:text-3xl">{k}</dt>
                <dd className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="overflow-hidden border-y border-hairline py-3">
          <div className="flex w-max animate-marquee-x whitespace-nowrap font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0">
                {[
                  "Landing pages",
                  "Token hubs",
                  "Realtime market data",
                  "Trading bots",
                  "Full-stack web apps",
                  "Design systems",
                ].map((t) => (
                  <span key={t} className="mx-6 flex items-center gap-6">
                    {t} <span className="text-primary">/</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" kicker="01 — About" title="Built for projects that move fast">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                I'm <span className="text-foreground">Impeccable</span>, a full-stack web3 developer
                working across the Solana ecosystem — landing pages and community hubs for token
                projects, ecosystem tooling, dashboards, and trading bots.
              </p>
              <p>
                My work sits where design and engineering meet: real-time market data wired into an
                interface that actually looks like it belongs to a funded project, not a template
                with a logo dropped in.
              </p>
              <p className="text-foreground">
                I adapt the design style to the brand — brutalist, kawaii, minimal, whatever the
                community's tone calls for — instead of forcing one aesthetic onto every project.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} className="md:col-span-5">
            <div className="panel p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Stack & services
              </div>
              <ul className="mt-5 space-y-3.5">
                {[
                  "React, TypeScript, Tailwind",
                  "Node, APIs, realtime data feeds",
                  "Dexscreener / on-chain integrations",
                  "Trading bots & automation",
                  "Responsive, mobile-first builds",
                  "SEO, metadata & social previews",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* WORK */}
      <Section id="work" kicker="02 — Selected work" title="Case studies">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <article className="lift group h-full overflow-hidden rounded-xl border border-hairline bg-surface hover:-translate-y-1.5 hover:border-primary/40">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-hairline">
                  <img
                    src={p.shot}
                    alt={`${p.name} website homepage designed and built by Impeccable`}
                    loading="lazy"
                    width={1440}
                    height={900}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-bold tracking-tight">{p.name}</h3>
                      <div className="mt-1 font-mono text-xs text-primary">{p.ticker}</div>
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="mt-1 shrink-0 text-muted-foreground opacity-40 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.concept}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground/80">{p.style}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-hairline bg-surface-2 px-3 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* WHY */}
      <Section id="why" kicker="03 — Why work with me" title="Speed, without the template smell">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 100}>
              <div className="lift h-full rounded-xl border border-hairline bg-surface p-7 hover:-translate-y-1.5 hover:border-primary/40">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-hairline bg-surface-2 text-primary">
                  <v.icon size={20} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <section id="contact" className="relative overflow-hidden border-t border-hairline">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-30" />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[380px]"
          style={{
            background:
              "radial-gradient(55% 100% at 50% 100%, color-mix(in oklab, var(--signal) 20%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:px-8 md:py-32">
          <Reveal>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              04 — Contact
            </div>
            <h2 className="mx-auto mt-5 max-w-3xl text-balance-tight font-display text-[clamp(2rem,6vw,3.75rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Got a project that needs to be live today?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Send me a DM with your token, brand or idea. I'll come back with a direction — and
              usually a working page.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                className="lift inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-4 font-display text-base font-semibold text-primary-foreground hover:-translate-y-0.5 hover:glow-ring"
              >
                <XIcon /> {X_HANDLE}
              </a>
              <a
                href={TG_URL}
                target="_blank"
                rel="noreferrer"
                className="lift inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface px-7 py-4 font-display text-base font-semibold hover:-translate-y-0.5 hover:border-primary/50"
              >
                <Send size={18} /> Telegram
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex items-center gap-2.5">
            <img
              src={avatar.url}
              alt="Impeccable avatar"
              width={28}
              height={28}
              className="h-7 w-7 rounded-full object-cover ring-1 ring-hairline"
            />
            <span className="font-display text-sm font-bold tracking-tight">Impeccable</span>
          </div>
          <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
            Independent developer. Project names and tickers shown are client work and are not
            endorsements. Nothing on this site is financial advice.
          </p>
          <div className="font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} Impeccable
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
      <Reveal>
        <div className="flex flex-col gap-4 border-b border-hairline pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {kicker}
            </div>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.035em]">
              {title}
            </h2>
          </div>
          <div className="h-px w-16 bg-primary md:w-24" />
        </div>
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.945l-4.79-6.26L4.7 22H2l7-8L2 2h7.08l4.35 5.75L18.244 2Zm-1.22 18h1.63L7.06 4H5.31l11.714 16Z" />
    </svg>
  );
}
