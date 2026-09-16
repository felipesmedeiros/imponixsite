import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { GameNewsSection } from "../../components/GameNewsSection";
import { JsonLd } from "../../components/JsonLd";
import { T } from "../../components/LanguageProvider";
import { PlayerReviewsSection } from "../../components/PlayerReviewsSection";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { SteamReviewCallout } from "../../components/SteamReviewCallout";
import { createBreadcrumbJsonLd, createGameJsonLd, createPageMetadata } from "../../lib/seo";

const pageDescription =
  "Run a game store through the changing eras of gaming, manage a living city of customers, balance real operating costs, and grow your shop.";

export const metadata: Metadata = createPageMetadata({
  path: "/games/game-store-chronicle",
  title: "Game Store Chronicle – Game Store Simulator | Imponix",
  description: pageDescription,
  image: "/games/gsc/feature.jpg",
  imageAlt: "An Ultravision console, joystick, cartridges, and boxed stock from Game Store Chronicle",
});

const gameJsonLd = createGameJsonLd({
  path: "/games/game-store-chronicle",
  name: "Game Store Chronicle",
  description: pageDescription,
  image: "/games/gsc/feature.jpg",
  genre: ["Management simulation", "Business simulation"],
  datePublished: "2026-07-13",
  sameAs: ["https://store.steampowered.com/app/3463400/Game_Store_Chronicle/"],
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "Game Store Chronicle", path: "/games/game-store-chronicle" },
]);

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
    "300 residents remember who they are.",
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
    category: "Small update / patch notes",
    title: "Game Store Chronicle — Update 1.2.7",
    description:
      "Version 1.2.7 will improve Pre-Owned sellers, storefront shelf placement, expense clarity, traffic, ratings, restocking safety, character names, and automatic doors.",
    href: "https://store.steampowered.com/news/app/3463400/view/678509325320193132",
    meta: "Sep 14, 2026",
  },
  {
    category: "Regular update",
    title: "Update 1.2.6 — Arcade Rentals",
    description:
      "Update 1.2.6 will bring playable arcade machines, a complete Planet Arcade rental system, and improvements across traffic, deliveries, employees, and Pre-Owned inspections.",
    href: "https://store.steampowered.com/news/app/3463400/view/678509325320192327",
    meta: "Sep 11, 2026",
  },
  {
    category: "Major update",
    title: "Update 1.2.5 — Pre-Owned Market, Legacy Years & More",
    description:
      "Update 1.2.5 adds a complete Pre-Owned Market, unlimited Legacy years, and new reports, progression, sound, presentation, and controller improvements.",
    href: "https://store.steampowered.com/news/app/3463400/view/681886390551577960",
    meta: "Sep 5, 2026",
  },
];

const storePlayerReviews = [
  {
    author: "AcSims",
    quote:
      "If you grew up in the era of midnight game launches, browsing shelves for the newest release, this game will hit you right in the nostalgia.",
    href: "https://steamcommunity.com/profiles/76561199017957597/recommended/3463400/",
  },
  {
    author: "Methras",
    quote: "A nostalgic kind of store simulator with charm.",
    href: "https://steamcommunity.com/profiles/76561198044946279/recommended/3463400/",
  },
  {
    author: "rxpcgal",
    quote:
      "This game is smooth to play, the dev is VERY active, and you can tell the dev put a lot into making this wonderful.",
    href: "https://steamcommunity.com/profiles/76561197990656433/recommended/3463400/",
  },
];

export default function GameStoreChroniclePage() {
  return (
    <div className="site-shell gsc-page">
      <JsonLd data={gameJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <section className="game-hero game-hero--gsc">
          <div className="game-hero__copy page-width">
            <div>
              <p className="eyebrow"><T>Imponix Game 01 · Available now</T></p>
              <Image
                className="gsc-official-logo gsc-official-logo--hero"
                src="/games/gsc/logo.png"
                alt="Game Store Chronicle"
                width={1280}
                height={720}
                priority
              />
              <h1><T>Make gaming history your business.</T></h1>
              <p className="game-hero__lede">
                <T>Run your own game store through the decades. Watch the market, prepare for landmark releases, and turn a small shop into a thriving destination for players.</T>
              </p>
              <div className="button-row">
                <a
                  className="button button--ink"
                  href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <T>Buy on Steam</T>
                </a>
                <a className="text-link text-link--ink" href="#gameplay">
                  <T>See how it plays ↓</T>
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
              <span className="gsc-hero-visual__caption"><T>Your store · Your story</T></span>
            </div>
          </div>
        </section>

        <nav className="game-local-nav game-local-nav--gsc" aria-label="Game Store Chronicle sections">
          <div className="page-width">
            <a href="#overview"><T>Overview</T></a>
            <a href="#gameplay"><T>Gameplay</T></a>
            <a href="#simulation"><T>Simulation</T></a>
            <a href="#media"><T>Media</T></a>
            <a href="#reviews"><T>Reviews</T></a>
            <a href="#news"><T>News &amp; updates</T></a>
            <a href="#community"><T>Community</T></a>
          </div>
        </nav>

        <SteamReviewCallout
          tone="gsc"
          eyebrow="Happy customer?"
          heading="Enjoyed your shift? Leave a note at the counter."
          description="A short Steam review helps new store owners discover GSC—and helps our tiny two-person studio keep restocking the update shelf."
          href="https://store.steampowered.com/recommended/recommendgame/3463400"
          buttonLabel="Review GSC on Steam"
        />

        <section className="game-intro game-intro--gsc page-width" id="overview">
          <p className="eyebrow"><T>Playable history</T></p>
          <div>
            <h2><T>Your shelves change as the industry does.</T></h2>
            <p>
              <T>Every era brings new products, new expectations, and new ways to play. Anticipate the market, shape your store, and decide what kind of retailer you want to become.</T>
            </p>
          </div>
        </section>

        <section className="loop-section page-width" id="gameplay" aria-labelledby="loop-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow"><T>The store loop</T></p>
              <h2 id="loop-title"><T>Read. Stock. Sell. Grow.</T></h2>
            </div>
            <p><T>No two days—or decades—ask exactly the same thing of you.</T></p>
          </div>

          <div className="loop-grid">
            {storeLoop.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3><T>{title}</T></h3>
                <p><T>{text}</T></p>
              </article>
            ))}
          </div>
        </section>

        <section className="simulation-section" id="simulation" aria-labelledby="simulation-title">
          <div className="page-width">
            <div className="simulation-section__header">
              <div>
                <p className="eyebrow"><T>Living simulation</T></p>
                <h2 id="simulation-title"><T>A city that remembers. A store that has to survive.</T></h2>
              </div>
              <div className="simulation-section__economy">
                <p>
                  <T>Simulation Mode adds meaningful daily pressure. Rent, the backroom lease, electricity, repairs, and wages all become part of the business you are building.</T>
                </p>
                <div aria-label="Simulation Mode operating costs">
                  <span><T>Rent</T></span>
                  <span><T>Utilities</T></span>
                  <span><T>Repairs</T></span>
                  <span><T>Wages</T></span>
                </div>
              </div>
            </div>

            <div className="simulation-grid">
              {simulationHighlights.map(([number, label, title, text]) => (
                <article key={number}>
                  <div className="simulation-grid__meta">
                    <span>{number}</span>
                    <span><T>{label}</T></span>
                  </div>
                  <h3><T>{title}</T></h3>
                  <p><T>{text}</T></p>
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
                <span><T>Store evolution</T></span>
                <strong><T>Start small. Think decades ahead.</T></strong>
              </figcaption>
            </figure>
            <div className="feature-split__copy">
              <p className="eyebrow"><T>Make it yours</T></p>
              <h2><T>A shop with your fingerprints on every aisle.</T></h2>
              <p>
                <T>Organize shelves, build displays, improve your workflow, and expand the store as your reputation grows. Layout and product selection directly shape the customer experience.</T>
              </p>
              <ul className="feature-list">
                <li><T>Design and organize your sales floor</T></li>
                <li><T>Order products from changing catalogues</T></li>
                <li><T>Track demand and react to key events</T></li>
                <li><T>Upgrade tools and expand your business</T></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="media-section page-width" id="media" aria-labelledby="gsc-media-title">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow"><T>Inside the store</T></p>
              <h2 id="gsc-media-title"><T>Build your version of gaming history.</T></h2>
            </div>
            <p><T>Real stores, real customers, and decades of products to discover.</T></p>
          </div>
          <div className="media-grid media-grid--gsc">
            <figure className="gsc-media-card gsc-media-card--wide">
              <Image src="/games/gsc/store-floor.jpg" alt="An in-game view between stocked shelves and product displays" fill sizes="(max-width: 760px) 100vw, 55vw" />
              <figcaption><span><T>Gameplay</T></span><strong><T>A living shop floor</T></strong></figcaption>
            </figure>
            <figure className="gsc-media-card">
              <Image src="/games/gsc/checkout.jpg" alt="The in-game checkout interface for completing a customer transaction" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span><T>Management</T></span><strong><T>Every sale counts</T></strong></figcaption>
            </figure>
            <figure className="gsc-media-card">
              <Image src="/games/gsc/era-voyager.jpg" alt="The in-game timeline showing new products arriving during the Voyager era" fill sizes="(max-width: 760px) 100vw, 25vw" />
              <figcaption><span><T>Gaming history</T></span><strong><T>New eras, new demand</T></strong></figcaption>
            </figure>
            <figure className="gsc-media-card gsc-media-card--arcade">
              <Image
                src="/games/gsc/arcade-rentals.png"
                alt="A row of playable arcade rental cabinets inside a Game Store Chronicle shop"
                fill
                sizes="(max-width: 760px) 100vw, 86vw"
                unoptimized
              />
              <figcaption>
                <span><T>Arcade rentals</T></span>
                <strong><T>Rent cabinets. Set prices. Collect the coins.</T></strong>
              </figcaption>
            </figure>
          </div>
        </section>

        <PlayerReviewsSection
          gameName="Game Store Chronicle"
          heading="The best part is remembering why you love games."
          intro="A few words from players who have stepped behind the counter. Read the full reviews on Steam."
          tone="gsc"
          reviews={storePlayerReviews}
        />

        <GameNewsSection
          gameName="Game Store Chronicle"
          heading="The chronicle continues."
          tone="gsc"
          slots={storeNewsSlots}
        />

        <section className="gsc-community" id="community" aria-labelledby="gsc-community-title">
          <div className="page-width gsc-community__inner">
            <div>
              <p className="eyebrow"><T>Game Store Chronicle community</T></p>
              <h2 id="gsc-community-title"><T>The conversation continues after closing time.</T></h2>
              <p>
                <T>Meet other store owners, share screenshots and strategies, ask about mods, report issues, and talk directly with the two developers about what comes next.</T>
              </p>
            </div>
            <div className="gsc-community__action">
              <span><T>Official GSC server</T></span>
              <a
                className="button button--discord"
                href="https://discord.gg/CAtmxqVVvp"
                target="_blank"
                rel="noreferrer"
              >
                <T>Join the GSC Discord</T> <ExternalLinkIcon />
              </a>
            </div>
          </div>
        </section>

        <section className="game-details game-details--gsc">
          <div className="page-width game-details__inner">
            <div>
              <p className="eyebrow"><T>Details</T></p>
              <h2><T>Ready to open?</T></h2>
            </div>
            <dl>
              <div><dt><T>Release</T></dt><dd><T>July 13, 2026</T></dd></div>
              <div><dt><T>Genre</T></dt><dd><T>Management simulation</T></dd></div>
              <div><dt><T>Platform</T></dt><dd><T>PC via Steam</T></dd></div>
              <div><dt><T>Players</T></dt><dd><T>Single-player</T></dd></div>
            </dl>
            <div className="button-stack">
              <a className="button button--ink" href="https://store.steampowered.com/app/3463400/Game_Store_Chronicle/" target="_blank" rel="noreferrer"><T>Buy on Steam</T></a>
              <a
                className="button button--light"
                data-track-event="mod_tool_download"
                href="https://downloads.imponix.com/GSC%20Mod%20Studio%20Setup%200.3.0.zip"
                target="_blank"
                rel="noreferrer"
              >
                <T>Download GSC Mod Studio 0.3.0</T> <ExternalLinkIcon />
              </a>
              <a className="text-link text-link--ink" href="https://impress.games/press-kit/imponix-game-studio/gsc---game-store-chronicle" target="_blank" rel="noreferrer"><T>Open press kit</T> <ExternalLinkIcon /></a>
            </div>
          </div>
        </section>

        <nav className="next-game page-width" aria-label="More Imponix games">
          <span><T>Next world</T></span>
          <a href="/games/veil-of-shadows">Veil of Shadows <b aria-hidden="true">→</b></a>
        </nav>
      </main>
      <SiteFooter
        privacyPolicyHref="/games/game-store-chronicle/privacy-policy"
        termsOfServiceHref="/games/game-store-chronicle/terms-of-service"
      />
    </div>
  );
}
