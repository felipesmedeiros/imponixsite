import type { Metadata } from "next";
import Image from "next/image";
// Restore the ExternalLinkIcon import when NOEMA's public Steam page is live.
// import { ExternalLinkIcon } from "../../components/ExternalLinkIcon";
import { JsonLd } from "../../components/JsonLd";
import { T } from "../../components/LanguageProvider";
import { SiteFooter } from "../../components/SiteFooter";
import { SiteHeader } from "../../components/SiteHeader";
import { createBreadcrumbJsonLd, createGameJsonLd, createPageMetadata } from "../../lib/seo";

const pageDescription =
  "NOEMA is a quiet, unsettling narrative game inside an unfamiliar computer terminal. Read the signals, follow the procedures, and keep the system moving.";

export const metadata: Metadata = createPageMetadata({
  path: "/games/noema",
  title: "NOEMA – Experimental Narrative Game | Imponix",
  description: pageDescription,
  image: "/games/noema/main-capsule.png",
  imageAlt: "The NOEMA terminal and its luminous signal mark",
});

const gameJsonLd = createGameJsonLd({
  path: "/games/noema",
  name: "NOEMA",
  description: pageDescription,
  image: "/games/noema/main-capsule.png",
  genre: ["Experimental narrative", "Idle game"],
  operatingSystem: ["Windows", "Linux"],
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "NOEMA", path: "/games/noema" },
]);

const noemaFeatures = [
  [
    "Learn the system",
    "Reconcile records, follow number patterns, and process packages whose purpose is never made entirely clear.",
  ],
  [
    "Let it become familiar",
    "Keep the compact terminal beside your everyday life as routine slowly turns into ritual.",
  ],
  [
    "Read what is missing",
    "Decode fragments through numbers, position, and sound, then watch a larger message take shape.",
  ],
  [
    "Pay attention",
    "Static, corrupted pixels, and small inconsistencies suggest the system may not want to be understood.",
  ],
];

const noemaScreenshots = [
  {
    src: "/games/noema/screenshot-reconciliation.png",
    alt: "NOEMA terminal showing a record reconciliation assignment",
    label: "01 / Ordinary work",
    caption: "Correct the received values to match the reference.",
    className: "noema-media-card--wide",
  },
  {
    src: "/games/noema/screenshot-message.png",
    alt: "NOEMA terminal showing an incomplete encoded message and signal sequence",
    label: "02 / The message",
    caption: "A message is taking shape.",
    className: "",
  },
  {
    src: "/games/noema/screenshot-interference.png",
    alt: "NOEMA terminal showing signal interference across a number field",
    label: "03 / The interference",
    caption: "Something is resisting the reading.",
    className: "",
  },
  {
    src: "/games/noema/screenshot-archive.png",
    alt: "NOEMA terminal showing the package archive workspace",
    label: "04 / The archive",
    caption: "Keep the record. Follow its lineage.",
    className: "noema-media-card--wide",
  },
];

export default function NoemaPage() {
  return (
    <div className="site-shell noema-page">
      <JsonLd data={gameJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <section className="noema-hero">
          <div className="noema-hero__background" aria-hidden="true" />
          <div className="page-width noema-hero__inner">
            <div className="noema-hero__copy">
              <p className="eyebrow noema-eyebrow"><T>Imponix Game 03 · Coming 2026</T></p>
              <Image
                className="noema-title-lockup"
                src="/games/noema/library-logo.png"
                alt="NOEMA"
                width={800}
                height={720}
                priority
              />
              <h1><T>There is work waiting for you.</T></h1>
              <p className="noema-hero__lede">
                <T>Take your place at the terminal. Read the signals, follow the procedures, and keep the system moving—until the familiar becomes impossible to ignore.</T>
              </p>
              <div className="button-row">
                {/* Restore when NOEMA's public Steam page is live.
                <a
                  className="button noema-button"
                  href="https://store.steampowered.com/app/5253880/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wishlist on Steam <ExternalLinkIcon />
                </a>
                */}
                <a className="text-link noema-text-link" href="#signal">
                  <T>Enter the terminal ↓</T>
                </a>
              </div>
            </div>

            <figure className="noema-hero__visual">
              <Image
                src="/games/noema/screenshot-reconciliation.png"
                alt="The NOEMA terminal displaying a record-reconciliation assignment"
                fill
                sizes="(max-width: 900px) 100vw, 58vw"
                priority
              />
              <figcaption>
                <span><T>NOEMA / TERMINAL</T></span>
                <strong><T>Connection restored_</T></strong>
              </figcaption>
            </figure>
          </div>
          <div className="noema-hero__readout" aria-hidden="true">
            <span>TRACE / 00%</span>
            <i />
            <span>NO EXTERNAL OPERATOR</span>
          </div>
        </section>

        <nav className="game-local-nav game-local-nav--noema" aria-label="NOEMA sections">
          <div className="page-width">
            <a href="#signal"><T>The signal</T></a>
            <a href="#system"><T>The system</T></a>
            <a href="#media"><T>Screenshots</T></a>
            <a href="#details"><T>Details</T></a>
          </div>
        </nav>

        <section className="noema-intro page-width" id="signal">
          <div className="noema-intro__copy">
            <p className="eyebrow noema-eyebrow"><T>The signal</T></p>
            <h2><T>A quiet terminal with an uncertain purpose.</T></h2>
            <p>
              <T>NOEMA is an experimental narrative experience contained inside an unfamiliar computer terminal. At first, the assignment is simple: correct a record, process a fragment, and wait. Then the work begins to reveal the people it has consumed.</T>
            </p>
          </div>
          <figure className="noema-intro__screen">
            <Image
              src="/games/noema/screenshot-terminal.png"
              alt="NOEMA terminal interface with an assignment, records, and phosphor-green controls"
              fill
              sizes="(max-width: 900px) 100vw, 54vw"
            />
            <figcaption><T>Every action produces a response.</T></figcaption>
          </figure>
        </section>

        <section className="noema-system" id="system" aria-labelledby="noema-system-title">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow noema-eyebrow"><T>The system</T></p>
                <h2 id="noema-system-title"><T>Routine becomes ritual.</T></h2>
              </div>
              <p>
                <T>Work at your own pace. The terminal can stay beside you, waiting quietly until you decide to look again.</T>
              </p>
            </div>
            <div className="noema-feature-grid">
              {noemaFeatures.map(([title, text], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <h3><T>{title}</T></h3>
                  <p><T>{text}</T></p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="noema-media" id="media" aria-labelledby="noema-media-title">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow noema-eyebrow"><T>Signal / evidence</T></p>
                <h2 id="noema-media-title"><T>Look closer.</T></h2>
              </div>
              <p>
                <T>Numbers, tones, archives, and small irregularities. Nothing on the screen is asking to be believed without observation.</T>
              </p>
            </div>
            <div className="noema-media-grid">
              {noemaScreenshots.map((shot) => (
                <figure className={`noema-media-card ${shot.className}`} key={shot.src}>
                  <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 760px) 100vw, 50vw" />
                  <figcaption>
                    <span><T>{shot.label}</T></span>
                    <strong><T>{shot.caption}</T></strong>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="noema-details" id="details">
          <div className="page-width noema-details__inner">
            <div>
              <p className="eyebrow noema-eyebrow"><T>Connection pending</T></p>
              <h2><T>Keep working.</T></h2>
              <p>
                <T>NOEMA is in development. Return here for news, future builds, and the moment the connection opens.</T>
              </p>
            </div>
            <dl>
              <div><dt><T>Status</T></dt><dd><T>Coming 2026</T></dd></div>
              <div><dt><T>Genre</T></dt><dd><T>Experimental narrative / idle</T></dd></div>
              <div><dt><T>Platform</T></dt><dd>PC · Windows + Linux</dd></div>
              <div><dt><T>Players</T></dt><dd><T>Single-player</T></dd></div>
            </dl>
            {/* Restore when NOEMA's public Steam page is live.
            <a className="button noema-button" href="https://store.steampowered.com/app/5253880/" target="_blank" rel="noreferrer">
              Follow NOEMA on Steam <ExternalLinkIcon />
            </a>
            */}
          </div>
        </section>

        <nav className="next-game next-game--noema page-width" aria-label="More Imponix games">
          <span><T>Other worlds</T></span>
          <a href="/games/game-store-chronicle">Game Store Chronicle <b aria-hidden="true">→</b></a>
          <a href="/games/veil-of-shadows">Veil of Shadows <b aria-hidden="true">→</b></a>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}
