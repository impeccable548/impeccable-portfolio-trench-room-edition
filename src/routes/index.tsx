import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, ExternalLink, LineChart, ShoppingCart } from "lucide-react";
import jimothy from "@/assets/jimothy-token.jpg.asset.json";

const CA = "Ge87EtsjwRQbHaqQmKRno69RFTwh9bfSsm99XNxTpump";
const PUMP_URL = `https://pump.fun/coin/${CA}`;
const DEX_URL = `https://dexscreener.com/solana/${CA}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/7a6ab4c3-29bd-471e-81cd-0c1d6132b99e" },
    ],
  }),
  component: Index,
});

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

function Index() {
  const { copied, copy } = useCopy(CA);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shortCA = `${CA.slice(0, 6)}…${CA.slice(-6)}`;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* NAV */}
      <nav
        className={`sticky top-0 z-50 border-b-[3px] border-charcoal bg-cream transition-shadow ${
          scrolled ? "brut-shadow-sm" : ""
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <a href="#top" className="flex items-center gap-2">
            <div className="brut-border h-9 w-9 bg-accent-orange flex items-center justify-center font-display text-charcoal">J</div>
            <span className="font-display text-lg tracking-tight">$JIMOTHY</span>
          </a>

          <div className="hidden md:flex items-center gap-6 font-mono text-sm">
            <a href="#chart" className="hover:text-accent-orange transition-colors">Chart</a>
            <a href="#contract" className="hover:text-accent-orange transition-colors">Contract</a>
            <a href="#story" className="hover:text-accent-orange transition-colors">Story</a>
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
                <span className="inline-block h-2 w-2 bg-accent-orange" /> Live on Solana
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 font-display text-[16vw] leading-[0.85] tracking-tight md:text-[10rem]">
                $JIMOTHY
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl font-display text-2xl leading-tight md:text-4xl">
                The Raccoon That <span className="bg-accent-orange px-2">Broke</span> The Internet.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-5 max-w-lg font-sans text-base text-brown-dark md:text-lg">
                A short king from Seattle. A spine like a stack of pancakes. Now, a coin.
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
                  <img
                    src={jimothy.url}
                    alt="Jimothy the raccoon mascot"
                    width={1024}
                    height={1024}
                    className="block h-auto w-full"
                  />
                </div>
                <div className="brut-border absolute -bottom-4 -left-4 bg-charcoal px-3 py-1 font-mono text-xs text-cream rotate-[-4deg]">
                  short king
                </div>
                <div className="brut-border absolute -top-4 -right-4 bg-cream px-3 py-1 font-mono text-xs rotate-[6deg]">
                  ↑ 1000000%
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
                {["SHORT KING", "STOCKY BOI", "SEATTLE LEGEND", "SOLANA MEME", "NO ROADMAP JUST VIBES", "THE RACCOON"].map((t) => (
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
                  DEXSCREENER / SOL / JIMOTHY
                </span>
                <a href={DEX_URL} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-accent-orange">
                  Open <ExternalLink size={12} />
                </a>
              </div>
              <div className="aspect-[16/9] w-full bg-muted flex items-center justify-center">
                <iframe
                  title="Dexscreener chart embed"
                  src={`https://dexscreener.com/solana/${CA}?embed=1&theme=light&trades=0&info=0`}
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
                <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm md:text-base text-charcoal">
                  {CA}
                </code>
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

      {/* STORY */}
      <section id="story" className="border-b-[3px] border-charcoal">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <Reveal>
            <SectionHeader kicker="04 — Lore" title="The Story" />
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-12">
            <Reveal delay={80} className="md:col-span-7">
              <div className="brut-border-4 brut-shadow-lg bg-cream p-6 md:p-10">
                <p className="font-display text-2xl leading-snug md:text-3xl">
                  A raccoon walks into a Seattle backyard. He's shaped like a loaf.
                </p>
                <div className="mt-6 space-y-4 font-sans text-base text-brown-dark md:text-lg">
                  <p>
                    Jimothy was born with a rare congenital spine condition that shortened his body
                    into a stout, stocky silhouette. He didn't ask for the internet. The internet
                    found him anyway — waddling through camera traps, standing his ground, eating
                    with intent.
                  </p>
                  <p>
                    Millions of views later, Jimothy became a symbol: proof that the world rewards
                    the ones who show up as themselves. So we did the only rational thing. We put
                    him on-chain.
                  </p>
                  <p className="font-mono text-sm text-charcoal">
                    No roadmap. No promises. Just a raccoon and a community that gets it.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="md:col-span-5 space-y-6">
              <Reveal delay={140}>
                <StatCard label="Chain" value="Solana" />
              </Reveal>
              <Reveal delay={200}>
                <StatCard label="Ticker" value="$JIMOTHY" />
              </Reveal>
              <Reveal delay={260}>
                <StatCard label="Origin" value="Seattle, USA" accent />
              </Reveal>
            </div>
          </div>
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
                Raccoons move in numbers. Come make noise with us.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Reveal delay={80}>
              <SocialCard name="X / Twitter" handle="@jimothycoin" href="https://x.com" icon={<XIcon />} />
            </Reveal>
            <Reveal delay={160}>
              <SocialCard name="Telegram" handle="t.me/jimothy" href="https://t.me" icon={<TgIcon />} />
            </Reveal>
            <Reveal delay={240}>
              <SocialCard name="Discord" handle="discord.gg/jimothy" href="https://discord.com" icon={<DiscordIcon />} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="brut-border h-9 w-9 bg-accent-orange flex items-center justify-center font-display">J</div>
              <span className="font-display text-lg">$JIMOTHY</span>
            </div>
            <p className="max-w-xl font-mono text-xs leading-relaxed text-brown-dark">
              $JIMOTHY is a community meme coin with no intrinsic value or expectation of financial
              return. Nothing on this site is financial advice. Do your own research. Cryptocurrencies
              are volatile and you may lose everything. Jimothy is a good boy.
            </p>
            <div className="font-mono text-xs text-brown-dark">
              © {new Date().getFullYear()} — Long live the short king.
            </div>
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

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`brut-border-4 brut-shadow flex items-baseline justify-between px-5 py-6 ${accent ? "bg-accent-orange" : "bg-cream"}`}>
      <span className="font-mono text-xs uppercase tracking-widest">{label}</span>
      <span className="font-display text-2xl md:text-3xl">{value}</span>
    </div>
  );
}

function SocialCard({ name, handle, href, icon }: { name: string; handle: string; href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="brut-border-4 brut-shadow brut-press group block bg-cream p-6 text-charcoal hover:-translate-x-1 hover:-translate-y-1 hover:brut-shadow-lg active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
    >
      <div className="flex items-center justify-between">
        <div className="brut-border flex h-14 w-14 items-center justify-center bg-accent-orange">
          {icon}
        </div>
        <ExternalLink size={18} strokeWidth={3} className="opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-6 font-display text-2xl">{name}</div>
      <div className="mt-1 font-mono text-xs text-brown-dark">{handle}</div>
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
function TgIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
      <path d="M9.04 15.47 8.9 19.4c.44 0 .63-.19.86-.42l2.06-1.97 4.28 3.14c.79.44 1.35.21 1.55-.72l2.81-13.17c.28-1.19-.43-1.66-1.19-1.38L2.62 9.5c-1.16.45-1.14 1.1-.19 1.4l4.36 1.36 10.12-6.38c.48-.29.92-.13.56.18" />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden>
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3l-.24.42a17.14 17.14 0 0 0-4.635 0L11.44 3a19.79 19.79 0 0 0-3.76 1.369C3.677 9.055 2.9 13.62 3.29 18.115a19.9 19.9 0 0 0 5.99 3.03l.48-.72c-.99-.36-1.93-.81-2.82-1.35.24-.18.48-.36.7-.54 5.4 2.49 11.24 2.49 16.58 0 .22.19.46.37.7.54-.9.54-1.84.99-2.82 1.35l.48.72a19.9 19.9 0 0 0 5.99-3.03c.5-5.25-.87-9.78-3.24-13.746ZM9.53 15.33c-1.18 0-2.15-1.09-2.15-2.42s.95-2.43 2.15-2.43 2.17 1.1 2.15 2.43c0 1.33-.96 2.42-2.15 2.42Zm4.94 0c-1.18 0-2.15-1.09-2.15-2.42s.95-2.43 2.15-2.43c1.19 0 2.17 1.1 2.15 2.43 0 1.33-.96 2.42-2.15 2.42Z" />
    </svg>
  );
}
