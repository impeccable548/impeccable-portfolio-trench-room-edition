import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, LineChart, ShoppingBag, Send, Instagram, Heart } from "lucide-react";
import hero from "@/assets/tomochi-characters.jpg.asset.json";
import poki from "@/assets/char-poki.jpg";
import mototo from "@/assets/char-mototo.jpg";
import luna from "@/assets/char-luna.jpg";
import roz from "@/assets/char-roz.jpg";

const CA = "6mJoQqcPEjiQ1hFya9oH6NBCQLhvS3mwVQWV9EcTHg9u";
const PAIR = "6GX7k4wGCiyGFLtjJTZaVv4St3zT5ZwM1VE1dQoEqheT";
const PUMP_URL = `https://pump.fun/coin/${CA}`;
const DEX_URL = `https://dexscreener.com/solana/${PAIR}`;
const X_URL = "https://x.com/tomochicoin";
const TG_URL = "https://t.me/tomochiworld";
const TIKTOK_URL = "https://www.tiktok.com/@tomochi";
const IG_URL = "https://www.instagram.com/tomochi";
const OG_IMAGE = `https://dexscreener.com/token-images/og/solana/${CA}`;

const TITLE = "$tomochi — Poki & Friends in the Tomochi World";
const DESC =
  "Tomochi is a character IP built over 18+ months — Poki, Mototo, Luna and Roz. Live chart, verified contract and a community of 130K+ across platforms.";

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
        transition: "opacity 700ms ease, transform 700ms cubic-bezier(.2,.9,.2,1)",
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(26px)",
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
    queryKey: ["tomochi-stats"],
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

const CHARACTERS = [
  { name: "Poki", img: poki, tint: "bg-peach", blurb: "The one who started it all. A round little hamster with an even rounder heart — endlessly curious, always snacking." },
  { name: "Mototo", img: mototo, tint: "bg-lilac", blurb: "Poki's calm best friend. Naps through most adventures, shows up exactly when he's needed." },
  { name: "Luna", img: luna, tint: "bg-blush", blurb: "Dreamy, sparkly and a little dramatic. Collects stars, feelings and other people's snacks." },
  { name: "Roz", img: roz, tint: "bg-mint", blurb: "Sleepy soul of the group. Speaks rarely, hugs often, and somehow always knows the way home." },
];

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

  const shortCA = `${CA.slice(0, 5)}…${CA.slice(-5)}`;
  const change = data?.priceChange?.h24;
  const price = data?.priceUsd ? `$${Number(data.priceUsd).toPrecision(3)}` : "—";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAV */}
      <nav className={`sticky top-0 z-50 backdrop-blur-none bg-cream/95 transition-shadow ${scrolled ? "soft-shadow" : ""}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a href="#top" className="flex items-center gap-2.5">
            <img src={poki} alt="" width={640} height={640} className="h-10 w-10 rounded-full object-cover ring-2 ring-peach" />
            <span className="font-display text-xl font-extrabold tracking-tight">$tomochi</span>
          </a>

          <div className="hidden md:flex items-center gap-7 text-sm font-semibold">
            <a href="#chart" className="hover:text-primary transition-colors">Chart</a>
            <a href="#story" className="hover:text-primary transition-colors">Our Story</a>
            <a href="#characters" className="hover:text-primary transition-colors">Characters</a>
            <a href="#community" className="hover:text-primary transition-colors">Community</a>
          </div>

          <button
            onClick={copy}
            className="lift flex items-center gap-2 rounded-full bg-tangerine px-4 py-2.5 text-sm font-bold text-primary-foreground soft-shadow hover:-translate-y-0.5 hover:soft-shadow-lg"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            <span className="hidden sm:inline">{copied ? "Copied!" : shortCA}</span>
            <span className="sm:hidden">{copied ? "Copied!" : "CA"}</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden bg-dots-soft">
        <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-blush/50" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky/40" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full bg-mint px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cocoa">
                <span className="h-2 w-2 rounded-full bg-tangerine animate-pulse-soft" /> Live on Solana
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
                $tomochi
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-md font-display text-2xl font-bold leading-snug text-cocoa md:text-3xl">
                A little world of joy, built by Poki and friends.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                18+ months of characters, stories and small warm moments — now with a
                community that gets to grow the Tomochi world together.
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={PUMP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="lift inline-flex items-center gap-2 rounded-full bg-tangerine px-7 py-4 font-display text-lg font-bold text-primary-foreground soft-shadow hover:-translate-y-1 hover:soft-shadow-lg"
                >
                  <ShoppingBag size={20} /> Buy on Pump.fun
                </a>
                <a
                  href={DEX_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="lift inline-flex items-center gap-2 rounded-full border-2 border-cocoa/15 bg-card px-7 py-4 font-display text-lg font-bold text-cocoa soft-shadow hover:-translate-y-1 hover:soft-shadow-lg"
                >
                  <LineChart size={20} /> View Chart
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="relative animate-float">
              <div className="soft-card overflow-hidden p-3 soft-shadow-lg">
                <img
                  src={hero.url}
                  alt="Poki and friends, the Tomochi hamster characters"
                  width={1200}
                  height={500}
                  className="block h-auto w-full rounded-2xl"
                />
              </div>
              <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-bold text-cocoa soft-shadow animate-wiggle">
                <Heart size={15} fill="currentColor" /> 80K+ on Instagram
              </div>
              {typeof change === "number" && (
                <div className="absolute -top-4 -right-2 rounded-full bg-card px-4 py-2 text-sm font-bold soft-shadow">
                  {change > 0 ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% 24h
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <div className="overflow-hidden border-y-2 border-cocoa/10 bg-peach py-3">
          <div className="flex whitespace-nowrap animate-marquee font-display text-xl font-bold text-cocoa">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex shrink-0 items-center">
                {["POKI", "MOTOTO", "LUNA", "ROZ", "WELCOME TO TOMOCHI"].map((t) => (
                  <span key={t} className="mx-7 flex items-center gap-7">
                    {t} <span className="text-tangerine">♥</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART */}
      <section id="chart" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <Reveal><SectionHeader kicker="Live market" title="The Chart" /></Reveal>
        <Reveal delay={100}>
          <div className="mt-10 soft-card overflow-hidden p-0 soft-shadow-lg">
            <div className="flex items-center justify-between gap-3 border-b-2 border-cocoa/10 bg-peach/60 px-5 py-3 text-sm font-bold">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-tangerine animate-pulse-soft" />
                Dexscreener chart embed · tomochi / SOL
              </span>
              <a href={DEX_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary">
                Open <ExternalLink size={13} />
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

        <div className="mt-8 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <Reveal delay={140}><StatCard label="Price" value={price} loading={isLoading} tint="bg-card" /></Reveal>
          <Reveal delay={180}><StatCard label="Market Cap" value={usd(data?.marketCap ?? data?.fdv)} loading={isLoading} tint="bg-peach" /></Reveal>
          <Reveal delay={220}><StatCard label="24h Volume" value={usd(data?.volume?.h24)} loading={isLoading} tint="bg-card" /></Reveal>
          <Reveal delay={260}><StatCard label="Liquidity" value={usd(data?.liquidity?.usd)} loading={isLoading} tint="bg-card" /></Reveal>
        </div>
        <Reveal delay={300}>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Live data via Dexscreener · refreshes every 30s
          </p>
        </Reveal>
      </section>

      {/* CONTRACT */}
      <section className="bg-blush/45 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Verify</div>
                <h2 className="mt-2 font-display text-4xl font-extrabold leading-tight md:text-5xl">Contract Address</h2>
              </div>
              <p className="max-w-sm text-sm text-muted-foreground">
                One official contract. Always double-check before you buy — copies are never the real Tomochi.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 soft-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:gap-4 md:p-5">
              <code className="flex-1 overflow-x-auto whitespace-nowrap rounded-2xl bg-muted px-4 py-3 font-mono text-sm md:text-base">{CA}</code>
              <button
                onClick={copy}
                className="lift flex shrink-0 items-center justify-center gap-2 rounded-full bg-tangerine px-6 py-3.5 font-display font-bold text-primary-foreground soft-shadow hover:-translate-y-0.5 hover:soft-shadow-lg"
              >
                {copied ? <><Check size={17} /> Copied!</> : <><Copy size={17} /> Copy CA</>}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STORY */}
      <section id="story" className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <Reveal><SectionHeader kicker="Since day one" title="Our Story" /></Reveal>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12">
          <Reveal delay={80} className="md:col-span-7">
            <div className="space-y-5 text-lg leading-relaxed text-cocoa/90">
              <p>
                It started quietly as <strong>Poki</strong> — one chubby hamster, drawn for fun,
                posted to a small feed. People kept coming back for him, so we kept drawing.
              </p>
              <p>
                Over 18+ months Poki grew a family: Mototo, Luna and Roz, and the little
                world they live in. That world became <strong>Tomochi</strong> — a name we own,
                trademark and all, and a brand built patiently rather than overnight.
              </p>
              <p>
                Today the characters reach millions of people every month. The long-term
                vision is simple and stubborn: build Tomochi into a character IP that sits
                comfortably next to Chiikawa and Sanrio — merch, animation, stories, the
                whole world.
              </p>
              <p className="font-display text-xl font-bold text-tangerine">
                $tomochi is how the community gets to build that world with us.
              </p>
            </div>
          </Reveal>
          <Reveal delay={160} className="md:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "18+", v: "months building" },
                { k: "IP", v: "trademark owned" },
                { k: "4", v: "core characters" },
                { k: "2B+", v: "views to date" },
              ].map((s, i) => (
                <div key={s.k} className={`soft-card p-5 ${i % 2 === 0 ? "bg-mint" : "bg-sky"}`}>
                  <div className="font-display text-3xl font-extrabold">{s.k}</div>
                  <div className="mt-1 text-sm font-semibold text-cocoa/70">{s.v}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CHARACTERS */}
      <section id="characters" className="bg-checks bg-peach/30 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal><SectionHeader kicker="The Tomochi world" title="Meet The Characters" /></Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CHARACTERS.map((c, i) => (
              <Reveal key={c.name} delay={80 + i * 60}>
                <div className="lift soft-card group h-full overflow-hidden hover:-translate-y-2 hover:soft-shadow-lg">
                  <div className={`${c.tint} p-4`}>
                    <img
                      src={c.img}
                      alt={`${c.name}, a Tomochi character`}
                      loading="lazy"
                      width={640}
                      height={640}
                      className="mx-auto block h-40 w-40 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-2xl font-extrabold">{c.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.blurb}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY STATS */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-8">
        <Reveal><SectionHeader kicker="Reach" title="A Community, Everywhere" /></Reveal>
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {[
            { k: "80K+", v: "Instagram followers", tint: "bg-blush" },
            { k: "31K", v: "Facebook community", tint: "bg-sky" },
            { k: "23K", v: "TikTok followers", tint: "bg-lilac" },
            { k: "2B+", v: "Views across platforms", tint: "bg-mint" },
          ].map((s, i) => (
            <Reveal key={s.k} delay={80 + i * 60}>
              <div className={`lift soft-card h-full p-6 ${s.tint} hover:-translate-y-1.5 hover:soft-shadow-lg`}>
                <div className="font-display text-4xl font-extrabold leading-none">{s.k}</div>
                <div className="mt-2 text-sm font-semibold text-cocoa/70">{s.v}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* COMMUNITY LINKS */}
      <section id="community" className="bg-blush/45 py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">
          <Reveal><SectionHeader kicker="Say hi" title="Join The Tomochi Family" /></Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal delay={80}><SocialCard href={X_URL} title="X" handle="@tomochicoin" tint="bg-card" icon={<XIcon />} /></Reveal>
            <Reveal delay={140}><SocialCard href={TG_URL} title="Telegram" handle="t.me/tomochiworld" tint="bg-sky" icon={<Send size={24} />} /></Reveal>
            <Reveal delay={200}><SocialCard href={TIKTOK_URL} title="TikTok" handle="@tomochi" tint="bg-lilac" icon={<TikTokIcon />} /></Reveal>
            <Reveal delay={260}><SocialCard href={IG_URL} title="Instagram" handle="@tomochi" tint="bg-peach" icon={<Instagram size={24} />} /></Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src={poki} alt="" loading="lazy" width={640} height={640} className="h-10 w-10 rounded-full object-cover ring-2 ring-peach" />
              <span className="font-display text-xl font-extrabold">$tomochi</span>
            </div>
            <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
              $tomochi is a community token connected to the Tomochi character brand. It has no
              intrinsic value and no expectation of financial return. Nothing here is financial
              advice — always do your own research. Crypto is volatile and you may lose everything.
            </p>
            <div className="text-xs font-semibold text-muted-foreground">© {new Date().getFullYear()} Tomochi</div>
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
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{kicker}</div>
        <h2 className="mt-2 font-display text-4xl font-extrabold leading-tight md:text-5xl">{title}</h2>
      </div>
      <div className="h-1.5 w-20 rounded-full bg-tangerine md:w-32" />
    </div>
  );
}

function StatCard({ label, value, loading, tint }: { label: string; value: string; loading?: boolean; tint: string }) {
  return (
    <div className={`lift soft-card flex h-full flex-col justify-between gap-4 p-5 ${tint} hover:-translate-y-1.5 hover:soft-shadow-lg`}>
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`font-display text-2xl font-extrabold leading-none md:text-3xl ${loading ? "opacity-40" : ""}`}>
        {loading ? "…" : value}
      </span>
    </div>
  );
}

function SocialCard({ href, title, handle, icon, tint }: { href: string; title: string; handle: string; icon: React.ReactNode; tint: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`lift soft-card group block h-full p-6 ${tint} hover:-translate-y-2 hover:soft-shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-cocoa">{icon}</div>
        <ExternalLink size={16} className="opacity-30 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mt-5 font-display text-xl font-extrabold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{handle}</div>
    </a>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.945l-4.79-6.26L4.7 22H2l7-8L2 2h7.08l4.35 5.75L18.244 2Zm-1.22 18h1.63L7.06 4H5.31l11.714 16Z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.83-2.48V9.77a5.7 5.7 0 1 0 4.92 5.63V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48Z" />
    </svg>
  );
}
