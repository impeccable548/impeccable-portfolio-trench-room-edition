import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, LineChart, ShoppingCart, Send } from "lucide-react";
import token from "@/assets/pattern-token.png.asset.json";
import glitch from "@/assets/pattern-glitch.jpg";

const CA = "336wdKkmBGH8SSjmEvW7NdGWWn33Jm8FqiYBcxuEpump";
const PAIR = "BvHkaiMYRk6nhzDLQTGJJgrXtaj9CnBH7DAPLTgn1oN1";
const PUMP_URL = `https://pump.fun/coin/${CA}`;
const DEX_URL = `https://dexscreener.com/solana/${PAIR}`;
const X_URL = "https://x.com/patternrecoggni";
const TG_URL = "https://t.me/patternrecognitionportal";
const OG_IMAGE = `https://dexscreener.com/token-images/og/solana/${CA}`;

const TITLE = "$PATTERN — The Pattern Is Clear Now";
const DESC =
  "Pattern Recognition on Solana. Live chart, real-time stats, verified contract and the community that saw it coming.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: Index,
});

type Pair = {
  priceUsd?: string;
  marketCap?: number;
  fdv?: number;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  txns?: { h24?: { buys: number; sells: number } };
};

function useCopy(value: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [value]);
  return { copied, copy };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        transition: "opacity 600ms ease, transform 600ms cubic-bezier(.2,.9,.2,1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

const usd = (n?: number) =>
  typeof n === "number"
    ? "$" + (n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + "M" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toFixed(0))
    : "—";

function useTokenStats() {
  return useQuery({
    queryKey: ["pattern-stats"],
    queryFn: async (): Promise<Pair | null> => {
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CA}`);
      if (!res.ok) throw new Error("failed");
      const json = (await res.json()) as { pairs?: Pair[] };
      return json.pairs?.[0] ?? null;
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
}

function Index() {
  const { copied, copy } = useCopy(CA);
  const [scrolled, setScrolled] = useState(false);
  const { data, isLoading } = useTokenStats();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shortCA = `${CA.slice(0, 6)}…${CA.slice(-6)}`;
  const change = data?.priceChange?.h24;
  const price = data?.priceUsd ? `$${Number(data.priceUsd).toPrecision(3)}` : "—";
  const txns = data?.txns?.h24 ? data.txns.h24.buys + data.txns.h24.sells : undefined;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAV */}
      <nav className={`sticky top-0 z-50 border-b-[3px] border-ink bg-bone transition-shadow ${scrolled ? "brut-shadow-sm" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a href="#top" className="flex items-center gap-2">
            <div className="brut-border h-9 w-9 bg-signal bg-dots" />
            <span className="font-display text-lg tracking-tight">$PATTERN</span>
          </a>

          <div className="hidden md:flex items-center gap-6 font-mono text-sm">
            <a href="#chart" className="hover:text-signal-dim transition-colors">Chart</a>
            <a href="#contract" className="hover:text-signal-dim transition-colors">Contract</a>
            <a href="#pattern" className="hover:text-signal-dim transition-colors">The Pattern</a>
            <a href="#community" className="hover:text-signal-dim transition-colors">Community</a>
          </div>

          <button
            onClick={copy}
            className="brut-border brut-press flex items-center gap-2 bg-ink px-3 py-2 font-mono text-xs text-bone hover:-translate-y-0.5 hover:brut-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span className="hidden sm:inline">{copied ? "Copied" : shortCA}</span>
            <span className="sm:hidden">{copied ? "Copied" : "CA"}</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden border-b-[3px] border-ink bg-grid">
        <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-40" />
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-5 md:gap-8 md:px-8 md:py-24 relative">
          <div className="md:col-span-3">
            <Reveal>
              <div className="brut-border inline-flex items-center gap-2 bg-bone px-3 py-1 font-mono text-xs uppercase tracking-widest">
                <span className="inline-block h-2 w-2 bg-signal animate-blink" /> Signal detected · Solana
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[15.5vw] leading-[0.85] tracking-tight md:text-[6rem] lg:text-[7.5rem] animate-glitch">$PATTERN</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl font-display text-2xl leading-tight md:text-4xl">
                The Pattern Is <span className="bg-signal px-2">Clear Now</span>.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-5 max-w-lg font-sans text-base text-slate-warm md:text-lg">
                Everything repeats. Most people never see it. A few do — and eventually stop
                just watching. Pattern Recognition, on chain.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={PUMP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="brut-border brut-shadow brut-press inline-flex items-center gap-2 bg-signal px-6 py-4 font-display text-lg text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brut-shadow-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
                >
                  <ShoppingCart size={20} strokeWidth={3} />
                  Buy on Pump.fun
                </a>
                <a
                  href={DEX_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="brut-border brut-shadow brut-press inline-flex items-center gap-2 bg-bone px-6 py-4 font-display text-lg text-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brut-shadow-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
                >
                  <LineChart size={20} strokeWidth={3} />
                  View Chart
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-2">
            <Reveal delay={120}>
              <div className="relative mx-auto w-full max-w-md">
                <div className="brut-border-4 brut-shadow-lg bg-ink p-2 relative overflow-hidden">
                  <img src={token.url} alt="Pattern Recognition token artwork" width={800} height={800} className="block h-auto w-full" />
                  <div className="pointer-events-none absolute inset-0 bg-scanlines opacity-30" />
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-signal/25 animate-scan" />
                </div>
                <div className="brut-border absolute -bottom-4 -left-4 bg-ink px-3 py-1 font-mono text-xs text-bone rotate-[-3deg]">
                  observed
                </div>
                <div className="brut-border absolute -top-4 -right-4 bg-bone px-3 py-1 font-mono text-xs rotate-[5deg]">
                  {typeof change === "number" ? `${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}% 24h` : "on chain"}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t-[3px] border-ink bg-ink py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee font-display text-bone text-2xl">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center">
                {["RECOGNIZE THE PATTERN", "IT REPEATS", "I'VE BEEN WATCHING", "NOW I'M ACTING", "$PATTERN"].map((t) => (
                  <span key={t} className="mx-8 flex items-center gap-8">
                    {t}
                    <span className="text-signal">▚</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART + STATS */}
      <section id="chart" className="border-b-[3px] border-ink">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <SectionHeader kicker="02 — Signal" title="Live Chart & Stats" />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 brut-border-4 brut-shadow-lg bg-bone">
              <div className="flex items-center justify-between border-b-[3px] border-ink bg-ink px-4 py-2 font-mono text-xs text-bone">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-signal animate-blink" />
                  Dexscreener chart embed / SOL / PATTERN
                </span>
                <a href={DEX_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-signal">
                  Open <ExternalLink size={12} />
                </a>
              </div>
              <div className="aspect-[4/5] w-full bg-muted sm:aspect-[16/9]">
                <iframe
                  title="Dexscreener chart embed"
                  src={`https://dexscreener.com/solana/${PAIR}?embed=1&theme=light&trades=0&info=0`}
                  loading="lazy"
                  className="h-full w-full border-0"
                />
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={140}><StatCard label="Price" value={price} loading={isLoading} /></Reveal>
            <Reveal delay={180}><StatCard label="Market Cap" value={usd(data?.marketCap ?? data?.fdv)} loading={isLoading} accent /></Reveal>
            <Reveal delay={220}><StatCard label="24h Volume" value={usd(data?.volume?.h24)} loading={isLoading} /></Reveal>
            <Reveal delay={260}><StatCard label="Liquidity" value={usd(data?.liquidity?.usd)} loading={isLoading} /></Reveal>
            <Reveal delay={300}><StatCard label="24h Change" value={typeof change === "number" ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%` : "—"} loading={isLoading} /></Reveal>
            <Reveal delay={340}><StatCard label="24h Txns" value={txns ? txns.toLocaleString() : "—"} loading={isLoading} /></Reveal>
          </div>

          <Reveal delay={380}>
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-slate-warm">
              Live market data via Dexscreener · refreshes every 30s
            </p>
          </Reveal>
        </div>
      </section>

      {/* CONTRACT */}
      <section id="contract" className="border-b-[3px] border-ink bg-signal">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest">03 — Verify</div>
                <h2 className="mt-2 font-display text-4xl leading-none md:text-6xl">Contract Address</h2>
              </div>
              <p className="font-mono text-sm max-w-sm">
                One contract. Check it every time. Patterns hold — impostors don't.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 brut-border-4 brut-shadow-lg bg-bone">
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4 md:p-5">
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm md:text-base text-ink">{CA}</code>
                <button
                  onClick={copy}
                  className="brut-border brut-press flex shrink-0 items-center justify-center gap-2 bg-ink px-5 py-3 font-display text-bone hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brut-shadow-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  {copied ? <><Check size={16} strokeWidth={3} /> Copied</> : <><Copy size={16} strokeWidth={3} /> Copy CA</>}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* THE PATTERN */}
      <section id="pattern" className="border-b-[3px] border-ink bg-ink text-bone">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-signal">04 — Thesis</div>
                <h2 className="mt-2 font-display text-5xl leading-none md:text-7xl">The Pattern</h2>
              </div>
              <div className="h-[3px] w-24 bg-bone md:w-40" />
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <Reveal delay={80} className="md:col-span-7">
              <div className="space-y-6 font-sans text-lg leading-relaxed md:text-xl">
                <p>
                  It started as a habit: watching. The same setups, the same crowds, the same
                  moves — over and over, in different costumes. Once you see it once, you can't
                  unsee it.
                </p>
                <p>
                  The account was never the point. Pattern recognition is bigger than one
                  handle, one timeline, one call. It's a way of reading everything.
                </p>
                <p className="font-display text-2xl leading-tight text-signal md:text-3xl">
                  I've been watching long enough. Now I'm acting.
                </p>
                <p className="font-mono text-sm text-bone/60">
                  $PATTERN is the community version of that idea — no promises, no roadmap.
                  Just the people who saw it too.
                </p>
              </div>
            </Reveal>
            <Reveal delay={160} className="md:col-span-5">
              <div className="brut-border-4 brut-shadow-signal bg-bone p-2">
                <img
                  src={glitch}
                  alt="Abstract glitch grid motif representing pattern recognition"
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="block h-auto w-full"
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="brut-border h-16 bg-bone bg-dots" />
                <div className="brut-border h-16 bg-signal bg-scanlines" />
                <div className="brut-border h-16 bg-bone bg-diag" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="border-b-[3px] border-ink bg-grid">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <SectionHeader kicker="05 — Network" title="Join The Watchers" />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:max-w-3xl">
            <Reveal delay={80}>
              <SocialCard href={X_URL} title="X / Twitter" handle="@patternrecoggni" icon={<XIcon />} />
            </Reveal>
            <Reveal delay={140}>
              <SocialCard href={TG_URL} title="Telegram" handle="/patternrecognitionportal" icon={<Send size={26} strokeWidth={3} />} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bone">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="brut-border h-9 w-9 bg-signal bg-dots" />
              <span className="font-display text-lg">$PATTERN</span>
            </div>
            <p className="max-w-xl font-mono text-xs leading-relaxed text-slate-warm">
              $PATTERN is a community meme coin with no intrinsic value or expectation of
              financial return. Nothing on this site is financial advice. Do your own research.
              Crypto is volatile and you may lose everything.
            </p>
            <div className="font-mono text-xs text-slate-warm">© {new Date().getFullYear()} — Recognize the pattern.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="font-mono text-xs uppercase tracking-widest text-slate-warm">{kicker}</div>
        <h2 className="mt-2 font-display text-5xl leading-none md:text-7xl">{title}</h2>
      </div>
      <div className="h-[3px] w-24 bg-ink md:w-40" />
    </div>
  );
}

function StatCard({ label, value, accent, loading }: { label: string; value: string; accent?: boolean; loading?: boolean }) {
  return (
    <div className={`brut-border-4 brut-shadow brut-press flex h-full flex-col justify-between gap-4 px-5 py-6 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brut-shadow-lg ${accent ? "bg-signal" : "bg-bone"}`}>
      <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
      <span className={`font-display text-3xl leading-none ${loading ? "opacity-40" : ""}`}>{loading ? "…" : value}</span>
    </div>
  );
}

function SocialCard({ href, title, handle, icon }: { href: string; title: string; handle: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="brut-border-4 brut-shadow brut-press group block h-full bg-bone p-6 hover:-translate-x-1 hover:-translate-y-1 hover:brut-shadow-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
    >
      <div className="flex items-center justify-between">
        <div className="brut-border flex h-14 w-14 items-center justify-center bg-signal text-ink">{icon}</div>
        <ExternalLink size={18} strokeWidth={3} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-6 font-display text-2xl">{title}</div>
      <div className="mt-1 font-mono text-xs text-slate-warm">{handle}</div>
    </a>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.945l-4.79-6.26L4.7 22H2l7-8L2 2h7.08l4.35 5.75L18.244 2Zm-1.22 18h1.63L7.06 4H5.31l11.714 16Z" />
    </svg>
  );
}
