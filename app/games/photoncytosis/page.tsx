import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "../../components/JsonLd";
import { T } from "../../components/LanguageProvider";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { createBreadcrumbJsonLd, createGameJsonLd, createPageMetadata } from "../../lib/seo";

const description =
  "Photoncytosis is an in-development desktop-life simulation from Imponix Game Studio. A small organism feeds on screen light, stores energy cell by cell, and grows beside you.";

export const metadata: Metadata = {
  ...createPageMetadata({
    path: "/games/photoncytosis",
    title: "Photoncytosis – A Living Organism on Your Desktop | Imponix",
    description,
    image: "/games/photoncytosis/logo.png",
    imageAlt: "Photoncytosis pixel-art wordmark and luminous cell grid",
  }),
  robots: { index: false, follow: false },
};

const gameJsonLd = createGameJsonLd({
  path: "/games/photoncytosis",
  name: "Photoncytosis",
  description,
  image: "/games/photoncytosis/logo.png",
  genre: ["Desktop life simulation", "Idle simulation"],
  operatingSystem: "Windows",
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "Photoncytosis", path: "/games/photoncytosis" },
]);

const cells = [
  { kind: "structural", x: 39, y: 45 },
  { kind: "feeder", x: 48, y: 43 },
  { kind: "structural", x: 56, y: 48 },
  { kind: "motor", x: 45, y: 54 },
  { kind: "feeder", x: 53, y: 58 },
  { kind: "structural", x: 62, y: 56 },
  { kind: "motor", x: 35, y: 56 },
] as const;

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
        <section className="photon-hero" aria-labelledby="photon-title">
          <div className="page-width photon-hero__inner">
            <div className="photon-hero__copy">
              <p className="eyebrow photon-eyebrow"><T>Imponix Game 04 · In development</T></p>
              <Image
                className="photon-logo photon-logo--hero"
                src="/games/photoncytosis/logo.png"
                alt="Photoncytosis"
                width={1050}
                height={420}
                priority
              />
              <h1 id="photon-title"><T>What if your desktop could grow a little life?</T></h1>
              <p className="photon-hero__lede">
                <T>Meet a tiny organism that lives beside your work. It follows the light on your screen, stores energy in its cells, and slowly becomes something more.</T>
              </p>
              <a className="button photon-button" href="#idea"><T>Meet the organism</T> <span aria-hidden="true">↓</span></a>
              <p className="photon-hero__status"><span aria-hidden="true" /><T>Windows-first prototype · No release date announced</T></p>
            </div>
            <div className="photon-display" aria-label="Illustrative preview of Photoncytosis cells over a desktop light field">
              <div className="photon-display__window">
                <div className="photon-display__bar"><span>PHOTON FIELD / 001</span><span>● ● ●</span></div>
                <div className="photon-display__light" />
                <div className="photon-display__orbit photon-display__orbit--one" />
                <div className="photon-display__orbit photon-display__orbit--two" />
                {cells.map((cell, index) => (
                  <Image
                    key={index}
                    className="photon-display__cell"
                    style={{ left: `${cell.x}%`, top: `${cell.y}%` }}
                    src={`/games/photoncytosis/${cell.kind}-cell.png`}
                    alt=""
                    width={16}
                    height={16}
                    unoptimized
                  />
                ))}
                <span className="photon-display__annotation photon-display__annotation--light">LIGHT / 82%</span>
                <span className="photon-display__annotation photon-display__annotation--cell">7 CELLS / GROWING</span>
              </div>
              <p><T>Concept visualization using sprites from the current prototype.</T></p>
            </div>
          </div>
        </section>

        <nav className="photon-nav" aria-label="Photoncytosis sections">
          <div className="page-width">
            <a href="#idea"><T>The idea</T></a>
            <a href="#life"><T>How it lives</T></a>
            <a href="#prototype"><T>Inside the prototype</T></a>
            <a href="#status"><T>Status</T></a>
          </div>
        </nav>

        <section className="photon-intro page-width" id="idea">
          <p className="eyebrow photon-eyebrow"><T>A different kind of desktop companion</T></p>
          <div>
            <h2><T>Not a wallpaper. Not a pet in a box.</T></h2>
            <p><T>Photoncytosis is a desktop-life simulation in development. A soft-bodied creature takes the light and colour of your screen as its environment, turning everyday computer use into a habitat you can watch change.</T></p>
          </div>
        </section>

        <section className="photon-life" id="life" aria-labelledby="photon-life-title">
          <div className="page-width">
            <div className="photon-life__heading">
              <p className="eyebrow photon-eyebrow"><T>Its own small world</T></p>
              <h2 id="photon-life-title"><T>Life, one cell at a time.</T></h2>
            </div>
            <div className="photon-life__grid">
              {features.map((feature) => (
                <article key={feature.number}>
                  <span>{feature.number} / 03</span>
                  <h3><T>{feature.title}</T></h3>
                  <p><T>{feature.description}</T></p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="photon-prototype page-width" id="prototype">
          <div className="photon-prototype__copy">
            <p className="eyebrow photon-eyebrow"><T>Inside the prototype</T></p>
            <h2><T>Look closer. Let it wander.</T></h2>
            <p><T>The current Windows prototype includes an inspection zoom, photo mode, saves, and a way to place the organism in a selected window. Its controls and presentation are still being refined.</T></p>
            <p className="photon-prototype__note"><T>Development interface shown. The final game may look different.</T></p>
          </div>
          <figure className="photon-prototype__screen">
            <Image
              src="/games/photoncytosis/development-menu.png"
              alt="Current Photoncytosis development menu with organism status, microscope, photo mode, and habitat controls"
              width={388}
              height={604}
              unoptimized
            />
            <figcaption><T>Current development build</T></figcaption>
          </figure>
        </section>

        <section className="photon-status" id="status">
          <div className="page-width photon-status__inner">
            <div>
              <p className="eyebrow photon-eyebrow"><T>Still growing</T></p>
              <h2><T>We are building the life behind the pixels.</T></h2>
              <p><T>Photoncytosis is an evolving prototype, not a release announcement. We are not sharing a Steam link or launch date on this preview yet; we will update this page as the game takes shape.</T></p>
            </div>
            <a className="button photon-button" href="/#games"><T>Explore our games</T> <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
