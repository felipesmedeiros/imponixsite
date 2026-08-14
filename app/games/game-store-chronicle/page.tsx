import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { GameNewsSection } from "../../components/GameNewsSection";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Game Store Chronicle | Imponix Game Studio",
  description:
    "Run a game store through the changing eras of gaming, manage a living city of customers, balance real operating costs, and grow your shop.",
};

const storeLoop = [
  ["01", "Read the market", "Follow demand and prepare for the releases that shape each era."],
  ["02", "Stock the shelves", "Choose the right consoles, games, and accessories at the right moment."],
  ["03", "Set your prices", "Balance margins, customer demand, and the reputation of your store."],
  ["04", "Build an empire", "Expand your floor, improve your tools, and become the place every player visits."],
];

const simulationHighlights = [
  [
    "01",
    "The city",
    "293 residents remember who they are.",
    "Regular residents keep their identity and appearance within each save, returning as pedestrians and potential customers throughout the city.",
  ],
  [
    "02",
    "The storefront",
    "Every visit starts with a decision.",
    "Rating, stock, capacity, time, personality, window displays, the greeter, and active boosts all influence who steps inside.",
  ],
  [
    "03",
    "The shop floor",
    "Customers shop with intent.",
    "They observe real shelves, consider products through their interests, compare prices, reject items they own, and make more than one shopping decision.",
  ],
  [
    "04",
    "The reports",
    "Every outcome becomes evidence.",
    "Track the customer funnel, lost sales, margins, inventory, promotions, employee output, utilities, and the actual voice of your customers.",
  ],
];

const storeNewsSlots = [
  {
    category: "Major update",
    title: "Staff Hiring - Update Notes 1.1.4",
    description: "Hire employees, assign four store activities, track their performance in Store Reports, and unlock 16 new Steam achievements.",
    href: "https://steamcommunity.com/games/3463400/announcements/detail/707778917650400903",
    meta: "Aug 1, 2026",
  },
  {
    category: "Patch notes",
    title: "Update Notes v1.0.14",
    description: "Checkout, delivery boxes, previews, and shader warmup received fixes and improvements. GSC Mod Studio 0.2.0 also added local Custom Radio and subscribed Workshop mod installation.",
    href: "https://steamcommunity.com/games/3463400/announcements/detail/696519283891503790",
    meta: "Jul 23, 2026",
  },
  {
    category: "Patch notes & news",
    title: "Update Notes 1.0.13 & News",
    description: "Display booths arrived for all eight consoles alongside German support, tutorial and report-flow changes, quality-of-life improvements, and community-requested fixes.",
    href: "https://steamcommunity.com/games/3463400/announcements/detail/712281248545899923",
    meta: "Jul 19, 2026",
  },
];

export default function GameStoreChroniclePage() {
  return (
    <div className="site-shell gsc-page">
      <SiteHeader />
      <main>
        <section className="game-hero game-hero--gsc">
          <div className="game-hero__copy page-width">
            <div>
              <p className="eyebrow">Imponix Game 01 · Available now</p>
              <Image
                className="gsc-official-logo gsc-official-logo--hero"
                src="/games/gsc/logo.png"
                alt="Game Store Chronicle"
                width={1280}
                height={720}
                priority
              />
              <h1>Make gaming history your business.</h1>
              <p className="game-hero__lede">
                Run your own game store through the decades. Watch the market,
                prepare for landmark releases, and turn a small shop into a
                thriving destination for players.
              </p>
              <div className="button-row">
                <a
                  className="button button--ink"
                  href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buy on Steam
                </a>
                <a className="text-link text-link--ink" href="#gameplay">
                  See how it plays ↓
                </a>
              </div>
            </div>

            <div className="gsc-hero-visual gsc-hero-visual--official">
              <Image
                className="gsc-hero-visual__scene"
                src="/games/gsc/hero.jpg"
                alt="An in-game view down the stocked aisles of a Game Store Chronicle shop"
                fill
                sizes="(max-width: 1000px) 100vw, 55vw"
                priority
              />
              <Image
                className="gsc-hero-visual__cover"
                src="/games/gsc/cover.png"
                alt="Game Store Chronicle cover art"
                width={600}
                height={900}
              />
              <span className="gsc-hero-visual__caption">Your store · Your story</span>
            </div>
          </div>
        </section>

        <nav className="game-local-nav game-local-nav--gsc" aria-label="Game Store Chronicle sections">
          <div className="page-width">
            <a href="#overview">Overview</a>
            <a href="#gameplay">Gameplay</a>
            <a href="#simulation">Simulation</a>
            <a href="#media">Media</a>
            <a href="#news">News &amp; updates</a>
            <a href="#community">Community</a>
          </div>
        </nav>

        <section className="game-intro game-intro--gsc page-width" id="overview">
          <p className="eyebrow">Playable history</p>
          <div>
            <h2>Your shelves change as the industry does.</h2>
            <p>
              Every era brings new products, new expectations, and new ways to
              play. Anticipate the market, shape your store, and decide what
              kind of retailer you want to become.
            </p>
          </div>
        </section>

        <section className="loop-section page-width" id="gameplay" aria-labelledby="loop-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">The store loop</p>
              <h2 id="loop-title">Read. Stock. Sell. Grow.</h2>
            </div>
            <p>No two days—or decades—ask exactly the same thing of you.</p>
          </div>

          <div className="loop-grid">
            {storeLoop.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="simulation-section" id="simulation" aria-labelledby="simulation-title">
          <div className="page-width">
            <div className="simulation-section__header">
              <div>
                <p className="eyebrow">Living simulation</p>
                <h2 id="simulation-title">A city that remembers. A store that has to survive.</h2>
              </div>
              <div className="simulation-section__economy">
                <p>
                  Simulation Mode adds meaningful daily pressure. Rent, the backroom lease,
                  electricity, repairs, and wages all become part of the business you are building.
                </p>
                <div aria-label="Simulation Mode operating costs">
                  <span>Rent</span>
                  <span>Utilities</span>
                  <span>Repairs</span>
                  <span>Wages</span>
                </div>
              </div>
            </div>

            <div className="simulation-grid">
              {simulationHighlights.map(([number, label, title, text]) => (
                <article key={number}>
                  <div className="simulation-grid__meta">
                    <span>{number}</span>
                    <span>{label}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="feature-split feature-split--gsc">
          <div className="page-width feature-split__inner">
            <figure className="gsc-feature-image">
              <Image
                src="/games/gsc/feature.jpg"
                alt="A first-generation console, joystick, cartridges, and boxed stock"
                fill
                sizes="(max-width: 1000px) 100vw, 55vw"
              />
              <figcaption>
                <span>Store evolution</span>
                <strong>Start small. Think decades ahead.</strong>
              </figcaption>
            </figure>
            <div className="feature-split__copy">
              <p className="eyebrow">Make it yours</p>
              <h2>A shop with your fingerprints on every aisle.</h2>
              <p>
                Organize shelves, build displays, improve your workflow, and
                expand the store as your reputation grows. Layout and product
                selection directly shape the customer experience.
              </p>
              <ul className="feature-list">
                <li>Design and organize your sales floor</li>
                <li>Order products from changing catalogues</li>
                <li>Track demand and react to key events</li>
                <li>Upgrade tools and expand your business</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="media-section page-width" id="media" aria-labelledby="gsc-media-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Inside the store</p>
              <h2 id="gsc-media-title">Build your version of gaming history.</h2>
            </div>
            <p>Real stores, real customers, and decades of products to discover.</p>
          </div>
          <div className="media-grid media-grid--gsc">
            <figure className="gsc-media-card gsc-media-card--wide">
              <Image src="/games/gsc/store-floor.jpg" alt="An in-game view between stocked shelves and product displays" fill sizes="(max-width: 760px) 100vw, 55vw" />
              <figcaption><span>Gameplay</span><strong>A living shop floor</strong></figcaption>
            </figure>
            <figure className="gsc-media-card">
              <Image src="/games/gsc/checkout.jpg" alt="The in-game checkout interface for completing a customer transaction" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span>Management</span><strong>Every sale counts</strong></figcaption>
            </figure>
            <figure className="gsc-media-card">
              <Image src="/games/gsc/era-voyager.jpg" alt="The in-game timeline showing new products arriving during the Voyager era" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span>Gaming history</span><strong>New eras, new demand</strong></figcaption>
            </figure>
          </div>
        </section>

        <GameNewsSection
          gameName="Game Store Chronicle"
          heading="The chronicle continues."
          tone="gsc"
          slots={storeNewsSlots}
        />

        <section className="gsc-community" id="community" aria-labelledby="gsc-community-title">
          <div className="page-width gsc-community__inner">
            <div>
              <p className="eyebrow">Game Store Chronicle community</p>
              <h2 id="gsc-community-title">The conversation continues after closing time.</h2>
              <p>
                Meet other store owners, share screenshots and strategies, ask about mods,
                report issues, and talk directly with the two developers about what comes next.
              </p>
            </div>
            <div className="gsc-community__action">
              <span>Official GSC server</span>
              <a
                className="button button--discord"
                href="https://discord.gg/CAtmxqVVvp"
                target="_blank"
                rel="noreferrer"
              >
                Join the GSC Discord <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </section>

        <section className="game-details game-details--gsc">
          <div className="page-width game-details__inner">
            <div>
              <p className="eyebrow">Details</p>
              <h2>Ready to open?</h2>
            </div>
            <dl>
              <div><dt>Release</dt><dd>July 13, 2026</dd></div>
              <div><dt>Genre</dt><dd>Management simulation</dd></div>
              <div><dt>Platform</dt><dd>PC via Steam</dd></div>
              <div><dt>Players</dt><dd>Single-player</dd></div>
            </dl>
            <div className="button-stack">
              <a className="button button--ink" href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/" target="_blank" rel="noreferrer">Buy on Steam</a>
              <a className="button button--light" href="https://pub-7910af93f3834434ae1c1f4ea57b038c.r2.dev/GSC-Mod-Studio-Setup-0.2.0.zip" target="_blank" rel="noreferrer">Download GSC Mod Studio 0.2.0 <ExternalLinkIcon /></a>
              <a className="text-link text-link--ink" href="https://impress.games/press-kit/imponix-game-studio/gsc---game-store-chronicle" target="_blank" rel="noreferrer">Open press kit <ExternalLinkIcon /></a>
            </div>
          </div>
        </section>

        <nav className="next-game page-width" aria-label="More Imponix games">
          <span>Next world</span>
          <a href="/games/veil-of-shadows">Veil of Shadows <b aria-hidden="true">→</b></a>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
