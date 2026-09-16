import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../../../components/ExternalLinkIcon";
import { JsonLd } from "../../../components/JsonLd";
import { T } from "../../../components/LanguageProvider";
import { NoemaPressTrailer } from "./NoemaPressTrailer";
import { SiteFooter } from "../../../components/SiteFooter";
import { SiteHeader } from "../../../components/SiteHeader";
import { createBreadcrumbJsonLd, createPageMetadata } from "../../../lib/seo";

const pageDescription =
  "Official NOEMA press kit with facts, descriptions, screenshots, logos, key art, trailer, and contact information from Imponix Game Studio.";

export const metadata: Metadata = createPageMetadata({
  path: "/games/noema/press-kit",
  title: "NOEMA Press Kit | Imponix Game Studio",
  description: pageDescription,
  image: "/games/noema/main-capsule.png",
  imageAlt: "NOEMA terminal signal artwork",
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: "Imponix Game Studio", path: "/" },
  { name: "Press kits", path: "/press" },
  { name: "NOEMA press kit", path: "/games/noema/press-kit" },
]);

const facts = [
  ["Release", "Q4 2026"],
  ["Developer", "Imponix Game Studio"],
  ["Publisher", "Imponix Game Studio"],
  ["Platforms", "Windows · Linux"],
  ["Genre", "Psychological horror · Narrative"],
  ["Players", "Single-player"],
  ["Price", "To be announced"],
  ["Steam App ID", "5253880"],
];

const highlights = [
  {
    number: "01",
    title: "A terminal-sized mystery",
    text: "The entire experience lives inside an unfamiliar computer terminal that observes every response.",
  },
  {
    number: "02",
    title: "Routine becomes ritual",
    text: "Reconcile records, identify patterns, and process packages whose purpose is never fully explained.",
  },
  {
    number: "03",
    title: "Read between the signals",
    text: "Numbers, positions, tones, static, and corrupted pixels slowly assemble a message that was not meant for you.",
  },
  {
    number: "04",
    title: "Designed to stay nearby",
    text: "Work at your own pace and let the quiet terminal sit beside everyday life until you decide to look again.",
  },
];

const screenshots = [
  {
    src: "/games/noema/press/01-record-reconciliation.png",
    label: "01 / Record reconciliation",
    alt: "NOEMA terminal showing a record reconciliation assignment",
  },
  {
    src: "/games/noema/press/02-signal-terminal.png",
    label: "02 / Signal terminal",
    alt: "NOEMA terminal interface with records and phosphor-green controls",
  },
  {
    src: "/games/noema/press/03-encoded-message.png",
    label: "03 / Encoded message",
    alt: "NOEMA terminal showing an incomplete encoded message",
  },
  {
    src: "/games/noema/press/04-package-archive.png",
    label: "04 / Package archive",
    alt: "NOEMA terminal showing the package archive workspace",
  },
  {
    src: "/games/noema/press/05-signal-interference.png",
    label: "05 / Signal interference",
    alt: "NOEMA terminal showing signal interference across a number field",
  },
];

const brandAssets = [
  {
    src: "/games/noema/library-logo.png",
    title: "Primary logo",
    details: "Transparent PNG · 800 × 720",
    className: "noema-press-brand-card--logo",
  },
  {
    src: "/games/noema/icon.png",
    title: "NOEMA symbol",
    details: "Transparent PNG · 1024 × 1024",
    className: "noema-press-brand-card--icon",
  },
  {
    src: "/games/noema/main-capsule.png",
    title: "Main key art",
    details: "PNG · 1232 × 706",
    className: "noema-press-brand-card--key-art",
  },
];

function DownloadLink({ href, label, asset }: { href: string; label: string; asset?: string }) {
  return (
    <a
      className="noema-press-download"
      href={href}
      download
      data-track-event="press_kit_click"
      data-track-placement="noema_press_kit"
      data-track-label={asset ? `Download NOEMA ${asset}` : label}
    >
      <T>{label}</T>{asset && <span className="sr-only">: <T>{asset}</T></span>} <span aria-hidden="true">↓</span>
    </a>
  );
}

export default function NoemaPressKitPage() {
  return (
    <div className="site-shell noema-press-kit">
      <JsonLd data={breadcrumbJsonLd} />
      <SiteHeader />
      <main>
        <section className="noema-press-hero">
          <div className="noema-press-hero__background" aria-hidden="true" />
          <div className="page-width noema-press-hero__inner">
            <div className="noema-press-hero__copy">
              <a className="noema-press-back" href="/press"><span aria-hidden="true">←</span> <T>All press kits</T></a>
              <p className="eyebrow noema-eyebrow"><T>Official media resources / 2026</T></p>
              <Image
                className="noema-press-hero__logo"
                src="/games/noema/library-logo.png"
                alt="NOEMA"
                width={800}
                height={720}
                priority
              />
              <h1><span className="sr-only">NOEMA </span><T>Press kit</T></h1>
              <p>
                <T>Facts, descriptions, screenshots, logos, key art, and the official trailer for NOEMA.</T>
              </p>
              <div className="button-row">
                <a
                  className="button noema-button"
                  href="/games/noema/noema-press-kit.zip"
                  download
                  data-track-event="press_kit_click"
                  data-track-placement="noema_press_kit_hero"
                  data-track-label="Download complete NOEMA press kit ZIP"
                >
                  <T>Download complete kit</T> <span aria-hidden="true">↓</span>
                </a>
                <a
                  className="text-link noema-text-link"
                  href="https://store.steampowered.com/app/5253880/NOEMA/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <T>View on Steam</T> <ExternalLinkIcon />
                </a>
              </div>
            </div>
            <figure className="noema-press-hero__art">
              <Image
                src="/games/noema/main-capsule.png"
                alt="NOEMA main key art with its luminous signal mark"
                width={1232}
                height={706}
                sizes="(max-width: 900px) 100vw, 52vw"
                priority
              />
              <figcaption>
                <span>NOEMA / Q4 2026</span>
                <strong><T>Official key art</T></strong>
              </figcaption>
            </figure>
          </div>
        </section>

        <nav className="game-local-nav game-local-nav--noema" aria-label="NOEMA press kit sections">
          <div className="page-width">
            <a href="#overview"><T>Overview</T></a>
            <a href="#descriptions"><T>Descriptions</T></a>
            <a href="#media"><T>Media</T></a>
            <a href="#branding"><T>Branding</T></a>
            <a href="#contact"><T>Contact</T></a>
          </div>
        </nav>

        <section className="noema-press-overview page-width" id="overview">
          <div className="noema-press-overview__intro">
            <p className="eyebrow noema-eyebrow"><T>Factsheet / connection open</T></p>
            <h2><T>There is work waiting for you.</T></h2>
            <p>
              <T>NOEMA is a quiet psychological horror experience set entirely inside an unfamiliar computer terminal.</T>
            </p>
            <DownloadLink href="/games/noema/NOEMA-factsheet.txt" label="Download factsheet (English)" />
          </div>
          <dl className="noema-press-facts">
            {facts.map(([term, detail]) => (
              <div key={term}>
                <dt><T>{term}</T></dt>
                <dd><T>{detail}</T></dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="noema-press-descriptions" id="descriptions">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow noema-eyebrow"><T>Game descriptions</T></p>
                <h2><T>About NOEMA.</T></h2>
              </div>
              <DownloadLink href="/games/noema/NOEMA-descriptions.txt" label="Download text (English)" />
            </div>
            <div className="noema-press-copy-grid">
              <article>
                <span><T>Short description</T></span>
                <p>
                  <T>NOEMA is a quiet psychological horror experience set entirely inside an unfamiliar computer terminal. Follow the procedures, process the records, and read messages never meant for you.</T>
                </p>
              </article>
              <article>
                <span><T>Full description</T></span>
                <p><T>There is work waiting for you.</T></p>
                <p>
                  <T>NOEMA is a quiet psychological horror experience set entirely inside an unfamiliar computer terminal. The system offers little explanation. It presents a task, records your response, and waits for you to continue.</T>
                </p>
                <p>
                  <T>Read signals. Identify patterns. Reconcile records. Process packages whose purpose is never made entirely clear. As routine becomes ritual, messages emerge through numbers, position, sound, and interference—and the familiar becomes impossible to ignore.</T>
                </p>
                <p><T>The system does not need you to understand it. It only needs you to keep working.</T></p>
              </article>
            </div>
            <div className="noema-press-highlights">
              {highlights.map((item) => (
                <article key={item.number}>
                  <span>{item.number}</span>
                  <h3><T>{item.title}</T></h3>
                  <p><T>{item.text}</T></p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="noema-press-media" id="media">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow noema-eyebrow"><T>Trailer / screenshots</T></p>
                <h2><T>Media archive.</T></h2>
              </div>
              <p><T>Download the original PNG files for editorial coverage, videos, and creator features.</T></p>
            </div>
            <NoemaPressTrailer />
            <div className="noema-press-screenshot-grid">
              {screenshots.map((shot) => (
                <figure className="noema-press-shot" key={shot.src}>
                  <div>
                    <Image src={shot.src} alt={shot.alt} fill sizes="(max-width: 800px) 100vw, 50vw" />
                  </div>
                  <figcaption>
                    <span><T>{shot.label}</T></span>
                    <DownloadLink href={shot.src} label="Original PNG" asset={shot.label} />
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="noema-press-branding" id="branding">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow noema-eyebrow"><T>Brand assets</T></p>
                <h2><T>Marks and key art.</T></h2>
              </div>
              <p><T>Use these assets when identifying NOEMA. Please preserve their proportions and colors.</T></p>
            </div>
            <div className="noema-press-brand-grid">
              {brandAssets.map((asset) => (
                <article className={`noema-press-brand-card ${asset.className}`} key={asset.src}>
                  <div>
                    <Image src={asset.src} alt={asset.title} fill style={{ objectFit: "contain" }} sizes="(max-width: 800px) 100vw, 33vw" />
                  </div>
                  <footer>
                    <span><strong><T>{asset.title}</T></strong><T>{asset.details}</T></span>
                    <DownloadLink href={asset.src} label="Download" asset={asset.title} />
                  </footer>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="noema-press-contact" id="contact">
          <div className="page-width noema-press-contact__inner">
            <div>
              <p className="eyebrow noema-eyebrow"><T>Press contact / Imponix</T></p>
              <h2><T>Need another format?</T></h2>
              <p className="noema-press-studio"><T>Imponix is a two-person independent game studio working between Montréal, Québec, Canada, and Fortaleza, Ceará, Brazil. We make Game Store Chronicle, Veil of Shadows, and NOEMA.</T></p>
              <p><T>For interviews, preview access, additional materials, or other press enquiries, contact Imponix Game Studio.</T></p>
            </div>
            <div className="noema-press-contact__actions">
              <a className="button noema-button" href="mailto:contact@imponix.com">contact@imponix.com</a>
              <a className="noema-press-download" href="/games/noema"><T>Visit the NOEMA page</T> <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
