import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { GameNewsSection } from "../../components/GameNewsSection";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";

export const metadata: Metadata = {
  title: "Game Store Chronicle | Imponix Game Studio",
  description:
    "Run a game store through the changing eras of gaming. Read demand, stock the right products, set prices, and grow your shop.",
};

const storeLoop = [
  ["01", "Read the market", "Follow demand and prepare for the releases that shape each era."],
  ["02", "Stock the shelves", "Choose the right consoles, games, and accessories at the right moment."],
  ["03", "Set your prices", "Balance margins, customer demand, and the reputation of your store."],
  ["04", "Build an empire", "Expand your floor, improve your tools, and become the place every player visits."],
];

const storeNewsSlots = [
  {
    category: "Patch notes",
    title: "Update 1.1.5 — A deeper, livelier store",
    description: "Simulation Mode, a living city, major performance work, three save slots, Sandbox tools, deeper reports, new boost cards, Spanish support, and more.",
    href: "/games/game-store-chronicle/news/update-1-1-5",
    meta: "1.1.5",
  },
  {
    category: "Announcement",
    title: "The latest from behind the counter",
    description: "Share release news, milestones, events, and important community announcements.",
  },
  {
    category: "Developer diary",
    title: "How the shop keeps growing",
    description: "Take players inside the design, research, and development of each new feature.",
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
            <a href="#media">Media</a>
            <a href="#news">News &amp; updates</a>
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
