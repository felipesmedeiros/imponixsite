import Image from "next/image";
import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { JsonLd } from "./JsonLd";
import { T } from "./LanguageProvider";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { createBreadcrumbJsonLd } from "../lib/seo";

type PressAsset = { src: string; title: string; alt: string; format: string; kind?: string };
type PressKit = {
  slug: string;
  name: string;
  website: string;
  steam: string;
  trailer?: string;
  tagline: string;
  shortDescription: string;
  paragraphs: string[];
  facts: string[][];
  highlights: { title: string; text: string }[];
  logo: { src: string; width: number; height: number };
  keyArt: { src: string; alt: string };
  assets: PressAsset[];
  screenshots: PressAsset[];
};

function Download({ kit, href, label, asset, button = false }: {
  kit: PressKit; href: string; label: string; asset: string; button?: boolean;
}) {
  return (
    <a className={button ? "button desktop-press-button" : "desktop-press-download"} href={href} download
      data-track-event="press_kit_click" data-track-placement={`${kit.slug}_press_kit`}
      data-track-label={`Download ${kit.name} ${asset}`}>
      <T>{label}</T><span className="sr-only">: <T>{asset}</T></span> <span aria-hidden="true">↓</span>
    </a>
  );
}

export function DesktopPressKit({ kit }: { kit: PressKit }) {
  const downloadRoot = `/games/${kit.slug}/press-kit`;
  return (
    <div className={`site-shell desktop-press-kit desktop-press-kit--${kit.slug}`}>
      <JsonLd data={createBreadcrumbJsonLd([
        { name: "Imponix Game Studio", path: "/" },
        { name: "Press kits", path: "/press" },
        { name: `${kit.name} press kit`, path: downloadRoot },
      ])} />
      <SiteHeader />
      <main>
        <section className="desktop-press-hero page-width" aria-labelledby="press-title">
          <div>
            <a className="desktop-press-back" href="/press"><span aria-hidden="true">←</span> <T>All press kits</T></a>
            <p className="eyebrow"><T>For press and creators</T></p>
            <Image className="desktop-press-logo" src={kit.logo.src} alt={kit.name} width={kit.logo.width} height={kit.logo.height} priority unoptimized />
            <h1 id="press-title"><span className="sr-only">{kit.name} </span><T>Press kit</T></h1>
            <p><T>Facts, descriptions, screenshots, and brand assets.</T></p>
            <div className="button-row">
              <Download kit={kit} href={`${downloadRoot}/${kit.slug}-press-kit-en.zip`} label="Download complete kit (English)" asset="Complete kit" button />
              <a className="text-link" href={kit.steam} target="_blank" rel="noreferrer" data-track-placement={`${kit.slug}_press_kit`}><T>View on Steam</T> <ExternalLinkIcon /></a>
            </div>
            <p className="desktop-press-note"><T>The ZIP includes English text and original media files.</T></p>
          </div>
          <figure className="desktop-press-key-art">
            <div><Image src={kit.keyArt.src} alt={kit.keyArt.alt} fill style={{ objectFit: "contain" }} sizes="(max-width: 900px) 100vw, 50vw" priority unoptimized /></div>
            <figcaption>{kit.name} <span><T>Official key art</T></span></figcaption>
          </figure>
        </section>

        <nav className="game-local-nav desktop-press-nav" aria-label={`${kit.name} press kit sections`}>
          <div className="page-width">
            <a href="#overview"><T>Overview</T></a>
            <a href="#descriptions"><T>Descriptions</T></a>
            <a href="#media"><T>Media</T></a>
            <a href="#branding"><T>Branding</T></a>
            <a href="#contact"><T>Contact</T></a>
          </div>
        </nav>

        <section className="desktop-press-overview page-width" id="overview" aria-labelledby="facts-title">
          <div>
            <p className="eyebrow"><T>Factsheet</T></p>
            <h2 id="facts-title"><T>{kit.tagline}</T></h2>
            <p><T>{kit.shortDescription}</T></p>
            <Download kit={kit} href={`${downloadRoot}/factsheet-en.txt`} label="Download factsheet (English)" asset="Factsheet" />
            <p className="desktop-press-note"><T>Release windows refer to the planned full-game release.</T></p>
          </div>
          <dl className="desktop-press-facts">
            {kit.facts.map(([term, detail]) => <div key={term}><dt><T>{term}</T></dt><dd><T>{detail}</T></dd></div>)}
          </dl>
        </section>

        <section className="desktop-press-panel" id="descriptions" aria-labelledby="description-title">
          <div className="page-width">
            <div className="section-heading section-heading--split">
              <div><p className="eyebrow"><T>Game descriptions</T></p><h2 id="description-title"><T>About the game.</T></h2></div>
              <Download kit={kit} href={`${downloadRoot}/descriptions-en.txt`} label="Download text (English)" asset="Descriptions" />
            </div>
            <div className="desktop-press-copy">
              <article><h3><T>Short description</T></h3><p><T>{kit.shortDescription}</T></p></article>
              <article><h3><T>Full description</T></h3>{kit.paragraphs.map((paragraph) => <p key={paragraph}><T>{paragraph}</T></p>)}</article>
            </div>
            <div className="desktop-press-highlights">
              {kit.highlights.map((item, index) => <article key={item.title}><span aria-hidden="true">0{index + 1}</span><h3><T>{item.title}</T></h3><p><T>{item.text}</T></p></article>)}
            </div>
          </div>
        </section>

        <section className="desktop-press-media page-width" id="media" aria-labelledby="media-title">
          <div className="section-heading section-heading--split">
            <div><p className="eyebrow"><T>Screenshots</T></p><h2 id="media-title"><T>Media archive.</T></h2></div>
            {kit.trailer && <a className="text-link" href={kit.trailer} target="_blank" rel="noreferrer" data-track-label={`Watch ${kit.name} teaser on YouTube`} data-track-placement={`${kit.slug}_press_kit`}><T>Watch on YouTube</T> <ExternalLinkIcon /></a>}
          </div>
          <p className="desktop-press-note"><T>Development screenshots. The final game may look different.</T></p>
          <div className="desktop-press-screenshots">
            {kit.screenshots.map((shot) => <figure key={shot.src}>
              <div><Image src={shot.src} alt={shot.alt} fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 100vw, 50vw" unoptimized /></div>
              <figcaption><span><T>{shot.title}</T></span><Download kit={kit} href={shot.src} label="Download" asset={shot.title} /></figcaption>
            </figure>)}
          </div>
        </section>

        <section className="desktop-press-panel" id="branding" aria-labelledby="branding-title">
          <div className="page-width">
            <div className="section-heading"><p className="eyebrow"><T>Brand assets</T></p><h2 id="branding-title"><T>Marks and key art.</T></h2></div>
            <p className="desktop-press-note"><T>Please preserve logo proportions and colors.</T></p>
            <div className="desktop-press-assets">
              {kit.assets.map((asset) => <article className={`desktop-press-asset desktop-press-asset--${asset.kind}`} key={asset.src}>
                <div><Image src={asset.src} alt={asset.alt} fill style={{ objectFit: "contain" }} sizes="(max-width: 760px) 100vw, 33vw" unoptimized /></div>
                <footer><span><strong><T>{asset.title}</T></strong>{asset.format}</span><Download kit={kit} href={asset.src} label="Download" asset={asset.title} /></footer>
              </article>)}
            </div>
          </div>
        </section>

        <section className="desktop-press-contact page-width" id="contact" aria-labelledby="contact-title">
          <div><p className="eyebrow"><T>Press contact / Imponix</T></p><h2 id="contact-title"><T>Need another format?</T></h2><p><T>For interviews, preview access, additional materials, or other press enquiries, contact Imponix Game Studio.</T></p></div>
          <div className="button-stack">
            <a className="button desktop-press-button" href="mailto:contact@imponix.com">contact@imponix.com</a>
            <a className="text-link" href={kit.website} data-track-placement={`${kit.slug}_press_kit`}><T>Visit game website</T> <ExternalLinkIcon /></a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
