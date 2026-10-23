import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { JsonLd } from "../../components/JsonLd";
import { OtherGames } from "../../components/OtherGames";
import { T } from "../../components/LanguageProvider";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { createBreadcrumbJsonLd, createGameJsonLd, createPageMetadata } from "../../lib/seo";
import { MuchiScreenshots } from "./MuchiScreenshots";

const steamUrl = "https://store.steampowered.com/app/5473030/Muchi";
const description = "Meet Muchi, a cozy free-to-play desktop pet coming to Windows in Q4 2026. Share snacks, play minigames, grow flowers, and enjoy a little company alongside your day. Wishlist on Steam.";

export const metadata: Metadata = createPageMetadata({
  path: "/games/muchi",
  title: "Muchi – A Cozy Free-to-Play Desktop Pet | Imponix",
  description,
  image: "/games/muchi/key-art.png",
  imageAlt: "Official Muchi artwork with the cream-and-apricot desktop pet, green leaves, and honey-coloured wordmark",
});

const gameJsonLd = {
  ...createGameJsonLd({
    path: "/games/muchi",
    name: "Muchi",
    description,
    image: "/games/muchi/key-art.png",
    genre: ["Desktop companion", "Casual", "Life simulation"],
    operatingSystem: "Windows",
  }),
  isAccessibleForFree: true,
  sameAs: [steamUrl],
};

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "Muchi", path: "/games/muchi" },
]);

const moments = [
  { number: "01", title: "Little moments of care.", description: "Show him affection, offer a snack or some water, and let him settle into a nap while you carry on with your day." },
  { number: "02", title: "Make time for a little play.", description: "Take a break with a card game, tic-tac-toe, or a memory match against Muchi. Or start some bubble play and watch him chase the floating bubbles." },
  { number: "03", title: "Grow a little color.", description: "Plant seeds, water them, and watch flowers grow beside your everyday tasks. A little garden brings a splash of color to the space between appointments." },
] as const;

export default function MuchiPage() {
  return (
    <div className="site-shell muchi-page">
      <JsonLd data={gameJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <section className="game-hero muchi-hero" aria-labelledby="muchi-title">
          <div className="muchi-hero__visual">
            <Image src="/games/muchi/hero.png" alt="Official Muchi artwork: a smiling cream-and-apricot pet leaning over a desktop window in warm sunlight" fill sizes="(max-width: 760px) 100vw, 65vw" priority unoptimized />
          </div>
          <div className="page-width muchi-hero__inner">
            <div className="muchi-hero__copy">
              <p className="eyebrow"><T>Imponix Game 05 · Pre-release</T></p>
              <h1 id="muchi-title"><Image className="muchi-logo" src="/games/muchi/logo.png" alt="Muchi" width={1280} height={560} priority unoptimized /></h1>
              <p className="muchi-hero__tagline"><T>A little company for your day.</T></p>
              <p className="game-hero__lede muchi-hero__lede"><T>A cozy desktop pet to share snacks, little games, and quiet moments with. Coming to Windows as a free-to-play game.</T></p>
              <div className="button-row">
                <a className="button muchi-button" href={steamUrl} target="_blank" rel="noreferrer" data-track-label="Wishlist Muchi on Steam" data-track-placement="hero"><T>Wishlist on Steam</T> <ExternalLinkIcon /></a>
                <a className="text-link muchi-text-link" href="#media"><T>Screenshots</T> <span aria-hidden="true">→</span></a>
              </div>
              <p className="muchi-hero__status"><T>Coming Q4 2026 · Free to play · Windows</T></p>
            </div>
          </div>
        </section>

        <nav className="game-local-nav muchi-local-nav" aria-label="Muchi sections">
          <div className="page-width">
            <a href="#companion"><T>Meet Muchi</T></a>
            <a href="#moments"><T>Little moments</T></a>
            <a href="#media"><T>Screenshots</T></a>
            <a href="#details"><T>Details</T></a>
          </div>
        </nav>

        <section className="game-intro muchi-intro page-width" id="companion" aria-labelledby="muchi-intro-title">
          <div>
            <p className="eyebrow"><T>A friend between tasks</T></p>
            <h2 id="muchi-intro-title"><T>Your screen, a little cozier.</T></h2>
            <p><T>Meet Muchi, a desktop companion who wanders, plays, and rests alongside your day. A short break between emails or everyday tasks can become a little moment together.</T></p>
            <p><T>No rush, no pressure. Share some affection, enjoy a quick game, or let him rest while you do your own thing.</T></p>
          </div>
          <figure className="muchi-intro__screen">
            <Image src="/games/muchi/screenshot-007.jpg" alt="Muchi beside a small garden of colourful flowers and a bee on a Windows desktop" width={1920} height={1080} sizes="(max-width: 1000px) 100vw, 55vw" unoptimized />
            <figcaption><T>A little garden</T></figcaption>
          </figure>
        </section>

        <section className="muchi-moments" id="moments" aria-labelledby="muchi-moments-title">
          <div className="page-width">
            <div className="section-heading"><p className="eyebrow"><T>Care, play, grow</T></p><h2 id="muchi-moments-title"><T>Small breaks. Shared smiles.</T></h2></div>
            <div className="loop-grid muchi-features">
              {moments.map((moment) => (
                <article key={moment.number}>
                  <span aria-hidden="true">{moment.number}</span>
                  <h3><T>{moment.title}</T></h3>
                  <p><T>{moment.description}</T></p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="media-section muchi-media" id="media" aria-labelledby="muchi-media-title">
          <div className="page-width">
            <div className="section-heading section-heading--split"><div><p className="eyebrow"><T>Screenshots</T></p><h2 id="muchi-media-title"><T>A little life on your desktop.</T></h2></div><p><T>Actual gameplay from the development build. Your own desktop stays the backdrop.</T></p></div>
            <MuchiScreenshots />
            <p className="muchi-media__note"><T>Development screenshots. The final game may look different.</T></p>
          </div>
        </section>

        <section className="game-details muchi-details" id="details" aria-labelledby="muchi-details-title">
          <div className="page-width game-details__inner">
            <div><p className="eyebrow"><T>Details</T></p><h2 id="muchi-details-title"><T>Coming Q4 2026</T></h2><p className="muchi-details__note"><T>Wishlist Muchi on Steam and get ready to welcome a little company to your desktop in Q4 2026.</T></p></div>
            <dl>
              <div><dt><T>Status</T></dt><dd><T>Pre-release</T></dd></div>
              <div><dt><T>Pricing</T></dt><dd><T>Free to play</T></dd></div>
              <div><dt><T>Platform</T></dt><dd>Windows</dd></div>
              <div><dt><T>Genre</T></dt><dd><T>Cozy desktop pet</T></dd></div>
              <div><dt><T>Release</T></dt><dd><T>Q4 2026</T></dd></div>
            </dl>
            <div className="button-stack"><a className="button muchi-button" href={steamUrl} target="_blank" rel="noreferrer" data-track-label="Wishlist Muchi on Steam" data-track-placement="details"><T>Wishlist on Steam</T> <ExternalLinkIcon /></a></div>
          </div>
        </section>
        <OtherGames currentGame="muchi" />
      </main>
      <SiteFooter />
    </div>
  );
}
