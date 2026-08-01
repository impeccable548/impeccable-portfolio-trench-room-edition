import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, LineChart, ShoppingCart, Users } from "lucide-react";
import mascot from "@/assets/calldog-mascot.jpg";

const CA = "AF2DcASwJcXPUGtJhXsmHZupFh9BargcehnxiD8GVbd8";
const PAIR = "J3KKzfyLQ7MYjFvayKGgCDtxbPYRfhPcynEXPcu3eYGS";
const PUMP_URL = `https://pump.fun/coin/${CA}`;
const DEX_URL = `https://dexscreener.com/solana/${PAIR}`;
const X_URL = "https://x.com/CallDogONSOLANA";
const OG_IMAGE = `https://dexscreener.com/token-images/og/solana/${CA}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "$CALLDOG — Hello Yes This Is Dog" },
      { name: "description", content: "The dog-themed community coin on Solana. Live chart, verified contract, real-time stats and a loud 1300+ member X community." },
      { property: "og:title", content: "$CALLDOG — Hello Yes This Is Dog" },
      { property: "og:description", content: "The dog-themed community coin on Solana. Live chart, verified contract, real-time stats and a loud 1300+ member X community." },
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
    queryKey: ["calldog-stats"],
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
      <nav className={`sticky top-0 z-50 border-b-[3px] border-charcoal bg-cream transition-shadow ${scrolled ? "brut-shadow-sm" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a href="#top" className="flex items-center gap-2">
            <div className="brut-border h-9 w-9 bg-accent-orange flex items-center justify-center font-display text-charcoal">C</div>
            <span className="font-display text-lg tracking-tight">$CALLDOG</span>
          </a>

          <div className="hidden md:flex items-center gap-6 font-mono text-sm">
            <a href="#chart" className="hover:text-accent-orange transition-colors">Chart</a>
            <a href="#contract" className="hover:text-accent-orange transition-colors">Contract</a>
            <a href="#stats" className="hover:text-accent-orange transition-colors">Stats</a>
            <a href="#community" className="hover:text-accent-orange transition-colors">Community</a>
          </div>

          <button
            onClick={copy}
            className="brut-border brut-press flex items-center gap-2 bg-charcoal px-3 py-2 font-mono text-xs text-cream hover:-translate-y-0.5 hover:brut-shadow-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span className="hidden sm:inline">{copied ? "Copied" : shortCA}</span>
            <span className="sm:hidden">{copied ? "Copied" : "CA"}</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden border-b-[3px] border-charcoal bg-grid">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 md:grid-cols-5 md:gap-6 md:px-8 md:py-24">
          <div className="md:col-span-3">
            <Reveal>
              <div className="brut-border inline-flex items-center gap-2 bg-cream px-3 py-1 font-mono text-xs uppercase tracking-widest">
                <span className="inline-block h-2 w-2 bg-accent-orange animate-pulse" /> Live on Solana
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[15vw] leading-[0.85] tracking-tight md:text-[9rem]">$CALLDOG</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl font-display text-2xl leading-tight md:text-4xl">
                Hello Yes <span className="bg-accent-orange px-2">This Is Dog</span>.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-5 max-w-lg font-sans text-base text-brown-dark md:text-lg">
                One dog. One number. A pack that never stops calling. No roadmap, no promises — just the loudest community on Solana.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={PUMP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="brut-border brut-shadow brut-press inline-flex items-center gap-2 bg-accent-orange px-6 py-4 font-display text-lg text-charcoal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brut-shadow-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
                >
                  <ShoppingCart size={20} strokeWidth={3} />
                  Buy on Pump.fun
                </a>
                <a
                  href={DEX_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="brut-border brut-shadow brut-press inline-flex items-center gap-2 bg-cream px-6 py-4 font-display text-lg text-charcoal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brut-shadow-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
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
                <div className="brut-border-4 brut-shadow-lg bg-accent-orange p-2 animate-wobble">
                  <img src={mascot} alt="CALLDOG mascot" width={1024} height={1024} className="block h-auto w-full" />
                </div>
                <div className="brut-border absolute -bottom-4 -left-4 bg-charcoal px-3 py-1 font-mono text-xs text-cream rotate-[-4deg]">
                  good boy
                </div>
                <div className="brut-border absolute -top-4 -right-4 bg-cream px-3 py-1 font-mono text-xs rotate-[6deg]">
                  {typeof change === "number" ? `${change > 0 ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}% 24h` : "on chain"}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Marquee */}
        <div className="border-t-[3px] border-charcoal bg-charcoal py-3 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee font-display text-cream text-2xl">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center">
                {["CALL THE DOG", "WOOF ON SOL", "COMMUNITY OWNED", "NO ROADMAP JUST BARK", "1300+ PACK", "$CALLDOG"].map((t) => (
                  <span key={t} className="mx-8 flex items-center gap-8">
                    {t}
                    <span className="text-accent-orange">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART */}
      <section id="chart" className="border-b-[3px] border-charcoal">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <SectionHeader kicker="02 — Market" title="Live Chart" />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 brut-border-4 brut-shadow-lg bg-cream">
              <div className="flex items-center justify-between border-b-[3px] border-charcoal bg-charcoal px-4 py-2 font-mono text-xs text-cream">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 bg-accent-orange animate-pulse" />
                  DEXSCREENER / SOL / CALLDOG
                </span>
                <a href={DEX_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-accent-orange">
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
        </div>
      </section>

      {/* CONTRACT */}
      <section id="contract" className="border-b-[3px] border-charcoal bg-accent-orange">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest">03 — Verify</div>
                <h2 className="mt-2 font-display text-4xl leading-none md:text-6xl">Contract Address</h2>
              </div>
              <p className="font-mono text-sm max-w-sm">
                Always verify before you ape. One contract. No renames. No relaunches.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 brut-border-4 brut-shadow-lg bg-cream">
              <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4 md:p-5">
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm md:text-base text-charcoal">{CA}</code>
                <button
                  onClick={copy}
                  className="brut-border brut-press flex shrink-0 items-center justify-center gap-2 bg-charcoal px-5 py-3 font-display text-cream hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brut-shadow-sm active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                >
                  {copied ? <><Check size={16} strokeWidth={3} /> Copied</> : <><Copy size={16} strokeWidth={3} /> Copy CA</>}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" className="border-b-[3px] border-charcoal">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <SectionHeader kicker="04 — Numbers" title="Community Stats" />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-12">
            <Reveal delay={80} className="md:col-span-5">
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                className="brut-border-4 brut-shadow-lg brut-press block h-full bg-charcoal p-8 text-cream hover:-translate-x-1 hover:-translate-y-1 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <div className="brut-border flex h-14 w-14 items-center justify-center bg-accent-orange text-charcoal">
                    <Users size={26} strokeWidth={3} />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent-orange">Active on X</span>
                </div>
                <div className="mt-8 font-display text-6xl leading-none md:text-7xl">1,300+</div>
                <div className="mt-3 font-mono text-sm text-cream/70">Members calling the dog daily</div>
              </a>
            </Reveal>

            <div className="md:col-span-7 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Reveal delay={140}><StatCard label="Price" value={price} loading={isLoading} /></Reveal>
              <Reveal delay={180}><StatCard label="Market Cap" value={usd(data?.marketCap ?? data?.fdv)} loading={isLoading} accent /></Reveal>
              <Reveal delay={220}><StatCard label="24h Volume" value={usd(data?.volume?.h24)} loading={isLoading} /></Reveal>
              <Reveal delay={260}><StatCard label="Liquidity" value={usd(data?.liquidity?.usd)} loading={isLoading} /></Reveal>
              <Reveal delay={300}><StatCard label="24h Change" value={typeof change === "number" ? `${change > 0 ? "+" : ""}${change.toFixed(1)}%` : "—"} loading={isLoading} /></Reveal>
              <Reveal delay={340}><StatCard label="24h Txns" value={txns ? txns.toLocaleString() : "—"} loading={isLoading} /></Reveal>
            </div>
          </div>

          <Reveal delay={380}>
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-brown-dark">
              Live market data via Dexscreener · refreshes every 30s
            </p>
          </Reveal>
        </div>
      </section>

      {/* COMMUNITY */}
      <section id="community" className="border-b-[3px] border-charcoal bg-charcoal text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-accent-orange">05 — Pack</div>
                <h2 className="mt-2 font-display text-5xl leading-none md:text-7xl">Join The Pack</h2>
              </div>
              <p className="max-w-sm font-mono text-sm text-cream/70">
                Everything happens on X. Come bark with us.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:max-w-xl">
            <Reveal delay={80}>
              <a
                href={X_URL}
                target="_blank"
                rel="noreferrer"
                className="brut-border-4 brut-shadow brut-press group block bg-cream p-6 text-charcoal hover:-translate-x-1 hover:-translate-y-1 hover:brut-shadow-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
              >
                <div className="flex items-center justify-between">
                  <div className="brut-border flex h-14 w-14 items-center justify-center bg-accent-orange">
                    <XIcon />
                  </div>
                  <ExternalLink size={18} strokeWidth={3} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-6 font-display text-2xl">X / Twitter</div>
                <div className="mt-1 font-mono text-xs text-brown-dark">@CallDogONSOLANA · 1,300+ members</div>
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="brut-border h-9 w-9 bg-accent-orange flex items-center justify-center font-display">C</div>
              <span className="font-display text-lg">$CALLDOG</span>
            </div>
            <p className="max-w-xl font-mono text-xs leading-relaxed text-brown-dark">
              $CALLDOG is a community meme coin with no intrinsic value or expectation of financial return.
              Nothing on this site is financial advice. Do your own research. Crypto is volatile and you may
              lose everything. The dog is a good boy.
            </p>
            <div className="font-mono text-xs text-brown-dark">© {new Date().getFullYear()} — Call the dog.</div>
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
        <div className="font-mono text-xs uppercase tracking-widest text-brown-dark">{kicker}</div>
        <h2 className="mt-2 font-display text-5xl leading-none md:text-7xl">{title}</h2>
      </div>
      <div className="h-[3px] w-24 bg-charcoal md:w-40" />
    </div>
  );
}

function StatCard({ label, value, accent, loading }: { label: string; value: string; accent?: boolean; loading?: boolean }) {
  return (
    <div className={`brut-border-4 brut-shadow flex h-full flex-col justify-between gap-4 px-5 py-6 ${accent ? "bg-accent-orange" : "bg-cream"}`}>
      <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
      <span className={`font-display text-3xl leading-none ${loading ? "opacity-40" : ""}`}>{loading ? "…" : value}</span>
    </div>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.945l-4.79-6.26L4.7 22H2l7-8L2 2h7.08l4.35 5.75L18.244 2Zm-1.22 18h1.63L7.06 4H5.31l11.714 16Z" />
    </svg>
  );
}
