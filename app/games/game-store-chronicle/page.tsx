import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderFrame } from "../../components/PlaceholderFrame";
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

export default function GameStoreChroniclePage() {
  return (
    <div className="site-shell gsc-page">
      <SiteHeader />
      <main>
        <section className="game-hero game-hero--gsc">
          <div className="game-hero__copy page-width">
            <div>
              <p className="eyebrow">Imponix Game 01 · Available now</p>
              <div className="gsc-title" aria-label="Game Store Chronicle">
                <span>GAME STORE</span>
                <strong>CHRONICLE</strong>
              </div>
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

            <div className="gsc-hero-visual" role="img" aria-label="Game Store Chronicle hero artwork placeholder">
              <div className="gsc-hero-visual__awning" />
              <div className="gsc-hero-visual__window">
                <span>OPEN</span>
                <i />
                <i />
              </div>
              <div className="gsc-hero-visual__receipt">
                <small>IMPONIX PRESENTS</small>
                <strong>YOUR STORE</strong>
                <span>YOUR STORY</span>
                <b>1980 → NOW</b>
              </div>
              <span className="placeholder-tag">Hero art placeholder</span>
            </div>
          </div>
          <div className="era-ticker" aria-label="Gaming eras">
            <span>1980s</span><i />
            <span>1990s</span><i />
            <span>2000s</span><i />
            <span>Modern era</span>
          </div>
        </section>

        <section className="game-intro game-intro--gsc page-width">
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
            <PlaceholderFrame eyebrow="Store evolution" title="Start small. Think decades ahead." tone="gsc" />
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

        <section className="media-section page-width" aria-labelledby="gsc-media-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">Inside the store</p>
              <h2 id="gsc-media-title">Build your version of gaming history.</h2>
            </div>
            <p>Final screenshots and trailers will replace these frames.</p>
          </div>
          <div className="media-grid">
            <PlaceholderFrame eyebrow="Gameplay" title="The shop floor" tone="gsc" />
            <PlaceholderFrame eyebrow="Management" title="Orders & inventory" tone="gsc" size="square" />
            <PlaceholderFrame eyebrow="Progression" title="A bigger future" tone="gsc" size="square" />
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
              <a className="text-link text-link--ink" href="https://impress.games/press-kit/imponix-game-studio/gsc---game-store-chronicle" target="_blank" rel="noreferrer">Open press kit ↗</a>
            </div>
          </div>
        </section>

        <nav className="next-game page-width" aria-label="More Imponix games">
          <span>Next world</span>
          <Link href="/games/veil-of-shadows">Veil of Shadows <b aria-hidden="true">→</b></Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
