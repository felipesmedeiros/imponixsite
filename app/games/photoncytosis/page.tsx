import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "../../components/JsonLd";
import { OtherGames } from "../../components/OtherGames";
import { T } from "../../components/LanguageProvider";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { createBreadcrumbJsonLd, createGameJsonLd, createPageMetadata } from "../../lib/seo";
import { PhotonScreenshots } from "./PhotonScreenshots";

const description =
  "Photoncytosis is an in-development desktop-life simulation from Imponix Game Studio. A small organism feeds on screen light, stores energy cell by cell, and grows beside you. The full game is planned for Q1 2027.";

export const metadata: Metadata = {
  ...createPageMetadata({
    path: "/games/photoncytosis",
    title: "Photoncytosis – A Living Organism on Your Desktop | Imponix",
    description,
    image: "/games/photoncytosis/key-art.png",
    imageAlt: "Photoncytosis illustrated key art: a branching pixel organism draws light from a desktop window",
  }),
  robots: { index: false, follow: false },
};

const gameJsonLd = createGameJsonLd({
  path: "/games/photoncytosis",
  name: "Photoncytosis",
  description,
  image: "/games/photoncytosis/key-art.png",
  genre: ["Desktop life simulation", "Idle simulation"],
  operatingSystem: "Windows",
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "Photoncytosis", path: "/games/photoncytosis" },
]);

const features = [
  {
    number: "01",
    title: "Light becomes life.",
    description: "Bright pixels on your screen feed the organism. Each cell holds its own energy, making the desktop more than a backdrop.",
  },
  {
    number: "02",
    title: "A body with different jobs.",
    description: "Feeder, motor, and structural cells give a growing creature different ways to gather light, move, and hold together.",
  },
  {
    number: "03",
    title: "Your space is its habitat.",
    description: "Watch the organism move across the desktop or keep it close to a chosen window. The world it responds to is the one on your screen.",
  },
] as const;

export default function PhotoncytosisPage() {
  return (
    <div className="site-shell photon-page">
      <JsonLd data={gameJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <section className="game-hero photon-hero" aria-labelledby="photon-title">
          <Image
            className="photon-hero__art"
            src="/games/photoncytosis/hero.png"
            alt="Illustrated key art of a branching pixel organism feeding on light from a desktop window"
            fill
            sizes="100vw"
            priority
            unoptimized
          />
          <div className="page-width photon-hero__inner">
            <div className="photon-hero__copy">
              <p className="eyebrow photon-eyebrow"><T>Imponix Game 04 · In development</T></p>
              <h1 id="photon-title">
                <Image
                  className="photon-logo photon-logo--hero"
                  src="/games/photoncytosis/logo-retrotronic.svg"
                  alt="Photoncytosis"
                  width={740}
                  height={236}
                  priority
                  unoptimized
                />
              </h1>
              <p className="photon-hero__tagline"><T>Your desktop is its habitat.</T></p>
              <p className="game-hero__lede photon-hero__lede">
                <T>A tiny organism feeds on screen light and grows while you work.</T>
              </p>
              <div className="button-row">
                <a className="button photon-button" href="#media"><T>Screenshots</T> <span aria-hidden="true">↓</span></a>
                <a className="text-link photon-text-link" href="#life"><T>Gameplay</T> <span aria-hidden="true">↓</span></a>
              </div>
              <p className="photon-hero__status"><T>Windows-first prototype · Planned release: Q1 2027</T></p>
            </div>
          </div>
        </section>

        <nav className="game-local-nav game-local-nav--photon" aria-label="Photoncytosis sections">
          <div className="page-width">
            <a href="#idea"><T>The idea</T></a>
            <a href="#life"><T>Gameplay</T></a>
            <a href="#media"><T>Screenshots</T></a>
            <a href="#details"><T>Details</T></a>
          </div>
        </nav>

        <section className="game-intro photon-intro page-width" id="idea">
          <div>
            <p className="eyebrow photon-eyebrow"><T>A different kind of desktop companion</T></p>
            <h2><T>A living experiment, alongside your everyday work.</T></h2>
            <p><T>Photoncytosis is a desktop-life simulation in development. A soft-bodied creature takes the light and colour of your screen as its environment, turning everyday computer use into a habitat you can watch change.</T></p>
          </div>
          <figure className="photon-intro__screen">
            <Image src="/games/photoncytosis/screenshot3.png" alt="Photoncytosis cell details and microscope beside the organism controls" width={2560} height={1440} sizes="(max-width: 1000px) 100vw, 55vw" unoptimized />
            <figcaption><T>Every cell has a story</T></figcaption>
          </figure>
        </section>

        <section className="photon-life" id="life" aria-labelledby="photon-life-title">
          <div className="page-width">
            <div className="section-heading">
              <p className="eyebrow photon-eyebrow"><T>Its own small world</T></p>
              <h2 id="photon-life-title"><T>Life, one cell at a time.</T></h2>
            </div>
            <div className="photon-life__grid">
              {features.map((feature) => (
                <article key={feature.number}>
                  <span>{feature.number}</span>
                  <h3><T>{feature.title}</T></h3>
                  <p><T>{feature.description}</T></p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="media-section photon-prototype" id="media" aria-labelledby="photon-prototype-title">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow photon-eyebrow"><T>Screenshots</T></p>
                <h2 id="photon-prototype-title"><T>Look closer. Let it wander.</T></h2>
              </div>
              <p><T>Inspect individual cells under the microscope, guide research in the mutation tree, and let the organism make your desktop its habitat.</T></p>
            </div>
            <PhotonScreenshots />
            <p className="photon-prototype__note"><T>Development interface shown. The final game may look different.</T></p>
          </div>
        </section>

        <section className="game-details game-details--photon" id="details">
          <div className="page-width game-details__inner">
            <div>
              <p className="eyebrow photon-eyebrow"><T>Details</T></p>
              <h2><T>Still growing</T></h2>
            </div>
            <dl>
              <div><dt><T>Status</T></dt><dd><T>In development</T></dd></div>
              <div><dt><T>Release</T></dt><dd><T>Q1 2027</T></dd></div>
              <div><dt><T>Genre</T></dt><dd><T>Desktop life simulation</T></dd></div>
              <div><dt><T>Platform</T></dt><dd>Windows</dd></div>
            </dl>
            <div className="button-stack">
              <Link className="button photon-button" href="/#games"><T>Explore our games</T> <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <OtherGames currentGame="photoncytosis" />
      </main>
      <SiteFooter />
    </div>
  );
}
