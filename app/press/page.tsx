import type { Metadata } from "next";
import Image from "next/image";
import { ExternalLinkIcon } from "../components/ExternalLinkIcon";
import { T } from "../components/LanguageProvider";
import { SiteFooter } from "../components/SiteFooter";
import { SiteHeader } from "../components/SiteHeader";
import { createPageMetadata } from "../lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/press",
  title: "Press Kits | Imponix Game Studio",
  description:
    "Official press kits, screenshots, logos, trailers, and facts for Imponix Game Studio, Game Store Chronicle, NOEMA, Veil of Shadows, Photoncytosis, and Muchi.",
});

// Earliest full-game release first; NOEMA and Photoncytosis share Q1 2027.
const pressKits = [
  {
    title: "Veil of Shadows",
    type: "Action-adventure / Roguelite",
    status: "Released September 12, 2024",
    className: "press-card--vos",
    image: "/games/vos/hero.jpg",
    imageAlt: "Sirene drawing her bow in the forest in Veil of Shadows",
    href: "https://impress.games/press-kit/imponix-game-studio/veil-of-shadows",
    external: true,
  },
  {
    title: "Game Store Chronicle",
    type: "Management simulation",
    status: "Released July 13, 2026",
    className: "press-card--gsc",
    image: "/games/gsc/feature.jpg",
    imageAlt: "An Ultravision console and joystick displayed inside Game Store Chronicle",
    href: "https://impress.games/press-kit/imponix-game-studio/gsc---game-store-chronicle",
    external: true,
  },
  {
    title: "Muchi",
    type: "Cozy desktop pet",
    status: "Pre-release · Q4 2026",
    className: "press-card--muchi",
    image: "/games/muchi/key-art.png",
    imageFit: "contain" as const,
    imageAlt: "Official Muchi artwork with the cream-and-apricot desktop pet, green leaves, and honey-coloured wordmark",
    href: "/games/muchi/press-kit",
    external: false,
  },
  {
    title: "NOEMA",
    type: "Psychological horror",
    status: "Coming Q1 2027",
    className: "press-card--noema",
    image: "/games/noema/main-capsule.png",
    imageAlt: "NOEMA terminal signal artwork",
    href: "/games/noema/press-kit",
    external: false,
  },
  {
    title: "Photoncytosis",
    type: "Desktop life simulation",
    status: "Demo available · Full game Q1 2027",
    className: "press-card--photoncytosis",
    image: "/games/photoncytosis/key-art.png",
    imageFit: "contain" as const,
    imageAlt: "Photoncytosis illustrated key art: a branching pixel organism draws light from a desktop window",
    href: "/games/photoncytosis/press-kit",
    external: false,
  },
];

export default function PressPage() {
  return (
    <div className="site-shell press-page">
      <SiteHeader />
      <main>
        <section className="simple-hero page-width">
          <p className="eyebrow eyebrow--blue"><T>Press & creators</T></p>
          <h1><T>Everything you need</T><br /><T>to tell the story.</T></h1>
          <p>
            <T>Official factsheets, descriptions, logos, screenshots, and trailers for Imponix games.</T>
          </p>
        </section>

        <section className="press-grid page-width" aria-label="Game press kits">
          {pressKits.map((kit, index) => (
            <a
              className={`press-card ${kit.className}`}
              href={kit.href}
              target={kit.external ? "_blank" : undefined}
              rel={kit.external ? "noreferrer" : undefined}
              key={kit.title}
              data-track-event="press_kit_click"
              data-track-placement="press_index"
            >
              <div className="press-card__media">
                <Image
                  src={kit.image}
                  alt={kit.imageAlt}
                  fill
                  className={kit.imageFit === "contain" ? "press-card__image--contain" : undefined}
                  style={{ objectFit: kit.imageFit ?? "cover" }}
                  sizes="(max-width: 800px) 100vw, 50vw"
                />
              </div>
              <span className="press-card__number">{String(index + 1).padStart(2, "0")}</span>
              <div className="press-card__copy">
                <small><T>{kit.type}</T></small>
                <h2>{kit.title}</h2>
                <p><T>{kit.status}</T></p>
              </div>
              <ExternalLinkIcon />
            </a>
          ))}
        </section>

        <section className="press-contact page-width">
          <div>
            <p className="eyebrow"><T>Contact</T></p>
            <h2><T>Need something specific?</T></h2>
            <p><T>For interviews, review requests, or additional materials, get in touch directly.</T></p>
          </div>
          <a className="button button--light" href="mailto:contact@imponix.com">contact@imponix.com</a>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
